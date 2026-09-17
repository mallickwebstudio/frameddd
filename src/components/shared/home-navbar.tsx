"use client"

import Link from "next/link"
import { Frame, Upload, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeNavbarProps {
  onOpenStudio: () => void
  onUploadClick: () => void
}

export function HomeNavbar({ onOpenStudio, onUploadClick }: HomeNavbarProps): React.JSX.Element {
  return (
    <header className="w-full border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 select-none group">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Frame className="w-4 h-4" />
          </div>
          <span className="font-heading text-xl font-medium tracking-wider text-foreground group-hover:text-primary transition-colors">
            ART FRAME
          </span>
        </Link>

        {/* In-Page Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs text-muted-foreground font-medium">
          <Link
            href="#craftsmanship"
            className="hover:text-foreground transition-colors"
          >
            Craftsmanship
          </Link>
          <Link
            href="#frames"
            className="hover:text-foreground transition-colors"
          >
            Moulding Collection
          </Link>
          <Link
            href="#visualizer"
            className="hover:text-foreground transition-colors"
          >
            16:9 Simulation
          </Link>
          <Link
            href="#pricing"
            className="hover:text-foreground transition-colors"
          >
            Pricing (₹240)
          </Link>
          <Link
            href="#faq"
            className="hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUploadClick}
            className="text-xs hidden sm:inline-flex gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Art
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onOpenStudio}
            className="text-xs gap-1.5 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </header>
  )
}
