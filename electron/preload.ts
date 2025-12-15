import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    saveFile: (content: string, defaultName: string) =>
        ipcRenderer.invoke('file:save', { content, defaultName }),
})

// Type definitions for window.electronAPI
export interface ElectronAPI {
    openFile: () => Promise<{ content: string; fileName: string; filePath: string } | null>
    saveFile: (content: string, defaultName: string) => Promise<{ success: boolean; filePath?: string }>
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}
