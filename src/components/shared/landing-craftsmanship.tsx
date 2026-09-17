"use client"

import * as React from "react"
import { Layers, Sparkles, Sun, CheckCircle2 } from "lucide-react"

interface PillarItem {
  icon: React.ElementType
  title: string
  subtitle: string
  description: string
  badge: string
}

const CRAFTSMANSHIP_PILLARS: PillarItem[] = [
  {
    icon: Layers,
    title: "Solid Timber Mouldings",
    subtitle: "Precision 45° Mitred Corners",
    description:
      "Handcrafted using kiln-dried solid woods and precision metal extrusions. Each profile is hand-joined and reinforced for lifelong structural integrity.",
    badge: "100% Solid Wood",
  },
  {
    icon: Sparkles,
    title: "Archival 4-Ply Matboard",
    subtitle: "100% Acid-Free & Lignin-Free",
    description:
      "Pure alpha-cellulose core with precision bevel-cut windows. Shields your photographs and prints from acid degradation, discoloration, and outgassing.",
    badge: "Museum Standard",
  },
  {
    icon: Sun,
    title: "Optical Conservation Glazing",
    subtitle: "Up to 99% UV Protection",
    description:
      "Lightweight, shatter-resistant optical acrylic that filters damaging ultraviolet radiation. Available in crystal-clear gloss and anti-reflective non-glare.",
    badge: "UV-99 Shield",
  },
  {
    icon: CheckCircle2,
    title: "Turnkey Gallery Hardware",
    subtitle: "Ready to Hang Out of the Box",
    description:
      "Includes stainless steel plastic-coated hanging wire, heavy-duty D-ring brackets, silicone wall-protection bumpers, and an archival kraft dust seal.",
    badge: "Hardware Included",
  },
]

export function LandingCraftsmanship(): React.JSX.Element {
  return (
    <section id="craftsmanship" className="w-full py-16 sm:py-24 px-4 sm:px-8 border-t border-border/70 bg-card/40">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary font-mono bg-primary/10 px-3 py-1 rounded-full inline-block">
            Atelier Standards
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            Bespoke framing engineered for permanence.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every frame from ART FRAME is custom fabricated by master artisans using materials vetted for museum conservation and gallery display.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CRAFTSMANSHIP_PILLARS.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="group p-6 rounded-2xl border border-border/80 bg-card/90 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {pillar.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-primary font-medium mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
