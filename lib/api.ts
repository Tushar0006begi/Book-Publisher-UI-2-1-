const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"

// Author API functions
export async function submitManuscript(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/author/submit`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to submit manuscript")
  }

  return response.json()
}

export async function getAuthorSubmissions(authorId: number) {
  const response = await fetch(`${API_BASE_URL}/api/author/submissions/${authorId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch submissions")
  }

  return response.json()
}

// Publisher API functions
export async function getPublisherSubmissions() {
  const response = await fetch(`${API_BASE_URL}/api/publisher/submissions`)

  if (!response.ok) {
    throw new Error("Failed to fetch publisher submissions")
  }

  return response.json()
}

export async function updateSubmissionStatus(submissionId: number, status: "accepted" | "rejected", feedback?: string) {
  const response = await fetch(`${API_BASE_URL}/api/publisher/submissions/${submissionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, feedback }),
  })

  if (!response.ok) {
    throw new Error("Failed to update submission status")
  }

  return response.json()
}
