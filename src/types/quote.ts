export interface QuoteRequestBody {
  name: string
  phone: string
  msg?: string
  selectedFrameName: string
  frameAspectRatio: string
  orderQuantity: string
  artWorkSize: string
  estimatedTotalPrice: string
}

export interface QuoteApiResponse {
  success: boolean
  refId?: string
  error?: string
}
