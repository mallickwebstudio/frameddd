import { MatColor, WallBackground } from "@/types"

export const MAT_COLORS: MatColor[] = [
  {
    id: "off-white",
    name: "Archival Off-White",
    hex: "#f7f6f2",
    coreColor: "#ffffff",
  },
  {
    id: "bright-white",
    name: "Crisp Pure White",
    hex: "#ffffff",
    coreColor: "#ffffff",
  },
  {
    id: "warm-cream",
    name: "Warm Gallery Ivory",
    hex: "#ede7dc",
    coreColor: "#fbf8f2",
  },
  {
    id: "charcoal-black",
    name: "Midnight Black Core",
    hex: "#222326",
    coreColor: "#ffffff",
  },
  {
    id: "sandstone",
    name: "Natural Sandstone",
    hex: "#d9d0c1",
    coreColor: "#ffffff",
  },
  {
    id: "sage-botanical",
    name: "Botanical Sage",
    hex: "#9aa394",
    coreColor: "#ffffff",
  },
  {
    id: "navy-indigo",
    name: "Deep Gallery Indigo",
    hex: "#263242",
    coreColor: "#ffffff",
  },
  {
    id: "linen-textured",
    name: "French Flax Linen",
    hex: "#dfd7cb",
    coreColor: "#f7f3ee",
  },
]

export interface WallColorSwatch {
  id: string
  name: string
  hex: string
  category: "neutral" | "warm" | "moody" | "bold"
}

export const WALL_COLOR_SWATCHES: WallColorSwatch[] = [
  { id: "chalk-white", name: "Chalk White", hex: "#f8f9fa", category: "neutral" },
  { id: "alabaster", name: "Warm Alabaster", hex: "#f3efe6", category: "neutral" },
  { id: "soft-greige", name: "Limewash Greige", hex: "#ded9d0", category: "neutral" },
  { id: "down-pipe", name: "Down Pipe Charcoal", hex: "#3f464b", category: "moody" },
  { id: "studio-slate", name: "Architectural Slate", hex: "#2b3036", category: "moody" },
  { id: "sage-olive", name: "Heritage Sage Olive", hex: "#7a8775", category: "warm" },
  { id: "terracotta-clay", name: "Tuscan Terracotta", hex: "#b4644a", category: "warm" },
  { id: "deep-navy", name: "Midnight Gallery Navy", hex: "#1c2636", category: "moody" },
  { id: "mustard-ochre", name: "Warm Amber Ochre", hex: "#b89052", category: "bold" },
  { id: "emerald-reserve", name: "Velvet Emerald", hex: "#1f3b30", category: "bold" },
]

export const WALL_PRESETS: WallBackground[] = [
  {
    type: "preset",
    name: "Architectural Studio (01)",
    category: "Studio Wall",
    value: "/images/wall/01.webp",
    brightness: 1.0,
  },
  {
    type: "preset",
    name: "Contemporary Gallery (02)",
    category: "Living Space",
    value: "/images/wall/02.webp",
    brightness: 1.0,
  },
  {
    type: "preset",
    name: "Modern Minimalist (03)",
    category: "Interior Wall",
    value: "/images/wall/03.webp",
    brightness: 1.0,
  },
  {
    type: "preset",
    name: "Curated Exhibition (04)",
    category: "Exhibition Hall",
    value: "/images/wall/04.webp",
    brightness: 1.0,
  },
  {
    type: "preset",
    name: "Classic Atelier (05)",
    category: "Heritage Wall",
    value: "/images/wall/05.webp",
    brightness: 1.0,
  },
]
