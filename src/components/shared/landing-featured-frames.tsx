"use client"

import * as React from "react"
import { ArrowRight, Frame as FrameIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FrameStyle } from "@/types"
import { FRAME_CATALOG } from "@/db/frames"

interface LandingFeaturedFramesProps {
  onSelectFrame: (frame: FrameStyle) => void
}

const SHOWCASE_FRAME_IDS = [
  "gold-1-1",
  "cyan-16-9",
  "purple-1-1",
  "gold-9-16",
  "cyan-9-16",
  "purple-16-9",
]

export function LandingFeaturedFrames({
  onSelectFrame,
}: LandingFeaturedFramesProps): React.JSX.Element {
  const showcaseFrames = SHOWCASE_FRAME_IDS.map(
    (id) => FRAME_CATALOG.find((f) => f.id === id) ?? FRAME_CATALOG[0]
  )

  return (
    <section id="frames" className="w-full py-16 sm:py-24 px-4 sm:px-8 border-t border-border/70 bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary font-mono bg-primary/10 px-3 py-1 rounded-full inline-block">
              Moulding Collection
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
              Signature Handcrafted Mouldings
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose from classic square, cinematic landscape, and elegant portrait proportions—all at an honest flat rate of ₹240.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-primary block">
              15 Custom Styles Available
            </span>
            <span className="text-[11px] text-muted-foreground">
              Square (1:1) • Portrait (3:4, 9:16) • Landscape (16:9, 4:3)
            </span>
          </div>
        </div>

        {/* Frames Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseFrames.map((f) => (
            <div
              key={f.id}
              className="group p-5 rounded-2xl border border-border/80 bg-card/70 hover:bg-card hover:border-primary/40 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div
                onClick={() => onSelectFrame(f)}
                className="relative aspect-4/3 w-full rounded-xl bg-neutral-950/5 dark:bg-neutral-900/40 p-4 flex items-center justify-center overflow-hidden cursor-pointer group-hover:bg-neutral-950/10 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.imageUrl}
                  alt={f.name}
                  className={`w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 ${
                    f.rotation === 90 ? "rotate-90 scale-85" : ""
                  }`}
                />
                <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-background/90 text-foreground shadow-2xs border border-border/60">
                  {f.ratio}
                </span>
              </div>

              {/* Card Meta & Action */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {f.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground capitalize">
                      {f.finish} • {f.defaultWidth}&quot; moulding
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-primary">
                      ₹{f.price}
                    </span>
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      All-Inclusive
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectFrame(f)}
                  className="w-full text-xs font-semibold gap-1.5 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary cursor-pointer transition-all"
                >
                  <FrameIcon className="w-3.5 h-3.5" />
                  Customize in 16:9 Studio
                  <ArrowRight className="w-3 h-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
