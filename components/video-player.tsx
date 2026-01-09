import { X } from "lucide-react"
import { useEffect } from "react"

interface VideoPlayerProps {
    src: string
    onClose: () => void
}

export function VideoPlayer({ src, onClose }: VideoPlayerProps) {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onClose])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
            >
                <X className="w-8 h-8" />
            </button>

            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* The Player */}
            <div className="relative z-0 max-w-[90vw] max-h-[90vh] aspect-video w-full shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10">
                <video
                    src={src}
                    controls
                    autoPlay
                    className="w-full h-full object-contain bg-black"
                />
            </div>
        </div>
    )
}
