"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  Filter,
  Star,
  Play,
  Calendar,
  Percent,
  AlertCircle,
  Sparkles,
  GripVertical,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Clip inventory data
const clips = [
  {
    id: "c1",
    title: "Keyboard Typing Golden Hour",
    thumbnail: "/cinematic-keyboard-typing-golden-hour.jpg",
    tags: ["Keyboard", "4K", "B-Roll"],
    duration: "0:24",
    signature: true,
    usedIn: 2,
    matchScores: { "Sound Test Typing": 98, "Working at desk": 85 },
  },
  {
    id: "c2",
    title: "Aerial City Skyline Sunset",
    thumbnail: "/aerial-drone-shot-city-skyline-sunset.jpg",
    tags: ["Drone", "Epic", "4K"],
    duration: "0:45",
    signature: true,
    usedIn: 1,
    matchScores: {},
  },
  {
    id: "c3",
    title: "Hand on Mechanical Keys",
    thumbnail: "/close-up-mechanical-keyboard-rgb.jpg",
    tags: ["Keyboard", "Close-up"],
    duration: "0:12",
    signature: false,
    usedIn: 3,
    matchScores: { "Sound Test Typing": 92, "Working at desk": 78 },
  },
  {
    id: "c4",
    title: "Running Through Park",
    thumbnail: "/person-running-through-park-morning.jpg",
    tags: ["Running", "B-Roll"],
    duration: "0:33",
    signature: false,
    usedIn: 0,
    matchScores: {},
  },
  {
    id: "c5",
    title: "Coffee Pour Slow Motion",
    thumbnail: "/coffee-pour-slow-motion.jpg",
    tags: ["Lifestyle", "4K"],
    duration: "0:18",
    signature: true,
    usedIn: 4,
    matchScores: {},
  },
  {
    id: "c6",
    title: "Product Unboxing Hands",
    thumbnail: "/product-unboxing-hands.jpg",
    tags: ["Unboxing", "B-Roll"],
    duration: "0:55",
    signature: false,
    usedIn: 1,
    matchScores: {},
  },
]

// Project pipeline data
const projects = [
  {
    id: "p1",
    title: "Keyboard Review V1",
    priority: "high",
    dueDate: "Dec 20",
    percentReady: 80,
    scenes: [
      {
        id: "s1",
        name: "Opening typing shot",
        filled: true,
        clipId: "c1",
        clipThumb: "/cinematic-keyboard-typing-golden-hour.jpg",
      },
      {
        id: "s2",
        name: "Close-up key switches",
        filled: true,
        clipId: "c3",
        clipThumb: "/close-up-mechanical-keyboard-rgb.jpg",
      },
      { id: "s3", name: "Sound Test Typing", filled: false, needsTag: "Keyboard" },
      {
        id: "s4",
        name: "RGB lighting showcase",
        filled: true,
        clipId: "c3",
        clipThumb: "/close-up-mechanical-keyboard-rgb.jpg",
      },
      { id: "s5", name: "Outro shot", filled: false, needsTag: "B-Roll" },
    ],
  },
  {
    id: "p2",
    title: "Vlog #45 - Morning Routine",
    priority: "medium",
    dueDate: "Dec 24",
    percentReady: 40,
    scenes: [
      { id: "s6", name: "Coffee making shot", filled: true, clipId: "c5", clipThumb: "/coffee-pour-slow-motion.jpg" },
      { id: "s7", name: "Running outdoor shot", filled: false, needsTag: "Running" },
      {
        id: "s8",
        name: "City establishing shot",
        filled: true,
        clipId: "c2",
        clipThumb: "/aerial-drone-shot-city-skyline-sunset.jpg",
      },
      { id: "s9", name: "Working at desk", filled: false, needsTag: "Keyboard" },
      { id: "s10", name: "Sunset closing shot", filled: false, needsTag: "Drone" },
    ],
  },
  {
    id: "p3",
    title: "Product Launch Teaser",
    priority: "high",
    dueDate: "Dec 18",
    percentReady: 60,
    scenes: [
      { id: "s11", name: "Unboxing reveal", filled: true, clipId: "c6", clipThumb: "/product-unboxing-hands.jpg" },
      { id: "s12", name: "Hero product shot", filled: false, needsTag: "4K" },
      {
        id: "s13",
        name: "In-use demonstration",
        filled: true,
        clipId: "c1",
        clipThumb: "/cinematic-keyboard-typing-golden-hour.jpg",
      },
      { id: "s14", name: "Lifestyle B-roll", filled: false, needsTag: "Lifestyle" },
      {
        id: "s15",
        name: "Final call to action",
        filled: true,
        clipId: "c2",
        clipThumb: "/aerial-drone-shot-city-skyline-sunset.jpg",
      },
    ],
  },
]

const filterTags = ["Drone", "4K", "Epic", "B-Roll", "Keyboard", "Lifestyle"]

export function CommandCenterView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedClip, setSelectedClip] = useState<string | null>(null)
  const [aiMatchMode, setAiMatchMode] = useState(false)
  const [sortBy, setSortBy] = useState<"ready" | "priority" | "due">("priority")
  const [projectsState, setProjectsState] = useState(projects)
  const [draggedClip, setDraggedClip] = useState<string | null>(null)
  const [hoveredSceneName, setHoveredSceneName] = useState<string | null>(null)

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredClips = clips.filter((clip) => {
    const matchesSearch =
      clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clip.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilters = activeFilters.length === 0 || activeFilters.some((f) => clip.tags.includes(f))
    return matchesSearch && matchesFilters
  })

  const sortedProjects = [...projectsState].sort((a, b) => {
    if (sortBy === "ready") return b.percentReady - a.percentReady
    if (sortBy === "due") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return (
      priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
    )
  })

  // Find which scenes need the selected clip
  const scenesNeedingClip = selectedClip
    ? projectsState.flatMap((p) =>
        p.scenes
          .filter((s) => !s.filled && clips.find((c) => c.id === selectedClip)?.tags.includes(s.needsTag || ""))
          .map((s) => s.id),
      )
    : []

  // Handle drag and drop
  const handleDragStart = (clipId: string) => {
    setDraggedClip(clipId)
  }

  const handleDragOver = (e: React.DragEvent, sceneId: string) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, projectId: string, sceneId: string) => {
    e.preventDefault()
    if (!draggedClip) return

    const clip = clips.find((c) => c.id === draggedClip)
    if (!clip) return

    setProjectsState((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        return {
          ...p,
          scenes: p.scenes.map((s) => {
            if (s.id !== sceneId) return s
            return { ...s, filled: true, clipId: draggedClip, clipThumb: clip.thumbnail }
          }),
          percentReady: Math.round(
            (p.scenes.filter((s) => s.filled || s.id === sceneId).length / p.scenes.length) * 100,
          ),
        }
      }),
    )
    setDraggedClip(null)
  }

  const getMatchingClipsForScene = (sceneName: string) => {
    return clips.filter((c) => c.matchScores[sceneName as keyof typeof c.matchScores])
  }

  const getClipMatchScore = (clipId: string, sceneName: string | null): number | null => {
    if (!sceneName) return null
    const clip = clips.find((c) => c.id === clipId)
    if (!clip) return null
    return clip.matchScores[sceneName as keyof typeof clip.matchScores] || null
  }

  return (
    <div className="flex h-full">
      {/* Left Panel: The Vault */}
      <div className="w-1/2 flex flex-col border-r border-border bg-zinc-950">
        {/* Vault Header */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-border px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">The Vault</h2>
            <span className="text-xs text-muted-foreground font-mono">{filteredClips.length} clips</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search visual tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <Filter className="w-4 h-4 text-muted-foreground mr-1" />
            {filterTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleFilter(tag)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200",
                  activeFilters.includes(tag)
                    ? "bg-accent/20 border-accent text-accent"
                    : "bg-zinc-900 border-zinc-800 text-muted-foreground hover:border-zinc-700 hover:text-foreground",
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Clip Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredClips.map((clip) => {
              const isSelected = selectedClip === clip.id
              const matchScore = aiMatchMode ? getClipMatchScore(clip.id, hoveredSceneName) : null
              const isNeuralMatch = matchScore !== null
              const shouldDim = aiMatchMode && hoveredSceneName && !isNeuralMatch

              return (
                <div
                  key={clip.id}
                  draggable
                  onDragStart={() => handleDragStart(clip.id)}
                  onDragEnd={() => setDraggedClip(null)}
                  onClick={() => setSelectedClip(isSelected ? null : clip.id)}
                  className={cn(
                    "group relative rounded-lg overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-500 ease-in-out",
                    isSelected && "ring-2 ring-accent ring-offset-2 ring-offset-zinc-950",
                    isNeuralMatch && "border-2 border-emerald-500 ring-4 ring-emerald-500/20",
                    shouldDim && "opacity-40",
                    draggedClip === clip.id && "opacity-50 scale-95",
                  )}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video relative bg-zinc-900">
                    <img
                      src={clip.thumbnail || "/placeholder.svg"}
                      alt={clip.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>

                    {/* Signature Badge */}
                    {clip.signature && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-accent/90 rounded text-[10px] font-semibold text-accent-foreground">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    )}

                    {/* Duration */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-mono text-white">
                      {clip.duration}
                    </div>

                    {isNeuralMatch && (
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center transition-all duration-500 ease-in-out">
                        <div className="px-2 py-1 bg-zinc-900/90 rounded-full text-[11px] font-medium text-emerald-400 backdrop-blur-sm border border-emerald-500/30">
                          <span className="font-mono">{matchScore}%</span> Match for &apos;
                          {hoveredSceneName?.split(" ").slice(0, 2).join(" ")}&apos;
                        </div>
                      </div>
                    )}

                    {/* Usage Count - hide when showing match badge */}
                    {!isNeuralMatch && (
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="text-[10px] text-zinc-300 font-mono">
                          Used in {clip.usedIn} video{clip.usedIn !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Panel: The Pipeline */}
      <div className="w-1/2 flex flex-col bg-zinc-950">
        {/* Pipeline Header */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">The Pipeline</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAiMatchMode(!aiMatchMode)
                  if (aiMatchMode) setHoveredSceneName(null)
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-500 ease-in-out",
                  aiMatchMode
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-zinc-900 border-zinc-800 text-muted-foreground hover:border-zinc-700",
                )}
              >
                <Sparkles className={cn("w-3 h-3", aiMatchMode && "animate-pulse")} />
                {aiMatchMode ? "Matching Active" : "AI Match"}
              </button>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort by:</span>
            {[
              { id: "priority", label: "Priority", icon: AlertCircle },
              { id: "ready", label: "% Ready", icon: Percent },
              { id: "due", label: "Due Date", icon: Calendar },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id as typeof sortBy)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200",
                  sortBy === option.id
                    ? "bg-zinc-800 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-900",
                )}
              >
                <option.icon className="w-3 h-3" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className={cn(
                "rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden transition-all duration-200",
                selectedClip &&
                  scenesNeedingClip.some((s) => project.scenes.find((ps) => ps.id === s)) &&
                  "border-accent/50",
              )}
            >
              {/* Project Header */}
              <div className="px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{project.title}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-semibold rounded uppercase",
                        project.priority === "high" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400",
                      )}
                    >
                      {project.priority}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{project.dueDate}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Assets Ready</span>
                    <span className="font-mono text-foreground">{project.percentReady}%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        project.percentReady >= 80
                          ? "bg-emerald-500"
                          : project.percentReady >= 50
                            ? "bg-amber-500"
                            : "bg-red-500",
                      )}
                      style={{ width: `${project.percentReady}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Scene Slots */}
              <div className="px-4 py-3 space-y-2">
                {project.scenes.map((scene) => {
                  const needsHighlight =
                    selectedClip &&
                    !scene.filled &&
                    clips.find((c) => c.id === selectedClip)?.tags.includes(scene.needsTag || "")
                  const hasNeuralMatches =
                    aiMatchMode && !scene.filled && getMatchingClipsForScene(scene.name).length > 0
                  const isHovered = hoveredSceneName === scene.name

                  return (
                    <div
                      key={scene.id}
                      onDragOver={(e) => !scene.filled && handleDragOver(e, scene.id)}
                      onDrop={(e) => !scene.filled && handleDrop(e, project.id, scene.id)}
                      onMouseEnter={() => aiMatchMode && !scene.filled && setHoveredSceneName(scene.name)}
                      onMouseLeave={() => aiMatchMode && setHoveredSceneName(null)}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg border transition-all duration-500 ease-in-out",
                        scene.filled
                          ? "bg-zinc-800/50 border-zinc-700"
                          : needsHighlight
                            ? "bg-accent/10 border-accent border-dashed"
                            : "bg-zinc-800/30 border-zinc-800 border-dashed",
                        hasNeuralMatches && !isHovered && "border-emerald-500/30 animate-pulse",
                        isHovered &&
                          "border-emerald-500 bg-emerald-500/10 border-solid shadow-[0_0_20px_rgba(16,185,129,0.15)]",
                      )}
                    >
                      {/* Thumbnail or Empty Slot */}
                      <div
                        className={cn(
                          "w-16 h-10 rounded overflow-hidden flex-shrink-0 transition-all duration-500",
                          !scene.filled && "bg-zinc-800 flex items-center justify-center",
                          hasNeuralMatches && !scene.filled && "bg-emerald-950/50",
                        )}
                      >
                        {scene.filled ? (
                          <img
                            src={scene.clipThumb || "/placeholder.svg"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <GripVertical
                            className={cn(
                              "w-4 h-4 transition-colors duration-500",
                              hasNeuralMatches ? "text-emerald-600" : "text-zinc-600",
                            )}
                          />
                        )}
                      </div>

                      {/* Scene Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm truncate transition-colors duration-500",
                            scene.filled ? "text-foreground" : "text-muted-foreground",
                            isHovered && "text-emerald-400",
                          )}
                        >
                          {scene.filled ? scene.name : `Missing: ${scene.name}`}
                        </p>
                        {!scene.filled && scene.needsTag && (
                          <span
                            className={cn(
                              "text-[10px] font-mono transition-colors duration-500",
                              isHovered ? "text-emerald-500/70" : "text-zinc-500",
                            )}
                          >
                            needs: {scene.needsTag}
                          </span>
                        )}
                      </div>

                      {/* Status Icon */}
                      {scene.filled ? (
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : hasNeuralMatches ? (
                        <Sparkles
                          className={cn(
                            "w-4 h-4 flex-shrink-0 transition-all duration-500",
                            isHovered ? "text-emerald-400 animate-pulse" : "text-emerald-600",
                          )}
                        />
                      ) : (
                        <X className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
