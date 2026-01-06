const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      // Security: contextIsolation must be true for preload to work correctly
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'), 
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '.next/server/pages/index.html')}`;
  mainWindow.loadURL(startUrl);
}

// --- IPC HANDLERS (The "Backend" Logic) ---

// 1. Listen for the "Open Folder" click
ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (canceled) return;

  const folderPath = filePaths[0];
  scanFolder(folderPath);
});

// 2. Scan the folder for video files
function scanFolder(dirPath) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error("Could not read directory", err);
      return;
    }

    // Filter for video extensions
    const videoExtensions = ['.mp4', '.mov', '.mkv', '.avi'];
    const videoFiles = files
      .filter(file => videoExtensions.includes(path.extname(file).toLowerCase()))
      .map(file => ({
        name: file,
        path: path.join(dirPath, file), // Full path is needed for playback
        type: 'video'
      }));

    // Send the data back to the React Frontend
    mainWindow.webContents.send('folder-selected', videoFiles);
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
