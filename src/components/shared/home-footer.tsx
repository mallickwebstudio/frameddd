"use client"

import * as React from "react"
import { Frame } from "lucide-react"

export function HomeFooter(): React.JSX.Element {
  return (
    <footer className="w-full border-t border-white/10 bg-[#071711] text-[#FAF7F2] px-4 sm:px-8 py-10 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FA6446] text-white flex items-center justify-center shadow-sm">
              <Frame className="w-4 h-4" />
            </div>
            <span className="font-heading text-lg font-medium tracking-wide text-[#FAF7F2]">
              ART FRAME
            </span>
          </div>
          <span className="text-white/30 hidden sm:inline">•</span>
          <p className="text-xs text-[#A5D6B6] font-mono uppercase tracking-wider">
            Turn Your Photos Into Memories
          </p>
        </div>

        {/* Minimal Features / Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/60 font-mono">
          <span>Solid Timber Mouldings</span>
          <span className="text-white/20">•</span>
          <span>16:9 Wall Simulation</span>
          <span className="text-white/20">•</span>
          <span>Archival Preservation</span>
        </div>

        {/* Copyright */}
        <div className="text-[11px] font-mono text-white/40">
          ART FRAME &copy; {new Date().getFullYear()} • Handcrafted to order.
        </div>
      </div>
    </footer>
  )
}
