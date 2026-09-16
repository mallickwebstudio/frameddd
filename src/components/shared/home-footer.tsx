"use client"

import * as React from "react"
import { Frame } from "lucide-react"

export function HomeFooter(): React.JSX.Element {
  return (
    <footer className="w-full border-t border-border/60 bg-card/30 backdrop-blur-sm px-4 sm:px-8 py-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Brand & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <Frame className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading text-base font-medium tracking-wide text-foreground">
              ART FRAME
            </span>
          </div>
          <span className="text-muted-foreground/50 hidden sm:inline">•</span>
          <p className="text-xs text-muted-foreground">
            Artisan Picture Framing &amp; 16:9 On-Wall Visualization Studio
          </p>
        </div>

        {/* Minimal Features / Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>Solid Timber Mouldings</span>
          <span className="text-muted-foreground/40">•</span>
          <span>Archival 4-Ply Matboard</span>
          <span className="text-muted-foreground/40">•</span>
          <span>99% UV Conservation Glass</span>
        </div>

        {/* Copyright */}
        <div className="text-[11px] font-mono text-muted-foreground/70">
          &copy; {new Date().getFullYear()} ART FRAME. Handcrafted to order.
        </div>
      </div>
    </footer>
  )
}
