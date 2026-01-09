"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FolderSearch } from "lucide-react";

interface FileIngestProps {
    onImport?: (files: any[]) => void
}

export function FileIngest({ onImport }: FileIngestProps) {
    const [files, setFiles] = useState<any[]>([]);

    useEffect(() => {
        // Check if running in Electron
        if (window.electron) {
            // Set up the listener for when files are found
            window.electron.onFolderSelected((_event, newFiles) => {
                console.log("Found files:", newFiles);
                setFiles(newFiles);
            });
        }
    }, []);

    const handleImport = () => {
        if (window.electron) {
            window.electron.selectFolder();
        } else {
            alert("Please run this in the Electron Desktop App to scan local files.");
        }
    };

    return (
        <div className="p-4 w-full">
            <div className="flex items-center gap-4 mb-4">
                <Button onClick={handleImport} variant="secondary" className="gap-2">
                    <FolderSearch className="w-4 h-4" />
                    {files.length > 0 ? "Change Folder" : "Connect Local Folder"}
                </Button>

                {files.length > 0 && onImport && (
                    <Button onClick={() => onImport(files)} className="gap-2">
                        Import {files.length} Clips
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-3 gap-4">
                {files.map((file, idx) => (
                    <div key={idx} className="bg-secondary p-2 rounded text-sm text-foreground overflow-hidden">
                        {/* Note: To play local video in Electron, you often need to format the path as file:// */}
                        <div className="aspect-video bg-black mb-2 flex items-center justify-center text-xs text-muted-foreground">
                            Video Preview
                        </div>
                        <p className="truncate" title={file.name}>{file.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
