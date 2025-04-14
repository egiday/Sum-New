'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, BarChart2, CheckCircle2 } from 'lucide-react'

interface VotingFormProps {
  pollId: string
}

interface PollData {
  question: string
  options: string[]
}

export function VotingForm({ pollId }: VotingFormProps) {
  const router = useRouter()
  const [pollData, setPollData] = useState<PollData | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [hasVoted, setHasVoted] = useState(false)
  const [previousVote, setPreviousVote] = useState<string | null>(null)

  useEffect(() => {
    // Check if user has already voted
    const votedPolls = localStorage.getItem('votedPolls')
    if (votedPolls) {
      const votedPollsArray = JSON.parse(votedPolls)
      if (votedPollsArray.includes(pollId)) {
        setHasVoted(true)
        // Get the previous vote if stored
        const previousVotes = localStorage.getItem('previousVotes')
        if (previousVotes) {
          const previousVotesObj = JSON.parse(previousVotes)
          setPreviousVote(previousVotesObj[pollId] || null)
        }
      }
    }

    // Fetch poll data
    const fetchPollData = async () => {
      try {
        const response = await fetch(`/api/polls/${pollId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch poll data')
        }
        const data = await response.json()
        setPollData(data)
      } catch (err) {
        setError('Failed to load poll. Please try again.')
      }
    }

    fetchPollData()
  }, [pollId])

  const handleVote = async () => {
    if (!selectedOption) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedOption }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit vote')
      }

      // Store voted poll ID in localStorage
      const votedPolls = localStorage.getItem('votedPolls')
      const votedPollsArray = votedPolls ? JSON.parse(votedPolls) : []
      votedPollsArray.push(pollId)
      localStorage.setItem('votedPolls', JSON.stringify(votedPollsArray))

      // Store the actual vote
      const previousVotes = localStorage.getItem('previousVotes')
      const previousVotesObj = previousVotes ? JSON.parse(previousVotes) : {}
      previousVotesObj[pollId] = selectedOption
      localStorage.setItem('previousVotes', JSON.stringify(previousVotesObj))

      // Redirect to results page
      router.push(`/poll/${pollId}/results`)
    } catch (err) {
      setError('Failed to submit vote. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</div>
      </Card>
    )
  }

  if (!pollData) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading poll...</span>
        </div>
      </Card>
    )
  }

  if (hasVoted) {
    return (
      <Card className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{pollData.question}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-md">
            <CheckCircle2 className="h-5 w-5" />
            <span>You have already voted in this poll.</span>
          </div>
          {previousVote && (
            <div className="text-center text-gray-600">
              Your previous vote: <span className="font-medium">{previousVote}</span>
            </div>
          )}
          <Button
            className="w-full gap-2"
            onClick={() => router.push(`/poll/${pollId}/results`)}
          >
            <BarChart2 className="h-4 w-4" />
            View Results
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{pollData.question}</h2>
      <div className="space-y-3">
        {pollData.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedOption === option ? 'default' : 'outline'}
            className="w-full justify-start h-auto py-3 px-4 text-base"
            onClick={() => setSelectedOption(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      {error && (
        <div className="mt-4 text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</div>
      )}
      <Button
        className="w-full mt-6 gap-2"
        onClick={handleVote}
        disabled={!selectedOption || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Vote'
        )}
      </Button>
    </Card>
  )
}