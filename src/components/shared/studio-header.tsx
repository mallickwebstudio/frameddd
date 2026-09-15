"use client"

import * as React from "react"
import { Frame, Download, Calculator, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FabricationQuote } from "@/types"

interface StudioHeaderProps {
  quote: FabricationQuote
  onOpenQuoteModal: () => void
  onExportMockup: () => void
}

export function StudioHeader({
  quote,
  onOpenQuoteModal,
  onExportMockup,
}: StudioHeaderProps): React.JSX.Element {
  return (
    <header className="w-full border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
          <Frame className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg sm:text-xl font-medium tracking-wide text-foreground">
              ATELIER FRAME &amp; CO.
            </h1>
            <Badge variant="secondary" className="text-[10px] uppercase font-mono px-1.5 py-0.5 tracking-wider hidden sm:inline-flex">
              Studio MVP
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Custom Fine Art Framing &amp; On-Wall Simulation Studio
          </p>
        </div>
      </div>

      {/* Frame Dimensions & Quick Specs */}
      <div className="hidden md:flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-full border border-border/80 text-xs">
        <span className="text-muted-foreground">Art:</span>
        <span className="font-semibold text-foreground">
          {quote.artWidthInches}&quot; &times; {quote.artHeightInches}&quot;
        </span>
        <span className="text-muted-foreground/50 mx-0.5">•</span>
        <span className="text-muted-foreground">Overall Frame:</span>
        <span className="font-semibold text-foreground">
          {quote.totalWidthInches}&quot; &times; {quote.totalHeightInches}&quot;
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportMockup}
          className="text-xs gap-1.5 border-border hover:bg-muted"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Mockup</span>
        </Button>
      </div>
    </header>
  )
}
