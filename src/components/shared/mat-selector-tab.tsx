"use client"

import * as React from "react"
import { Check, Layers } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { MatColor, MatConfig } from "@/types"
import { MAT_COLORS } from "@/db/presets"

interface MatSelectorTabProps {
  mat: MatConfig
  onMatChange: (mat: MatConfig) => void
}

export function MatSelectorTab({ mat, onMatChange }: MatSelectorTabProps): React.JSX.Element {
  const toggleEnabled = (checked: boolean): void => {
    onMatChange({ ...mat, enabled: checked })
  }

  const toggleDoubleMat = (checked: boolean): void => {
    onMatChange({
      ...mat,
      isDoubleMat: checked,
      accentColor: checked ? (mat.accentColor ?? MAT_COLORS[3]) : undefined,
      accentWidthInches: checked ? (mat.accentWidthInches ?? 0.25) : undefined,
    })
  }

  const selectColor = (color: MatColor): void => {
    onMatChange({ ...mat, color })
  }

  const selectAccentColor = (accentColor: MatColor): void => {
    onMatChange({ ...mat, accentColor })
  }

  const changeWidth = (widthInches: number): void => {
    onMatChange({ ...mat, widthInches })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Enable Matboard Toggle */}
      <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between shadow-xs">
        <div>
          <h4 className="text-xs font-semibold text-foreground">Include Conservation Matboard</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            4-ply 100% archival alpha-cellulose with 45° beveled cut
          </p>
        </div>
        <Switch checked={mat.enabled} onCheckedChange={toggleEnabled} />
      </div>

      {mat.enabled && (
        <>
          {/* Matboard Primary Color Swatches */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
              Primary Mat Color
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MAT_COLORS.map((color) => {
                const isSelected = mat.color.id === color.id
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => selectColor(color)}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 bg-muted/60 shadow-xs"
                        : "border-border bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-black/15 shadow-xs shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3 h-3 ${
                            color.id === "charcoal-black" ? "text-white" : "text-black"
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-foreground truncate">
                      {color.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mat Margin Width Slider */}
          <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Mat Margin Border Width
              </span>
              <span className="text-xs font-mono font-bold text-foreground bg-card border border-border px-2 py-0.5 rounded">
                {mat.widthInches}&quot; per side
              </span>
            </div>

            <Slider
              value={[mat.widthInches]}
              min={1.0}
              max={4.5}
              onValueChange={(val) => {
                const nextVal = Array.isArray(val) ? val[0] : val
                if (typeof nextVal === "number") {
                  changeWidth(nextVal)
                }
              }}
            />

            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>Subtle: 1.0&quot;</span>
              <span>Balanced: 2.5&quot;</span>
              <span>Exhibition: 4.5&quot;</span>
            </div>
          </div>

          {/* Double Matting Option */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-foreground">Double Mat Accent Trim</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Adds a stepped 1/4&quot; inner accent reveal border
                </p>
              </div>
              <Switch checked={mat.isDoubleMat} onCheckedChange={toggleDoubleMat} />
            </div>

            {mat.isDoubleMat && (
              <div className="pt-3 border-t border-border space-y-2">
                <label className="text-[11px] font-semibold text-foreground tracking-wide uppercase">
                  Accent Reveal Color
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MAT_COLORS.map((accent) => {
                    const isSelected = mat.accentColor?.id === accent.id
                    return (
                      <button
                        key={`accent-${accent.id}`}
                        type="button"
                        onClick={() => selectAccentColor(accent)}
                        className={`p-1.5 rounded-lg border text-left transition-all flex items-center gap-2 ${
                          isSelected
                            ? "border-primary ring-1 ring-primary bg-muted/60"
                            : "border-border bg-card hover:bg-muted/40"
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: accent.hex }}
                        />
                        <span className="text-[10px] font-medium text-foreground truncate">
                          {accent.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
