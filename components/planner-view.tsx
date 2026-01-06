"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { FileText, Sparkles, Check, ChevronRight, Link2 } from "lucide-react"

interface MatchedClip {
  id: string
  thumbnail: string
  title: string
  matchScore: number
  reason: string
  assigned?: boolean
}

const sampleMatches: MatchedClip[] = [
  {
    id: "1",
    thumbnail: "/mechanical-keyboard-typing-golden-hour.jpg",
    title: "Golden Hour Typing",
    matchScore: 98,
    reason: "Matches 'keyboard' and 'typing' keywords in your script segment",
  },
  {
    id: "2",
    thumbnail: "/minimal-desk-setup-workspace.jpg",
    title: "Minimal Workspace",
    matchScore: 94,
    reason: "Perfect for 'clean workspace' and 'productivity' themes",
  },
  {
    id: "3",
    thumbnail: "/placeholder.svg?height=200&width=300",
    title: "Morning Coffee Steam",
    matchScore: 87,
    reason: "Matches 'morning routine' and 'cozy' atmosphere",
  },
  {
    id: "4",
    thumbnail: "/placeholder.svg?height=200&width=300",
    title: "Neon Rain Streets",
    matchScore: 72,
    reason: "Good for 'urban' and 'energetic' vibes in intro",
  },
]

const sampleScript = `Welcome back to another productivity video! Today I'm showing you my perfect morning routine.

[INTRO - High energy, urban vibes]

First, let's talk about my workspace setup. I've spent months perfecting this minimal desk configuration.

[B-ROLL - Clean workspace, keyboard typing shots]

Every morning starts with a fresh cup of coffee. There's something magical about that first sip.

[B-ROLL - Cozy morning, coffee steam]

Let me show you how I organize my entire day using just one simple system...`

export function PlannerView() {
  const [script, setScript] = useState(sampleScript)
  const [matches, setMatches] = useState<MatchedClip[]>(sampleMatches)
  const [assignedClips, setAssignedClips] = useState<Set<string>>(new Set())

  const handleAssign = (clipId: string) => {
    setAssignedClips((prev) => {
      const next = new Set(prev)
      if (next.has(clipId)) {
        next.delete(clipId)
      } else {
        next.add(clipId)
      }
      return next
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 75) return "text-yellow-400"
    return "text-orange-400"
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="px-8 py-5 border-b border-border bg-background/50 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Creative Planner</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Paste your script and let AI match the perfect clips</p>
      </header>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Script */}
        <div className="w-1/2 flex flex-col border-r border-border">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-card/50">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-foreground">Creative Brief / Script</h2>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your script, outline, or creative brief here..."
              className="w-full h-full p-4 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 leading-relaxed"
            />
          </div>

          {/* Analyze Button */}
          <div className="p-6 border-t border-border">
            <button className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors">
              <Sparkles className="w-4 h-4" />
              Analyze & Match Clips
            </button>
          </div>
        </div>

        {/* Right Panel - Matches */}
        <div className="w-1/2 flex flex-col bg-card/30">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-medium text-foreground">Suggested Assets</h2>
            </div>
            <span className="text-xs text-muted-foreground">{matches.length} matches found</span>
          </div>

          <div className="flex-1 p-6 overflow-auto space-y-4">
            {matches.map((clip) => {
              const isAssigned = assignedClips.has(clip.id)

              return (
                <div
                  key={clip.id}
                  className={cn(
                    "group flex gap-4 p-4 rounded-xl border transition-all duration-200",
                    isAssigned ? "bg-accent/10 border-accent/30" : "bg-card border-border hover:border-accent/30",
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative w-36 shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={clip.thumbnail || "/placeholder.svg"}
                      alt={clip.title}
                      className="w-full aspect-video object-cover"
                    />
                    {isAssigned && (
                      <div className="absolute inset-0 flex items-center justify-center bg-accent/80">
                        <Check className="w-6 h-6 text-accent-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-foreground truncate">{clip.title}</h3>
                      <span
                        className={cn("shrink-0 text-lg font-semibold tabular-nums", getScoreColor(clip.matchScore))}
                      >
                        {clip.matchScore}%
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{clip.reason}</p>

                    <div className="mt-auto pt-3">
                      <button
                        onClick={() => handleAssign(clip.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                          isAssigned
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        {isAssigned ? (
                          <>
                            <Check className="w-3 h-3" />
                            Assigned
                          </>
                        ) : (
                          <>
                            <Link2 className="w-3 h-3" />
                            Use This
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          {assignedClips.size > 0 && (
            <div className="p-6 border-t border-border bg-card/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {assignedClips.size} clip{assignedClips.size > 1 ? "s" : ""} assigned
                </span>
                <button className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                  Export Timeline
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
