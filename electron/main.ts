import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import log from 'electron-log'

// Configure logging
log.transports.file.level = 'info'
console.log = log.log

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    log.error('Uncaught Exception:', error)
})

let mainWindow: BrowserWindow | null = null

function createWindow() {
    const iconPath = process.env.VITE_DEV_SERVER_URL
        ? path.join(__dirname, '../public/icons/icon.png')
        : path.join(__dirname, '../dist/icons/icon.png')

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        backgroundColor: '#0f172a',
        titleBarStyle: 'default',
        icon: iconPath,
    })

    // Load the dev server in development or built index.html in production
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// IPC Handlers for file operations
ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
        properties: ['openFile'],
        filters: [
            { name: 'Subtitle Files', extensions: ['srt', 'vtt', 'ass', 'ssa', 'sub'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    })

    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0]
        const content = fs.readFileSync(filePath, 'utf-8')
        const fileName = path.basename(filePath)
        return { content, fileName, filePath }
    }
    return null
})

ipcMain.handle('file:save', async (_event, { content, defaultName }: { content: string; defaultName: string }) => {
    const result = await dialog.showSaveDialog(mainWindow!, {
        defaultPath: defaultName,
        filters: [
            { name: 'Subtitle Files', extensions: ['srt', 'vtt', 'ass', 'ssa', 'sub'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    })

    if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, content, 'utf-8')
        return { success: true, filePath: result.filePath }
    }
    return { success: false }
})
