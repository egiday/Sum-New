'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Loader2, BarChart2, CheckCircle2, Vote } from 'lucide-react'

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card glass className="w-full overflow-hidden border-[0.5px] shadow-xl">
          <CardContent className="p-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive-foreground bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!pollData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card glass className="w-full overflow-hidden border-[0.5px] shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading poll...</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (hasVoted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card glass className="w-full overflow-hidden border-[0.5px] shadow-xl">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-xl sm:text-2xl text-center font-medium">{pollData.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 pb-6 px-6">
            <div className="flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-foreground p-4 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>You have already voted in this poll.</span>
            </div>
            {previousVote && (
              <div className="text-center text-muted-foreground bg-muted/30 p-3 rounded-xl border border-muted/30">
                Your vote: <span className="font-medium text-foreground">{previousVote}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 pb-6 px-6">
            <Button
              variant="outline"
              className="w-full gap-2 h-12"
              size="lg"
              onClick={() => router.push(`/poll/${pollId}/results`)}
            >
              <BarChart2 className="h-4 w-4" />
              View Results
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card glass className="w-full overflow-hidden border-[0.5px] shadow-xl">
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-xl sm:text-2xl text-center font-medium">{pollData.question}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-6">
          <div className="space-y-3">
            <AnimatePresence>
              {pollData.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <Button
                    variant={selectedOption === option ? "default" : "glass"}
                    className={`w-full justify-start h-auto py-4 px-5 text-base rounded-xl transition-all duration-300 ${
                      selectedOption === option
                        ? "shadow-md"
                        : "hover:bg-white/20"
                    }`}
                    size="lg"
                    onClick={() => setSelectedOption(option)}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-destructive-foreground bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="pt-0 pb-6 px-6 flex flex-col">
          <Button
            className="w-full gap-2 h-12"
            size="lg"
            onClick={handleVote}
            disabled={!selectedOption || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Vote className="h-4 w-4" />
                Submit Vote
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}