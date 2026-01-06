interface Window {
    electron: {
        selectFolder: () => Promise<void>;
        onFolderSelected: (callback: (event: any, files: any[]) => void) => void;
    };
}
