"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { GalleryView } from "@/components/gallery-view"
import { PlannerView } from "@/components/planner-view"
import { CommandCenterView } from "@/components/command-center-view"

export default function Home() {
  const [activeView, setActiveView] = useState<"library" | "planner" | "settings" | "command">("library")

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 overflow-hidden">
        {activeView === "library" && <GalleryView />}
        {activeView === "planner" && <PlannerView />}
        {activeView === "command" && <CommandCenterView />}
        {activeView === "settings" && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-lg">Settings coming soon</p>
          </div>
        )}
      </main>
    </div>
  )
}
