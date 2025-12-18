import { addFeedback, getAllFeedback, getPaginatedFeedback, getFeedbackCount } from "@/lib/feedbackStore"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
  const sortParam = searchParams.get('sort') || 'desc'
  const sort = (sortParam === 'asc' || sortParam === 'desc') ? sortParam : 'desc'

  const data = getPaginatedFeedback(page, limit, sort)
  const total = getFeedbackCount()
  const totalPages = Math.ceil(total / limit)

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  })
}

export async function POST(req: Request) {
  const body = await req.json()

  const message = body.message?.trim() || ""

  if (message.length === 0) {
    return NextResponse.json(
      { error: "Feedback message is required", field: "message" },
      { status: 400 }
    )
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Message must be at least 10 characters", field: "message" },
      { status: 400 }
    )
  }

  if (message.length > 1000) {
    return NextResponse.json(
      { error: "Message cannot exceed 1000 characters", field: "message" },
      { status: 400 }
    )
  }

  addFeedback(message)

  return NextResponse.json({ success: true })
}