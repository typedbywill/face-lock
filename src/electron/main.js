import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Domain & Infra Imports
import config from '../config/ConfigLoader.js';
import { NodeWebcamAdapter } from '../infrastructure/camera/NodeWebcamAdapter.js';
import { DescriptorRepository } from '../infrastructure/face-api/DescriptorRepository.js';
import { ModelLoader } from '../infrastructure/face-api/ModelLoader.js';
import { FaceApiDetector } from '../infrastructure/face-api/FaceApiDetector.js';
import { SystemLockFactory } from '../infrastructure/system/SystemLockFactory.js';
import { PresenceTracker } from '../domain/presence/PresenceTracker.js';
import { MonitorService } from '../application/services/MonitorService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Canvas for cropping
import { createCanvas, Image } from 'canvas';

// Helper to crop face
async function cropFace(buffer, detection) {
    const img = new Image();
    img.src = buffer;

    // Safety margin
    const margin = 50;
    const box = detection.detection.box;

    let x = Math.max(0, box.x - margin);
    let y = Math.max(0, box.y - margin);
    let w = Math.min(img.width - x, box.width + (margin * 2));
    let h = Math.min(img.height - y, box.height + (margin * 2));

    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

    return canvas.toBuffer('image/jpeg');
}

import { dbConnection } from '../infrastructure/database/DatabaseConnection.js';
import { SettingsRepository } from '../infrastructure/database/SettingsRepository.js';
import { HistoryRepository } from '../infrastructure/database/HistoryRepository.js';

let mainWindow;
let service;
let detector;
let repository;
let db;
let settingsRepo;
let historyRepo;

async function setupBackend(responseDataPath) {
    console.log("Inicializando Backend...");

    // DB Setup
    const dbPath = path.join(responseDataPath, 'autolock.db');
    db = dbConnection.getInstance(dbPath);
    settingsRepo = new SettingsRepository(db);
    historyRepo = new HistoryRepository(db);

    // Images Dir
    const imagesDir = path.join(responseDataPath, 'faces');

    repository = new DescriptorRepository(config.descriptorFile, imagesDir);
    const modelLoader = new ModelLoader(config.modelPath);
    detector = new FaceApiDetector(repository, modelLoader, config.monitor.threshold);

    await detector.init();

    const camera = new NodeWebcamAdapter(config.camera);
    const locker = SystemLockFactory.create(config);
    const tracker = new PresenceTracker();

    service = new MonitorService({
        camera,
        detector,
        locker,
        tracker,
        config,
        historyRepo
    });

    console.log("Backend pronto.");
}

function createWindow() {
    const isDev = process.env.NODE_ENV === 'development';

    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            devTools: true
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
        mainWindow.setMenu(null);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
        mainWindow.setMenu(null);
    }
}

app.whenReady().then(async () => {
    const userDataPath = app.getPath('userData');
    await setupBackend(userDataPath);
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (service) service.stop();
    if (process.platform !== 'darwin') app.quit();
});

// --- IPC Handlers ---

ipcMain.handle('get-status', () => {
    return service ? service.running : false;
});

ipcMain.handle('start-monitor', () => {
    if (service && !service.running) {
        service.start();
        return true;
    }
    return false;
});

ipcMain.handle('stop-monitor', () => {
    if (service && service.running) {
        service.stop();
        return true;
    }
    return false;
});

ipcMain.handle('get-faces', () => {
    if (!repository) return [];
    const users = repository.loadAll();
    // Anexar avatar base64 para UI
    return users.map(u => ({
        ...u,
        avatar: repository.getAvatarBase64(u.id)
    }));
});

ipcMain.handle('remove-face', async (event, id) => {
    if (repository) {
        repository.removeUser(id);
        repository.deleteAvatar(id);
        await detector.reload(); // Atualiza modelo
        return true;
    }
    return false;
});

// Import BufferIfNeeded
import { Buffer } from 'buffer';
import crypto from 'crypto';
// NOTE: getFaceDescriptor in face-utils might be returning just descriptor.
// We need full detection object to get bounding box for cropping.
// Let's import faceapi directly or check face-utils. 
// face-utils `getFaceDescriptor` returns `Float32Array`. 
// We need to implement detection inside here or export a new function `getFaceDetection`.
// Let's assume we can use `detector` (FaceApiDetector) which uses `faceapi`.
// But `FaceApiDetector` is initialized with loaded models.
// Let's modify FaceApiDetector to expose a raw detect method or just use faceapi here if Models are loaded.
// Models ARE loaded in setupBackend globally via ModelLoader? No, inside detector.init().
// But `faceapi` global is populated by ModelLoader/tfjs.

// We can ask FaceApiDetector to give us the full detection.
// Current FaceApiDetector.detect returns { detected, ... } but for MONITORING (SingleFace).
// Let's use `faceapi` directly here as the models are loaded.
import * as faceapi from '@vladmandic/face-api';
import * as tf from '@tensorflow/tfjs-node';

// --- History IPC ---

ipcMain.handle('get-logs', () => {
    return historyRepo ? historyRepo.getRecent(50) : [];
});

ipcMain.handle('add-face', async (event, { name, imageBase64 }) => {
    try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // Detect with Landmarks & Descriptor
        const tensor = tf.node.decodeImage(buffer);
        const detection = await faceapi.detectSingleFace(tensor)
            .withFaceLandmarks()
            .withFaceDescriptor();

        tf.dispose(tensor);

        if (!detection) {
            return { success: false, error: "Nenhum rosto detectado na imagem." };
        }

        // Generate ID
        const id = crypto.randomUUID();

        // Crop & Save Avatar
        const avatarBuffer = await cropFace(buffer, detection);
        repository.saveAvatar(id, avatarBuffer);

        // Save Data
        const user = {
            id,
            name,
            descriptor: Array.from(detection.descriptor),
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };

        repository.addUser(user);

        // Reload Models
        await detector.reload();

        return { success: true };

    } catch (err) {
        console.error("Erro ao adicionar face:", err);
        return { success: false, error: err.message };
    }
});

// --- Settings IPC ---

ipcMain.handle('get-settings', () => {
    // Merge: Default Config <--- Database Overrides
    const storedSettings = settingsRepo ? settingsRepo.getAll() : {};

    // Flatten keys handle? 
    // Na verdade nosso settingsRepo salva JSON em value.
    // Vamos assumir que salvamos objetos parciais nas chaves 'monitor', 'camera', 'lock'.

    // Vamos simplificar e salvar tudo sob chaves top-level no DB pra facilitar.
    // Ex: key='monitor', value={ delaySeconds: 10, ... }

    const finalConfig = { ...config };

    if (storedSettings.monitor) finalConfig.monitor = { ...finalConfig.monitor, ...storedSettings.monitor };
    if (storedSettings.camera) finalConfig.camera = { ...finalConfig.camera, ...storedSettings.camera };
    // etc...

    return finalConfig;
});

ipcMain.handle('save-settings', (event, newSettings) => {
    try {
        // Salva por partes
        if (newSettings.monitor) settingsRepo.set('monitor', newSettings.monitor);
        if (newSettings.camera) settingsRepo.set('camera', newSettings.camera);

        // Atualiza serviço
        if (service) {
            // Recarrega full config merged
            const storedSettings = settingsRepo.getAll();
            const finalConfig = { ...config };
            if (storedSettings.monitor) finalConfig.monitor = { ...finalConfig.monitor, ...storedSettings.monitor };
            if (storedSettings.camera) finalConfig.camera = { ...finalConfig.camera, ...storedSettings.camera };

            service.updateConfig(finalConfig);
        }

        return { success: true };
    } catch (err) {
        console.error("Error saving settings:", err);
        return { success: false, error: err.message };
    }
});
