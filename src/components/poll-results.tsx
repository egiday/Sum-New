'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Loader2, Users, BarChart2 } from 'lucide-react'

interface PollResultsProps {
  pollId: string
}

interface PollResults {
  question: string
  options: string[]
  voteCounts: { [key: string]: number }
  totalVotes: number
}

export function PollResults({ pollId }: PollResultsProps) {
  const [results, setResults] = useState<PollResults | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/polls/${pollId}/results`)
        if (!response.ok) {
          throw new Error('Failed to fetch results')
        }
        const data = await response.json()
        setResults(data)
      } catch (err) {
        setError('Failed to load results. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [pollId])

  if (error) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="text-center text-red-500 bg-red-50 p-3 rounded-md">{error}</div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading results...</span>
        </div>
      </Card>
    )
  }

  if (!results) return null

  // Find the winning option(s)
  const maxVotes = Math.max(...Object.values(results.voteCounts))
  const winningOptions = results.options.filter(
    option => results.voteCounts[option] === maxVotes
  )

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{results.question}</h2>

      <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
        <Users className="h-4 w-4" />
        <span>{results.totalVotes} total vote{results.totalVotes !== 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-6">
        {results.options.map((option, index) => {
          const voteCount = results.voteCounts[option] || 0
          const percentage = results.totalVotes > 0
            ? Math.round((voteCount / results.totalVotes) * 100)
            : 0
          const isWinner = winningOptions.includes(option)

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{option}</span>
                  {isWinner && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Winner
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart2 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">
                    {voteCount} ({percentage}%)
                  </span>
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    isWinner ? 'bg-green-500' : 'bg-primary'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {winningOptions.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {winningOptions.length === 1 ? (
              <>
                <span className="font-medium">{winningOptions[0]}</span> is winning with {maxVotes} votes
              </>
            ) : (
              <>
                It's a tie between {winningOptions.length} options with {maxVotes} votes each
              </>
            )}
          </p>
        </div>
      )}
    </Card>
  )
}