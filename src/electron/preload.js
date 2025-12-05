const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getStatus: () => ipcRenderer.invoke('get-status'),
    startMonitor: () => ipcRenderer.invoke('start-monitor'),
    stopMonitor: () => ipcRenderer.invoke('stop-monitor'),
    getFaces: () => ipcRenderer.invoke('get-faces'),
    removeFace: (id) => ipcRenderer.invoke('remove-face', id),
    addFace: (data) => ipcRenderer.invoke('add-face', data),
});
