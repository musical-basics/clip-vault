"use client"

import { cn } from "@/lib/utils"
import { Library, Wand2, Settings, ChevronLeft, ChevronRight, Sparkles, Layers } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  activeView: "library" | "planner" | "settings" | "command"
  onNavigate: (view: "library" | "planner" | "settings" | "command") => void
}

const navItems = [
  { id: "library" as const, label: "Library", icon: Library },
  { id: "command" as const, label: "Command", icon: Layers },
  { id: "planner" as const, label: "Planner", icon: Wand2 },
  { id: "settings" as const, label: "Settings", icon: Settings },
]

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-out",
        collapsed ? "w-16" : "w-56",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        {!collapsed && <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">ClipVault</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-accent" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70",
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Footer */}
      <div className={cn("px-4 py-4 border-t border-sidebar-border", collapsed && "px-3")}>
        {!collapsed && <p className="text-xs text-sidebar-foreground/40">Curate your masterpiece</p>}
      </div>
    </aside>
  )
}
