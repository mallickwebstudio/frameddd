export type FrameMaterial = "wood" | "metal" | "classic" | "modern"

export type FrameRatio = "1:1" | "16:9" | "9:16" | "3:4" | "4:3"

export type FrameCategoryType =
  | "all"
  | "standard"
  | "vintage-ornate"
  | "shadow-box"
  | "floating"

export interface StandardFrameSize {
  id: string
  name: string
  dimensions: string
  widthInches: number
  heightInches: number
  recommendedUse: string
}

export interface FrameInset {
  top: number
  right: number
  bottom: number
  left: number
}

export interface FrameStyle {
  id: string
  name: string
  material: FrameMaterial
  category?: FrameCategoryType
  finish: string
  color: string
  price: number // ₹240
  pricePerFoot: number
  imageUrl: string
  ratio: FrameRatio
  aspectRatio: number // width / height numerical
  dimensions?: string // e.g. "12×12\"" or "16×9\""
  innerInset: FrameInset // percentage insets for inner transparent opening
  rotation?: number // 0 or 90
  mouldingWidthRange?: [number, number] // min and max inches
  defaultWidth?: number // inches
  depthInches?: number // frame depth (e.g. 1.75" for shadow box)
  useNineSlice?: boolean // auto-adjusting 9-slice frame scaling
  sliceBorder?: number | string // pixel or percentage inset for corners in master PNG
  sliceRepeat?: "repeat" | "round" | "stretch" // edge tiling mode
  description: string
  badge?: string
  // Visual rendering properties
  borderCss?: string
  boxShadowCss?: string
  innerLipCss?: string
  textureGradient?: string
  accentHighlight?: string
}

export interface MatColor {
  id: string
  name: string
  hex: string
  coreColor: string // inner bevel edge color (usually crisp white, cream, or black core)
}

export interface MatConfig {
  enabled: boolean
  color: MatColor
  widthInches: number
  isDoubleMat: boolean
  accentColor?: MatColor
  accentWidthInches?: number
}

export interface ArtworkConfig {
  id: string
  title: string
  src: string
  aspectRatio: number // width / height
  originalWidthInches: number
  originalHeightInches: number
  rotation: number // 0, 90, 180, 270
}

export type WallBackgroundType = "color" | "preset" | "upload"

export interface WallBackground {
  type: WallBackgroundType
  value: string // hex code or image URL / base64 data
  name: string
  category?: string
  brightness?: number // 0.5 to 1.5
  overlayUrl?: string // optional furniture/room foreground element
}

export type GlazingType = "standard-acrylic" | "non-glare" | "museum-uv-99"

export interface GlazingOption {
  id: GlazingType
  name: string
  badge?: string
  description: string
  priceMultiplier: number
  uvProtectionPercent: number
  reflectionGlareOpacity: number // 0 (non-glare) to 0.4 (standard)
}

export type HangingHardware = "wire-hanger" | "sawtooth" | "heavy-duty-cleat"

export interface HardwareOption {
  id: HangingHardware
  name: string
  description: string
  price: number
}

export interface FabricationQuote {
  artWidthInches: number
  artHeightInches: number
  frameWidthInches: number
  totalWidthInches: number
  totalHeightInches: number
  framePerimeterFeet: number
  frameCost: number
  matCost: number
  glazingCost: number
  hardwareCost: number
  laborAndAssemblyCost: number
  subtotal: number
  tax: number
  total: number
  quantity: number
  unitPrice: number
}

export interface StudioState {
  artwork: ArtworkConfig
  frame: FrameStyle
  mouldingWidthInches: number
  mat: MatConfig
  wall: WallBackground
  glazing: GlazingType
  hardware: HangingHardware
  showGlassGlare: boolean
  showScaleReference: boolean
  zoomLevel: number // 0.8 to 1.5
}
