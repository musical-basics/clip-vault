const { app, BrowserWindow, ipcMain, dialog, protocol, net } = require('electron');
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

// 3. Process Video (Duration + Thumbnail)
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
// safeRequire for ffprobe-static to handle if it's missing or fails, 
// though we just installed it.
const ffprobePath = require('ffprobe-static').path;

// Tell fluent-ffmpeg where the binaries are
// IMPORTANT: Electron packs differently, we might need a fix for prod, but for dev this is standard.
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

ipcMain.handle('video:process', async (event, filePath) => {
  return new Promise((resolve, reject) => {
    // We will try to get duration from ffprobe first as it is more reliable
    let duration = "0:00";
    const thumbnailFilename = `thumb-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
    const tempDir = app.getPath('temp');

    // Helper to format duration seconds to MM:SS
    const formatDuration = (seconds) => {
      if (!seconds) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (!err && metadata && metadata.format && metadata.format.duration) {
        duration = formatDuration(metadata.format.duration);
      }

      // Proceed to generate thumbnail regardless of ffprobe result (fallbacks exist)
      ffmpeg(filePath)
        .on('end', () => {
          resolve({
            duration: duration,
            thumbnailPath: `file://${path.join(tempDir, thumbnailFilename)}`
          });
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .screenshots({
          count: 1,
          folder: tempDir,
          filename: thumbnailFilename,
          size: '640x360'
        });
    });
  });
});

app.whenReady().then(() => {
  // Register 'media' protocol to handle local file requests
  protocol.handle('media', (request) => {
    const filePath = request.url.replace('media://', '');
    // Handle Windows paths vs Unix paths if needed, usually decodeURIComponent is enough
    const decodedPath = decodeURIComponent(filePath);
    return net.fetch('file://' + decodedPath);
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
