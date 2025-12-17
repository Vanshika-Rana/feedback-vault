import { addFeedback, getAllFeedback } from "@/lib/feedbackStore"
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(getAllFeedback())
}

export async function POST(req: Request) {
  const body = await req.json()

  if (!body.message) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    )
  }

  addFeedback(body.message)

  return NextResponse.json({ success: true })
}