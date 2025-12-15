import { contextBridge, ipcRenderer } from 'electron';
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    openFile: function () { return ipcRenderer.invoke('dialog:openFile'); },
    saveFile: function (content, defaultName) {
        return ipcRenderer.invoke('file:save', { content: content, defaultName: defaultName });
    },
});
