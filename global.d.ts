interface Window {
    electron: {
        selectFolder: () => Promise<void>;
        selectFolder: () => Promise<void>;
        onFolderSelected: (callback: (event: any, files: any[]) => void) => void;
        processVideo: (filePath: string) => Promise<{ duration: string, thumbnailPath: string }>;
    };
}
