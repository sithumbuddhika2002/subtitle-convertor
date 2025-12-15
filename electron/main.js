var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
var mainWindow = null;
function createWindow() {
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
        icon: path.join(__dirname, '../public/icons/icon.png'),
    });
    // Load the dev server in development or built index.html in production
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
app.whenReady().then(createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// IPC Handlers for file operations
ipcMain.handle('dialog:openFile', function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, filePath, content, fileName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dialog.showOpenDialog(mainWindow, {
                    properties: ['openFile'],
                    filters: [
                        { name: 'Subtitle Files', extensions: ['srt', 'vtt', 'ass', 'ssa', 'sub'] },
                        { name: 'All Files', extensions: ['*'] }
                    ]
                })];
            case 1:
                result = _a.sent();
                if (!result.canceled && result.filePaths.length > 0) {
                    filePath = result.filePaths[0];
                    content = fs.readFileSync(filePath, 'utf-8');
                    fileName = path.basename(filePath);
                    return [2 /*return*/, { content: content, fileName: fileName, filePath: filePath }];
                }
                return [2 /*return*/, null];
        }
    });
}); });
ipcMain.handle('file:save', function (_event_1, _a) { return __awaiter(void 0, [_event_1, _a], void 0, function (_event, _b) {
    var result;
    var content = _b.content, defaultName = _b.defaultName;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, dialog.showSaveDialog(mainWindow, {
                    defaultPath: defaultName,
                    filters: [
                        { name: 'Subtitle Files', extensions: ['srt', 'vtt', 'ass', 'ssa', 'sub'] },
                        { name: 'All Files', extensions: ['*'] }
                    ]
                })];
            case 1:
                result = _c.sent();
                if (!result.canceled && result.filePath) {
                    fs.writeFileSync(result.filePath, content, 'utf-8');
                    return [2 /*return*/, { success: true, filePath: result.filePath }];
                }
                return [2 /*return*/, { success: false }];
        }
    });
}); });
