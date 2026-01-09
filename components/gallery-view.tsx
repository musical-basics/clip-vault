"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { VideoCard, type VideoAsset } from "@/components/video-card"
import { FileIngest } from "@/components/file-ingest"
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, Upload, Sparkles, Check, Tag, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample data
const sampleAssets: VideoAsset[] = [
  {
    id: "1",
    thumbnail: "/cinematic-keyboard-typing-golden-hour.jpg",
    title: "Golden Hour Typing",
    description: "Cinematic slow motion of a mechanical keyboard, warm golden hour backlight, shallow depth of field",
    duration: "0:24",
    isSignature: true,
    tags: ["typing", "keyboard", "cinematic"],
  },
  {
    id: "2",
    thumbnail: "/aerial-drone-shot-city-skyline-sunset.jpg",
    title: "City Sunset Aerial",
    description: "Sweeping aerial drone footage of metropolitan skyline during golden sunset",
    duration: "1:12",
    tags: ["aerial", "city", "sunset"],
  },
  {
    id: "3",
    thumbnail: "/coffee-steam-close-up-morning-light.jpg",
    title: "Morning Coffee Steam",
    description: "Intimate close-up of steam rising from fresh coffee, soft morning light",
    duration: "0:18",
    isSignature: true,
    tags: ["coffee", "morning", "cozy"],
  },
  {
    id: "4",
    thumbnail: "/ocean-waves-crashing-rocks-cinematic.jpg",
    title: "Ocean Waves",
    description: "Dramatic slow motion of ocean waves crashing against coastal rocks",
    duration: "0:45",
    tags: ["ocean", "waves", "nature"],
  },
  {
    id: "5",
    thumbnail: "/neon-lights-city-rain-night.jpg",
    title: "Neon Rain Streets",
    description: "Moody night scene with neon reflections on rain-soaked city streets",
    duration: "0:32",
    tags: ["neon", "night", "urban"],
  },
  {
    id: "6",
    thumbnail: "/mountain-peak-clouds-sunrise-epic.jpg",
    title: "Mountain Summit",
    description: "Epic reveal of mountain peak emerging through clouds at sunrise",
    duration: "1:45",
    isSignature: true,
    tags: ["mountain", "epic", "sunrise"],
  },
  {
    id: "7",
    thumbnail: "/desk-setup-workspace-minimal-clean.jpg",
    title: "Minimal Workspace",
    description: "Clean desk setup reveal with minimal aesthetic, soft ambient lighting",
    duration: "0:28",
    tags: ["workspace", "minimal", "tech"],
  },
  {
    id: "8",
    thumbnail: "/forest-light-rays-morning-mist.jpg",
    title: "Forest Light Rays",
    description: "Ethereal light rays piercing through misty forest canopy",
    duration: "0:56",
    tags: ["forest", "nature", "ethereal"],
  },
  {
    id: "9",
    thumbnail: "/hands-crafting-pottery-wheel-artistic.jpg",
    title: "Pottery Crafting",
    description: "Artistic hands shaping clay on pottery wheel, intimate craftsmanship",
    duration: "1:20",
    tags: ["crafts", "hands", "artistic"],
  },
  {
    id: "10",
    thumbnail: "/car-driving-highway-tunnel-lights.jpg",
    title: "Tunnel Drive",
    description: "Hypnotic tunnel driving sequence with streaking lights",
    duration: "0:38",
    tags: ["driving", "tunnel", "motion"],
  },
  {
    id: "11",
    thumbnail: "/waterfall-tropical-jungle-lush-green.jpg",
    title: "Jungle Waterfall",
    description: "Majestic waterfall cascading through lush tropical jungle",
    duration: "1:05",
    tags: ["waterfall", "jungle", "nature"],
  },
  {
    id: "12",
    thumbnail: "/fireworks-celebration-night-sky-colorful.jpg",
    title: "Celebration Fireworks",
    description: "Spectacular fireworks display lighting up the night sky",
    duration: "0:42",
    tags: ["fireworks", "celebration", "night"],
  },
]

type UploadState = "idle" | "dragging" | "analyzing" | "complete"

interface AnalyzedClip {
  thumbnail: string
  description: string
  suggestedTags: string[]
  duration: string
  technicalDetails: string
}

export function GalleryView() {
  const [assets, setAssets] = useState<VideoAsset[]>(sampleAssets)
  const [searchQuery, setSearchQuery] = useState("")
  const [gridSize, setGridSize] = useState<"compact" | "comfortable">("comfortable")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [analyzedClip, setAnalyzedClip] = useState<AnalyzedClip | null>(null)

  const filteredAssets = assets.filter(
    (asset) =>
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Create masonry-style layout with varying aspect ratios
  const getAspectRatio = (index: number): "landscape" | "portrait" | "square" => {
    const patterns = ["landscape", "portrait", "square", "landscape", "landscape", "portrait"] as const
    return patterns[index % patterns.length]
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setUploadState("dragging")
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setUploadState("idle")
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    simulateAnalysis()
  }, [])

  const simulateAnalysis = () => {
    setUploadState("analyzing")
    setTimeout(() => {
      setAnalyzedClip({
        thumbnail: "/cinematic-keyboard-typing-golden-hour.jpg",
        description:
          "Cinematic slow motion of a mechanical keyboard bathed in warm golden hour backlight. The shallow depth of field draws focus to the satisfying tactile keystrokes, while ambient dust particles catch the light. Perfect for tech reviews, productivity content, or establishing shots.",
        suggestedTags: ["keyboard", "typing", "golden hour", "slow motion", "tech", "cinematic"],
        duration: "0:24",
        technicalDetails: "4K • 60fps • LOG • 24mm f/1.8",
      })
      setUploadState("complete")
    }, 3000)
  }

  const handleUploadClick = () => {
    simulateAnalysis()
  }

  const handleAddToCollection = () => {
    setUploadState("idle")
    setAnalyzedClip(null)
    setShowUploadModal(false)
  }

  const handleImportCalls = (files: any[]) => {
    const newAssets: VideoAsset[] = files.map((file, i) => ({
      id: `local-${Date.now()}-${i}`,
      title: file.name,
      description: "Imported Local Clip",
      thumbnail: "/placeholder.jpg", // We need to generate these later
      duration: "0:00",
      tags: ["imported", "local"],
      path: file.path // Store the real path!
    }))

    setAssets(prev => [...newAssets, ...prev])
    setShowUploadModal(false)
  }

  const closeModal = () => {
    setShowUploadModal(false)
    setUploadState("idle")
    setAnalyzedClip(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-border bg-background/50 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filteredAssets.length} clips in your collection</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 pr-4 py-2 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
          </div>

          {/* Grid Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary">
            <button
              onClick={() => setGridSize("comfortable")}
              className={cn(
                "p-2 rounded-md transition-colors",
                gridSize === "comfortable"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridSize("compact")}
              className={cn(
                "p-2 rounded-md transition-colors",
                gridSize === "compact"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {/* Filter */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-auto p-8">
        <div
          className={cn(
            "grid gap-4",
            gridSize === "comfortable"
              ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
          )}
        >
          {filteredAssets.map((asset, index) => (
            <VideoCard
              key={asset.id}
              asset={asset}
              aspectRatio={gridSize === "compact" ? "square" : getAspectRatio(index)}
            />
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-lg text-muted-foreground">No clips found</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your search or upload new content</p>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal */}
          <div className="relative w-full max-w-4xl mx-4 p-8 rounded-2xl bg-card border border-border shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Magic Ingest</h2>
              <p className="text-sm text-muted-foreground mt-1">Drop your footage and let AI do the heavy lifting</p>
            </div>

            <div className="mb-6">
              <FileIngest onImport={handleImportCalls} />
            </div>

            {/* Drop Zone - Idle/Dragging State */}
            {(uploadState === "idle" || uploadState === "dragging") && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
                className={cn(
                  "relative w-full aspect-[3/2] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
                  uploadState === "idle"
                    ? "border-border hover:border-accent/50 bg-secondary/30"
                    : "border-accent bg-accent/5 scale-[1.01]",
                )}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                  <div
                    className={cn(
                      "flex items-center justify-center w-16 h-16 rounded-xl transition-all duration-300",
                      uploadState === "dragging" ? "bg-accent/20 scale-110" : "bg-secondary group-hover:bg-accent/10",
                    )}
                  >
                    <Upload
                      className={cn(
                        "w-7 h-7 transition-colors",
                        uploadState === "dragging" ? "text-accent" : "text-muted-foreground group-hover:text-accent",
                      )}
                    />
                  </div>

                  <div className="text-center">
                    <h3
                      className={cn(
                        "text-lg font-medium transition-colors",
                        uploadState === "dragging" ? "text-accent" : "text-foreground",
                      )}
                    >
                      {uploadState === "dragging" ? "Release to upload" : "Drag epic moments here"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5">or click to browse your files</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                    <span>MP4</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span>MOV</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span>WEBM</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span>Up to 2GB</span>
                  </div>
                </div>

                {/* Decorative corners */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-border/50 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-border/50 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-border/50 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-border/50 rounded-br-lg" />
              </div>
            )}

            {/* Analyzing State */}
            {uploadState === "analyzing" && (
              <div className="flex flex-col items-center justify-center py-16 gap-8">
                <div className="relative w-28 h-28">
                  <div className="absolute inset-0 rounded-full border-2 border-accent/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
                  <div className="absolute inset-4 rounded-full bg-accent/10 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-9 h-9 text-accent" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium text-foreground">AI Vision Analyzing...</h3>
                  <p className="text-sm text-muted-foreground mt-1.5">Understanding composition, mood, and content</p>
                </div>

                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    Detecting scenes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
                      style={{ animationDelay: "100ms" }}
                    />
                    Analyzing motion
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
                      style={{ animationDelay: "200ms" }}
                    />
                    Generating tags
                  </span>
                </div>
              </div>
            )}

            {/* Complete State - Result Card */}
            {uploadState === "complete" && analyzedClip && (
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="relative w-72 shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={analyzedClip.thumbnail || "/placeholder.svg"}
                    alt="Analyzed clip"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm">
                    <span className="text-xs font-medium text-foreground">{analyzedClip.duration}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-accent">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">AI Generated Description</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{analyzedClip.technicalDetails}</span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">{analyzedClip.description}</p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mt-4">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1.5">
                      {analyzedClip.suggestedTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-secondary text-xs text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-auto pt-5">
                    <button
                      onClick={handleAddToCollection}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Add to Collection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
