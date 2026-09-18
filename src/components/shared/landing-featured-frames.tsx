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
  "vintage-gold-01",
  "vintage-gold-02",
  "vintage-cyan-01",
  "vintage-green-01",
  "vintage-purple-01",
  "vintage-red-01",
]

export function LandingFeaturedFrames({
  onSelectFrame,
}: LandingFeaturedFramesProps): React.JSX.Element {
  const showcaseFrames = SHOWCASE_FRAME_IDS.map(
    (id) => FRAME_CATALOG.find((f) => f.id === id) ?? FRAME_CATALOG[0]
  )

  return (
    <section id="frames" className="w-full py-20 sm:py-28 px-4 sm:px-8 border-t border-[#0B2118]/10 bg-[#FAF7F2] text-[#0B2118]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#0B2118]/15 pb-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FA6446] font-mono">
              The Collection • Vintage &amp; Ornate Mouldings
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-[#0B2118]">
              Vintage Baroque &amp; Gilded Heritage.
            </h2>
            <p className="text-sm text-[#0B2118]/70">
              Curated burnished gold, antiqued cyan patina, imperial emerald, and royal velvet baroque frames—all at an honest flat rate of ₹240.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#0B2118]/60 font-mono">
              Vintage Collection • 6 Authentic Mouldings
            </span>
          </div>
        </div>

        {/* Frames Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseFrames.map((f) => (
            <div
              key={f.id}
              onClick={() => onSelectFrame(f)}
              className="group p-5 rounded-2xl border border-[#0B2118]/15 bg-white/80 hover:bg-white hover:border-[#FA6446]/60 hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer"
            >
              {/* Image Preview Container */}
              <div
                className="relative aspect-4/3 w-full rounded-xl bg-neutral-950/5 dark:bg-neutral-900/40 p-4 flex items-center justify-center overflow-hidden group-hover:bg-neutral-950/10 transition-colors"
              >
                {f.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={f.imageUrl}
                    alt={f.name}
                    className={`w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 ${f.rotation === 90 ? "rotate-90 scale-85" : ""
                      }`}
                  />
                ) : (
                  <div
                    className="relative w-28 h-28 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: f.textureGradient || f.color,
                      padding: "10px",
                      boxShadow: f.boxShadowCss || "0 8px 24px rgba(0,0,0,0.35)",
                    }}
                  >
                    <div className="absolute inset-0 rounded-lg pointer-events-none border border-white/20" />
                    <div className="w-full h-full rounded-xs bg-[#fbfaf8] dark:bg-[#1f1e1d] flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
                      <FrameIcon className="w-4 h-4 text-muted-foreground/40" />
                    </div>
                  </div>
                )}
                <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-background/90 text-foreground shadow-2xs border border-border/60">
                  {f.ratio}
                </span>
                {f.badge && (
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#FA6446] text-white shadow-2xs">
                    {f.badge}
                  </span>
                )}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectFrame(f)
                  }}
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
