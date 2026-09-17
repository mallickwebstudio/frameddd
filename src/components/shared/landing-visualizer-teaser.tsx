"use client"

import * as React from "react"
import {
  Maximize2,
  Move,
  Palette,
  Download,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingVisualizerTeaserProps {
  onOpenStudio: () => void
}

const VISUALIZER_HIGHLIGHTS = [
  {
    icon: Move,
    title: "Fluid Drag & Red Crosshair Snapping",
    description:
      "Click-drag with mouse or slide with your finger. Magnetic alignment snaps to center with visible red crosshair guides.",
  },
  {
    icon: Maximize2,
    title: "5% to 200% Precision Zoom",
    description:
      "Inspect every detail from a micro-view of moulding mitres to a full-room wide-angle overview.",
  },
  {
    icon: Palette,
    title: "12+ Designer Wall Paints & Real Rooms",
    description:
      "Test against warm whites, muted slates, dramatic dark tones, or upload a photo of your actual living room wall.",
  },
  {
    icon: Download,
    title: "High-Resolution Mockup Export",
    description:
      "Export your simulated 16:9 room mockup with active zoom, custom frame positioning, and dimensions stamped in high resolution.",
  },
]

export function LandingVisualizerTeaser({
  onOpenStudio,
}: LandingVisualizerTeaserProps): React.JSX.Element {
  return (
    <section id="visualizer" className="w-full py-16 sm:py-24 px-4 sm:px-8 border-t border-border/70 bg-card/30">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary font-mono bg-primary/10 px-3 py-1 rounded-full inline-block">
            16:9 Simulation Engine
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            No guesswork. Visualize your wall before ordering.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Our custom 16:9 workspace renders your artwork in photorealistic room settings with accurate optical scale, custom mat margins, and realistic ambient lighting.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VISUALIZER_HIGHLIGHTS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-border/80 bg-card/80 flex flex-col justify-between space-y-4 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Banner */}
        <div className="p-8 rounded-3xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Interactive 3D Simulation</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-medium text-foreground">
              Experience the 16:9 Studio in your browser right now
            </h3>
            <p className="text-xs text-muted-foreground">
              Zero software installation required. Upload any picture or experiment with fine art samples instantly.
            </p>
          </div>

          <Button
            size="lg"
            onClick={onOpenStudio}
            className="text-xs font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-5 cursor-pointer shadow-md shrink-0"
          >
            <Eye className="w-4 h-4" />
            Launch 16:9 Studio
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
