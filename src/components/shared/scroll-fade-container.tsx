"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollFadeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export function ScrollFadeContainer({
  children,
  className,
  contentClassName,
  ...props
}: ScrollFadeContainerProps): React.JSX.Element {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState<boolean>(false)
  const [canScrollRight, setCanScrollRight] = React.useState<boolean>(true)

  const checkScroll = React.useCallback((): void => {
    const el = scrollRef.current
    if (!el) return
    const hasOverflow = el.scrollWidth > el.clientWidth
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkScroll()
    el.addEventListener("scroll", checkScroll, { passive: true })
    window.addEventListener("resize", checkScroll)

    const observer = new ResizeObserver(checkScroll)
    observer.observe(el)

    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
      observer.disconnect()
    }
  }, [checkScroll])

  return (
    <div className={cn("relative group/fade w-full overflow-hidden -mx-1", className)} {...props}>
      {/* Scrollable Container with Horizontal Padding and CSS Mask Fade */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-2.5 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar scroll-smooth",
          contentClassName
        )}
        style={{
          maskImage:
            canScrollLeft && canScrollRight
              ? "linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)"
              : canScrollLeft
              ? "linear-gradient(to right, transparent 0%, black 20px, black 100%)"
              : canScrollRight
              ? "linear-gradient(to right, black 0%, black calc(100% - 20px), transparent 100%)"
              : undefined,
          WebkitMaskImage:
            canScrollLeft && canScrollRight
              ? "linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)"
              : canScrollLeft
              ? "linear-gradient(to right, transparent 0%, black 20px, black 100%)"
              : canScrollRight
              ? "linear-gradient(to right, black 0%, black calc(100% - 20px), transparent 100%)"
              : undefined,
        }}
      >
        {children}
      </div>
    </div>
  )
}
