const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Trigger a folder selection dialog
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),

    // Listen for the results of the scan
    // Listen for the results of the scan
    onFolderSelected: (callback) => ipcRenderer.on('folder-selected', callback),

    // Process a single video file
    processVideo: (filePath) => ipcRenderer.invoke('video:process', filePath)
});
