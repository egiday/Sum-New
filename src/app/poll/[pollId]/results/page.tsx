import * as React from 'react'
import { PollResults } from '@/components/poll-results'

interface PageProps {
  params: {
    pollId: string
  }
}

export default async function ResultsPage({ params }: PageProps) {
  const { pollId } = params

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-foreground">
      <div className="max-w-2xl w-full flex flex-col items-center">
        <PollResults pollId={pollId} />
      </div>
    </main>
  )
}