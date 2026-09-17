"use client"

import * as React from "react"
import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPricingProps {
  onOpenStudio: () => void
}

const PRICING_TIERS = [
  {
    name: "Individual Piece",
    quantity: "1 Frame",
    price: "₹240",
    unitPrice: "₹240 per frame",
    description: "Ideal for a signature portrait, diploma, or centerpiece print.",
    isPopular: false,
    cta: "Frame Single Piece",
  },
  {
    name: "Gallery Collection",
    quantity: "5 Frames",
    price: "₹1,200",
    unitPrice: "₹240 per frame",
    description: "Perfect for cohesive gallery walls, family photo grids, and trios.",
    isPopular: true,
    cta: "Start Gallery Wall",
  },
  {
    name: "Exhibition / Interior",
    quantity: "10 Frames",
    price: "₹2,400",
    unitPrice: "₹240 per frame",
    description: "Designed for commercial spaces, photography showcases, and office decor.",
    isPopular: false,
    cta: "Configure Bulk Order",
  },
]

const INCLUDED_BENEFITS = [
  "Solid timber moulding custom-cut with seamless 45° mitred corners",
  "Museum-grade 4-ply acid-free archival matboard with bevel window",
  "Optical-grade lightweight UV conservation glazing",
  "Acid-free backing board with protective dust barrier seal",
  "Pre-installed heavy-duty coated wire & silicone wall bumpers",
  "Instant quote generation with WhatsApp and Google Form dispatch",
]

export function LandingPricing({ onOpenStudio }: LandingPricingProps): React.JSX.Element {
  return (
    <section id="pricing" className="w-full py-16 sm:py-24 px-4 sm:px-8 border-t border-border/70 bg-background">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary font-mono bg-primary/10 px-3 py-1 rounded-full inline-block">
            Transparent Pricing
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            No markups. Flat ₹240 per bespoke frame.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Traditional framers add complex matting surcharges, glass multipliers, and labor fees. At ART FRAME, everything is included in our transparent flat rate.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`p-6 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between space-y-6 relative ${
                tier.isPopular
                  ? "bg-card border-primary shadow-xl ring-1 ring-primary/20"
                  : "bg-card/70 border-border/80 hover:border-primary/40 hover:shadow-lg"
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-foreground">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-foreground">
                      {tier.price}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      / {tier.quantity}
                    </span>
                  </div>
                  <span className="text-[11px] text-primary font-mono font-semibold block mt-0.5">
                    {tier.unitPrice}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant={tier.isPopular ? "default" : "outline"}
                onClick={onOpenStudio}
                className="w-full text-xs font-semibold gap-1.5 cursor-pointer py-4"
              >
                {tier.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {/* All-Inclusive Guarantee Checklist */}
        <div className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card/60 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Every Single Frame Includes At No Extra Charge:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {INCLUDED_BENEFITS.map((b) => (
              <div key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
