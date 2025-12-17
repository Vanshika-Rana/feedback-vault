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