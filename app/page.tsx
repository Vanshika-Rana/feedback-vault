"use client"

import { useState } from "react"

export default function Home() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")

  async function submitFeedback() {
    setStatus("Submitting...")

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    })

    if (res.ok) {
      setMessage("")
      setStatus("Feedback submitted!")
    } else {
      setStatus("Error submitting feedback")
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
        className="bg-black text-white px-4 py-2"
      >
        Submit
      </button>

      {status && <p className="mt-3">{status}</p>}
    </main>
  )
}