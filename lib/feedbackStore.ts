export type Feedback = {
    id: string
    message: string
    createdAt: Date
  }
  
  const feedbackStore: Feedback[] = []
  
  export function addFeedback(message: string) {
    feedbackStore.push({
      id: crypto.randomUUID(),
      message,
      createdAt: new Date()
    })
  }
  
  export function getAllFeedback() {
    return feedbackStore
  }

  export function getFeedbackCount() {
    return feedbackStore.length
  }

  export function getPaginatedFeedback(
    page: number = 1,
    limit: number = 10,
    sort: 'asc' | 'desc' = 'desc'
  ) {
    const sortedFeedback = [...feedbackStore].sort((a, b) => {
      if (sort === 'desc') {
        return b.createdAt.getTime() - a.createdAt.getTime()
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime()
      }
    })

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return sortedFeedback.slice(startIndex, endIndex)
  }