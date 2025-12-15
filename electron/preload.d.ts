export interface ElectronAPI {
    openFile: () => Promise<{
        content: string;
        fileName: string;
        filePath: string;
    } | null>;
    saveFile: (content: string, defaultName: string) => Promise<{
        success: boolean;
        filePath?: string;
    }>;
}
declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
