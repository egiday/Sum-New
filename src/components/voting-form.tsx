'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Loader2, BarChart2, CheckCircle2, Vote, Share2, Copy, ArrowLeft } from 'lucide-react'

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
  const [copied, setCopied] = useState(false)

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

  const copyPollLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="w-full overflow-hidden border-[0.5px] shadow-xl bg-card/95 backdrop-blur-xl">
          <CardContent className="p-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive-foreground bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-sm font-medium text-center"
            >
              {error}
            </motion.div>
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
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
        <Card className="w-full overflow-hidden border-[0.5px] shadow-xl bg-card/95 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-12">
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
        className="w-full"
      >
        <Card className="w-full overflow-hidden border-[0.5px] shadow-xl bg-card/95 backdrop-blur-xl">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-xl sm:text-2xl text-center font-medium">{pollData.question}</CardTitle>
            <CardDescription className="text-center mt-2">This poll has {pollData.options.length} options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 pb-6 px-6">
            <motion.div
              className="flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-foreground p-4 rounded-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>You have already voted in this poll.</span>
            </motion.div>
            {previousVote && (
              <motion.div
                className="text-center text-muted-foreground bg-muted/30 p-4 rounded-xl border border-muted/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your vote: <span className="font-semibold text-foreground">{previousVote}</span>
              </motion.div>
            )}

            <motion.div
              className="flex justify-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                className="gap-2"
                size="sm"
                onClick={copyPollLink}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Share Poll
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
          <CardFooter className="pt-0 pb-6 px-6 flex flex-col gap-3">
            <Button
              className="w-full gap-2 h-12 rounded-xl"
              size="lg"
              onClick={() => router.push(`/poll/${pollId}/results`)}
            >
              <BarChart2 className="h-4 w-4" />
              View Results
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              Create Another Poll
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
      className="w-full"
    >
      <Card className="w-full overflow-hidden border-[0.5px] shadow-xl bg-card/95 backdrop-blur-xl">
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-xl sm:text-2xl text-center font-medium">{pollData.question}</CardTitle>
          <CardDescription className="text-center mt-2">Select one of the options below</CardDescription>
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
                    variant={selectedOption === option ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto py-5 px-5 text-base rounded-xl transition-all duration-300 relative overflow-hidden ${
                      selectedOption === option
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedOption(option)}
                  >
                    {selectedOption === option && (
                      <motion.div
                        className="absolute inset-0 bg-primary/10"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option
                          ? "border-primary-foreground"
                          : "border-muted-foreground/30"
                      }`}>
                        {selectedOption === option && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 bg-primary-foreground rounded-full"
                          />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
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
        <CardFooter className="pt-0 pb-6 px-6 flex flex-col gap-3">
          <Button
            className="w-full gap-2 h-12 rounded-xl"
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

          <div className="flex justify-between w-full gap-3">
            <Button
              variant="outline"
              className="gap-2 flex-1"
              size="sm"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button
              variant="outline"
              className="gap-2 flex-1"
              size="sm"
              onClick={copyPollLink}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}