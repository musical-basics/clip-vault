const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Trigger a folder selection dialog
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),

    // Listen for the results of the scan
    onFolderSelected: (callback) => ipcRenderer.on('folder-selected', callback)
});
