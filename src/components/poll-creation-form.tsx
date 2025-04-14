'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

export function PollCreationForm() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!question.trim()) {
      setError('Question cannot be empty.')
      setIsSubmitting(false)
      return
    }
    const validOptions = options.filter(option => option.trim() !== '')
    if (validOptions.length < 2) {
      setError('Please provide at least two non-empty options.')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          options: validOptions,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create poll')
      }

      const data = await response.json()
      router.push(`/poll/${data.pollId}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create poll. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="w-full max-w-2xl shadow-xl border-neutral-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl text-center font-semibold text-gray-800">Create a New Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" id="poll-creation-form">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium text-gray-700">
                Question
              </Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Where should we go for lunch?"
                className="text-base"
                required
                aria-describedby="question-error"
              />
            </div>

            <div className="space-y-4">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </Label>
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {options.map((option, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex gap-3 items-center"
                    >
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="text-base flex-grow"
                        required={index < 2}
                        aria-label={`Poll option ${index + 1}`}
                      />
                      {options.length > 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index)}
                            className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={`Remove option ${index + 1}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full gap-2 text-muted-foreground border-dashed hover:border-solid hover:bg-accent hover:text-accent-foreground transition-all"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>

            {error && (
              <div id="question-error" role="alert" className="text-destructive-foreground bg-destructive p-3 rounded-md text-sm font-medium border border-destructive/50">
                {error}
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="poll-creation-form"
            className="w-full text-base font-semibold py-3"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Poll...' : 'Create Poll & Get Link'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function validateForm(question: string, options: string[]): string | null {
  if (!question.trim()) {
    return 'Question cannot be empty.';
  }
  const validOptions = options.filter(option => option.trim() !== '');
  if (validOptions.length < 2) {
    return 'Please provide at least two non-empty options.';
  }
  return null;
}