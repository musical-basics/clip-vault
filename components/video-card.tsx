"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Star, Play } from "lucide-react"

export interface VideoAsset {
  id: string
  thumbnail: string
  videoUrl?: string
  title: string
  description: string
  duration: string
  isSignature?: boolean
  tags?: string[]
  path?: string // Local file path for Electron processing
}

interface VideoCardProps {
  asset: VideoAsset
  aspectRatio?: "landscape" | "portrait" | "square"
  onClick?: () => void
}

export function VideoCard({ asset, aspectRatio = "landscape", onClick }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => { })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300",
        isHovered && "ring-2 ring-accent/50 shadow-[0_0_30px_rgba(200,170,100,0.15)]",
        aspectRatio === "landscape" && "aspect-video",
        aspectRatio === "portrait" && "aspect-[3/4]",
        aspectRatio === "square" && "aspect-square",
      )}
    >
      {/* Thumbnail */}
      <img
        src={asset.thumbnail || "/placeholder.svg"}
        alt={asset.title}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
          isHovered && asset.videoUrl && "opacity-0",
        )}
      />

      {/* Video Preview */}
      {asset.videoUrl && (
        <video
          ref={videoRef}
          src={asset.videoUrl}
          muted
          loop
          playsInline
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Signature Badge */}
      {asset.isSignature && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-accent/90 backdrop-blur-sm">
          <Star className="w-3 h-3 text-accent-foreground fill-accent-foreground" />
          <span className="text-[10px] font-semibold text-accent-foreground uppercase tracking-wide">Signature</span>
        </div>
      )}

      {/* Duration */}
      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm">
        <span className="text-xs font-medium text-foreground/90">{asset.duration}</span>
      </div>

      {/* Play Indicator */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          isHovered ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-5 h-5 text-foreground fill-foreground ml-0.5" />
        </div>
      </div>

      {/* Info on Hover */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 transform transition-all duration-300",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <h3 className="text-sm font-medium text-foreground line-clamp-1">{asset.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{asset.description}</p>
      </div>
    </div>
  )
}
