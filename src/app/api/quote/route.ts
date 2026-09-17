import { NextRequest, NextResponse } from "next/server"
import { QuoteRequestBody, QuoteApiResponse } from "@/types"

const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSchRt3iw9f0L19_kfYXEwKhwxc-MjiyhUOzBxpplbd5r20AlA/formResponse"

export async function POST(
  req: NextRequest
): Promise<NextResponse<QuoteApiResponse>> {
  try {
    const body = (await req.json()) as Partial<QuoteRequestBody>

    const name = body.name?.trim() ?? ""
    const phone = body.phone?.trim() ?? ""
    const msg = body.msg?.trim() || "No message provided"
    const selectedFrameName = body.selectedFrameName?.trim() ?? ""
    const frameAspectRatio = body.frameAspectRatio?.trim() ?? ""
    const orderQuantity = body.orderQuantity?.trim() ?? "1"
    const artWorkSize = body.artWorkSize?.trim() ?? ""
    const estimatedTotalPrice = body.estimatedTotalPrice?.trim() ?? ""

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      )
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      )
    }

    // Prepare Google Form URL-encoded parameters
    const formData = new URLSearchParams()
    formData.append("entry.340562979", name)
    formData.append("entry.1501954597", phone)
    formData.append("entry.1748827784", msg)
    formData.append("entry.1844082665", selectedFrameName)
    formData.append("entry.2040621829", frameAspectRatio)
    formData.append("entry.1854368037", orderQuantity)
    formData.append("entry.336354676", artWorkSize)
    formData.append("entry.1643711256", estimatedTotalPrice)

    // Submit to Google Form formResponse endpoint
    const response = await fetch(GOOGLE_FORM_ACTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      redirect: "follow",
    })

    // Google Forms returns 200 OK or 302 redirect on successful submission
    if (!response.ok && response.status !== 302 && response.status !== 200) {
      console.warn("Google Form response status:", response.status)
    }

    const refId = `#AF-${Math.floor(100000 + Math.random() * 900000)}`

    return NextResponse.json({
      success: true,
      refId,
    })
  } catch (error: unknown) {
    console.error("Quote API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit quote inquiry. Please try again or use WhatsApp.",
      },
      { status: 500 }
    )
  }
}
