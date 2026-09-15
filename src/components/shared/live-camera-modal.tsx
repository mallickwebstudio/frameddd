"use client"

import * as React from "react"
import { Camera, RefreshCw, X, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LiveCameraModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (imageDataUrl: string) => void
}

export function LiveCameraModal({ isOpen, onClose, onCapture }: LiveCameraModalProps): React.JSX.Element | null {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [stream, setStream] = React.useState<MediaStream | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [facingMode, setFacingMode] = React.useState<"environment" | "user">("environment")
  const [isInitializing, setIsInitializing] = React.useState<boolean>(true)

  const stopStream = React.useCallback((): void => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const startCamera = React.useCallback(async (facing: "environment" | "user"): Promise<void> => {
    setIsInitializing(true)
    setError(null)
    try {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
    } catch (err: unknown) {
      console.error("Camera access failed:", err)
      setError("Unable to access your camera. Please allow camera permissions or upload an image instead.")
    } finally {
      setIsInitializing(false)
    }
  }, [stream])

  React.useEffect(() => {
    if (isOpen) {
      void startCamera(facingMode)
    } else {
      stopStream()
    }
    return () => {
      stopStream()
    }
  }, [isOpen, facingMode, startCamera, stopStream])

  const handleCapture = (): void => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92)
    onCapture(dataUrl)
    stopStream()
    onClose()
  }

  const toggleFacingMode = (): void => {
    const nextMode = facingMode === "environment" ? "user" : "environment"
    setFacingMode(nextMode)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-base text-foreground">Snap Your Wall with Camera</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stopStream()
              onClose()
            }}
            aria-label="Close camera modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Video Viewfinder */}
        <div className="relative aspect-video bg-neutral-950 flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center max-w-md">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="text-sm text-foreground/90 font-medium">{error}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Tip: You can take a picture with your phone or camera app and use the &quot;Upload Photo&quot; button instead.
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                onLoadedMetadata={() => {
                  void videoRef.current?.play()
                }}
              />
              {/* Subtle visual viewfinder guide */}
              <div className="pointer-events-none absolute inset-8 border border-dashed border-white/40 rounded-xl flex items-center justify-center">
                <span className="bg-black/60 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full font-mono">
                  Point camera at the wall where you want to hang your artwork
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-muted/20 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFacingMode}
            disabled={Boolean(error) || isInitializing}
            className="text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Switch Camera ({facingMode === "environment" ? "Back" : "Front"})
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                stopStream()
                onClose()
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleCapture}
              disabled={Boolean(error) || isInitializing}
              className="gap-2 bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"
            >
              <Check className="w-4 h-4" />
              Capture Wall Background
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
