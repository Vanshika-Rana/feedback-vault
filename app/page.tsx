"use client"

import { useState } from "react"
import { showError, showSuccess } from "@/lib/toast"

export default function Home() {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validateMessage(message: string): { valid: boolean; error?: string } {
    const trimmed = message.trim()

    if (trimmed.length === 0) {
      return { valid: false, error: "Feedback message is required" }
    }

    if (trimmed.length < 10) {
      return { valid: false, error: "Message must be at least 10 characters" }
    }

    if (trimmed.length > 1000) {
      return { valid: false, error: "Message cannot exceed 1000 characters" }
    }

    return { valid: true }
  }

  async function submitFeedback() {
    const validation = validateMessage(message)

    if (!validation.valid) {
      showError(validation.error!)
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      })

      if (res.ok) {
        showSuccess("Feedback submitted successfully!")
        setMessage("")
      } else {
        const data = await res.json()
        showError(data.error || "Failed to submit feedback. Please try again.")
      }
    } catch (error) {
      showError("Network error. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Feedback</h1>

      <textarea
        className="w-full border p-2 mb-3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your feedback..."
      />

      <button
        onClick={submitFeedback}
        disabled={isSubmitting}
        className="bg-black text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </main>
  )
}