"use client"

import * as React from "react"
import { Frame, Upload, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeNavbarProps {
  onOpenStudio: () => void
  onUploadClick: () => void
}

export function HomeNavbar({ onOpenStudio, onUploadClick }: HomeNavbarProps): React.JSX.Element {
  return (
    <header className="w-full border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={onOpenStudio}>
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
            <Frame className="w-4 h-4" />
          </div>
          <span className="font-heading text-xl font-medium tracking-wider text-foreground">
            ART FRAME
          </span>
        </div>

        {/* Minimal Middle Links (Hidden on small mobile) */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-muted-foreground font-medium">
          <button
            type="button"
            onClick={onOpenStudio}
            className="hover:text-foreground transition-colors"
          >
            Studio Visualizer
          </button>
          <button
            type="button"
            onClick={onOpenStudio}
            className="hover:text-foreground transition-colors"
          >
            Moulding Collection
          </button>
          <button
            type="button"
            onClick={onOpenStudio}
            className="hover:text-foreground transition-colors"
          >
            16:9 Wall Simulation
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUploadClick}
            className="text-xs hidden sm:inline-flex gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Art
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onOpenStudio}
            className="text-xs gap-1.5 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </header>
  )
}
