"use client"

import Link from "next/link"
import { Frame, Upload, ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeNavbarProps {
  page?: "home" | "studio"
  onOpenStudio?: () => void
  onUploadClick?: () => void
  onExportMockup?: () => void
}

export function HomeNavbar({
  page = "home",
  onOpenStudio,
  onUploadClick,
  onExportMockup,
}: HomeNavbarProps): React.JSX.Element {
  const isStudio = page === "studio"
  const prefix = isStudio ? "/" : ""

  return (
    <header className="w-full border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-2.5">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 select-none group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#FA6446] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Frame className="w-4 h-4" />
          </div>
          <span className="font-heading text-xl font-medium tracking-wider text-foreground group-hover:text-primary transition-colors">
            ART FRAME
          </span>
        </Link>


        {/* Action Buttons (conditioned on page) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* On Homepage: Show Upload Art & Open Studio */}
          {!isStudio && (
            <>
              {onUploadClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUploadClick}
                  className="text-xs hidden sm:inline-flex gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Art
                </Button>
              )}

              {onOpenStudio && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onOpenStudio}
                  className="text-xs gap-1.5 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              )}
            </>
          )}

          {/* On Studio Page: Hide Open Studio, Show Export Mockup */}
          {isStudio && onExportMockup && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportMockup}
              className="text-xs gap-1.5 border-border hover:bg-muted cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Mockup</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
