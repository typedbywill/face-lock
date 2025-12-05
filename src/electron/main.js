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

let mainWindow;
let service;
let detector;
let repository;

async function setupBackend() {
    console.log("Inicializando Backend...");

    repository = new DescriptorRepository(config.descriptorFile);
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
        config
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
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        // mainWindow.webContents.openDevTools(); 
        mainWindow.setMenu(null);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
        mainWindow.setMenu(null);
    }
}

app.whenReady().then(async () => {
    await setupBackend();
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
    return repository ? repository.loadAll() : [];
});

ipcMain.handle('remove-face', (event, id) => {
    if (repository) {
        repository.removeUser(id);
        return true;
    }
    return false;
});

// Import BufferIfNeeded
import { Buffer } from 'buffer';
import crypto from 'crypto';
import { getFaceDescriptor } from '../infrastructure/face-api/face-utils.js';

ipcMain.handle('add-face', async (event, { name, imageBase64 }) => {
    try {
        // 1. Convert Base64 to Buffer
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        // 2. Pause Monitor if running (to prevent conflict or false locks)
        // O monitor service na verdade não conflita com camera SE a camera for liberada
        // Mas aqui estamos recebendo a imagem já capturada pelo frontend, então sem conflito de hardware.
        // O unico conflito seria o Detector estar ocupado? JS é single thread no main process... 
        // Como getFaceDescriptor é async e pesado, pode bloquear o event loop se não cuidarmos?
        // Electron roda o Node em uma thread. FaceAPI usa TFJS Node binding que é otimizado.

        // 3. Detect
        const descriptor = await getFaceDescriptor(buffer);

        if (!descriptor) {
            return { success: false, error: "Nenhum rosto detectado na imagem." };
        }

        // 4. Save
        const user = {
            id: crypto.randomUUID(),
            name,
            descriptor: Array.from(descriptor),
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };

        repository.addUser(user);
        return { success: true };

    } catch (err) {
        console.error("Erro ao adicionar face:", err);
        return { success: false, error: err.message };
    }
});
