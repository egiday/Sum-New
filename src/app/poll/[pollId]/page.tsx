import * as React from 'react'
import { VotingForm } from '@/components/voting-form'

interface PageProps {
  params: {
    pollId: string
  }
}

export default async function PollPage({ params }: PageProps) {
  const { pollId } = params

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <VotingForm pollId={pollId} />
        </div>
      </div>
    </main>
  )
}