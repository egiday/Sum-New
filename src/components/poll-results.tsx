'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Loader2, Users, BarChart2, Trophy } from 'lucide-react'

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

  if (isLoading) {
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
              <span>Loading results...</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (!results) return null

  const maxVotes = Math.max(...Object.values(results.voteCounts))
  const winningOptions = results.options.filter(
    option => results.voteCounts[option] === maxVotes
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card glass className="w-full overflow-hidden border-[0.5px] shadow-xl">
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-xl sm:text-2xl text-center font-medium">{results.question}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8 bg-foreground/5 p-3 rounded-xl border border-border/50">
            <Users className="h-4 w-4" />
            <span>{results.totalVotes} total vote{results.totalVotes !== 1 ? 's' : ''}</span>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {results.options.map((option, index) => {
                const voteCount = results.voteCounts[option] || 0
                const percentage = results.totalVotes > 0
                  ? Math.round((voteCount / results.totalVotes) * 100)
                  : 0
                const isWinner = winningOptions.includes(option)
                const barColor = index % 5;
                const barColors = [
                  'from-blue-500 to-blue-600',
                  'from-purple-500 to-purple-600',
                  'from-teal-500 to-teal-600',
                  'from-amber-500 to-amber-600',
                  'from-red-500 to-red-600'
                ];

                return (
                  <motion.div
                    key={index}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{option}</span>
                        {isWinner && (
                          <motion.span
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium flex items-center gap-1"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 + (index * 0.1) }}
                          >
                            <Trophy className="h-3 w-3" />
                            Winner
                          </motion.span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <BarChart2 className="h-3.5 w-3.5" />
                        <span>
                          {voteCount} ({percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-10 bg-muted/30 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50 relative">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${barColors[barColor]} backdrop-blur-sm rounded-xl`}
                        style={{ width: `${percentage}%` }}
                        aria-label={`${option}: ${voteCount} votes, ${percentage}%`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-medium ${percentage > 35 ? 'text-white' : 'text-foreground'}`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </CardContent>

        {winningOptions.length > 0 && (
          <CardFooter className="pt-4 pb-6 px-6 border-t">
            <div className="text-sm text-center w-full p-4 bg-primary/10 rounded-xl border border-primary/20">
              {winningOptions.length === 1 ? (
                <>
                  <span className="font-semibold text-foreground">{winningOptions[0]}</span> is leading with {maxVotes} vote{maxVotes !== 1 ? 's' : ''}.
                </>
              ) : (
                <>
                  It's a tie between <span className="font-semibold text-foreground">{winningOptions.length} options</span> with {maxVotes} votes each.
                </>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}