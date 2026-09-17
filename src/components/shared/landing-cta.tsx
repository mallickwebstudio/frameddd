"use client"

import * as React from "react"
import { Upload, ArrowRight, Frame as FrameIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingCtaProps {
  onUploadClick: () => void
  onOpenStudio: () => void
}

export function LandingCta({ onUploadClick, onOpenStudio }: LandingCtaProps): React.JSX.Element {
  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-8 border-t border-border/70 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 border border-primary/30 bg-primary/5 text-center space-y-6 shadow-xl">
          {/* Subtle background glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 50% 30%, rgba(241,103,78,0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transform Your Space Today</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-medium tracking-tight text-foreground">
              Ready to see your art framed on the wall?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Upload any photograph or choose a fine art sample. Experience artisan framing and custom 16:9 on-wall visualization in under 60 seconds.
            </p>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={onUploadClick}
              className="w-full sm:w-auto py-6 px-8 text-xs font-semibold gap-2 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload Your Picture
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={onOpenStudio}
              className="w-full sm:w-auto py-6 px-8 text-xs font-semibold gap-2 border-border/80 hover:bg-card rounded-xl cursor-pointer"
            >
              <FrameIcon className="w-4 h-4" />
              Launch 16:9 Studio
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
