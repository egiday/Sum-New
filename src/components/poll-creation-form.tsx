'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Loader2, Sparkles } from 'lucide-react'

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <Card glass className="w-full overflow-hidden border-[0.5px] shadow-xl">
        <CardHeader className="pb-4 pt-6 px-6">
          <CardTitle className="text-xl sm:text-2xl text-center font-medium">Create a New Poll</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-6">
          <form onSubmit={handleSubmit} className="space-y-6" id="poll-creation-form">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium text-foreground/80">
                Question
              </Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Where should we go for lunch?"
                className="text-base rounded-xl border-input/50 bg-card/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/40 transition-all"
                required
                aria-describedby="question-error"
              />
            </div>

            <div className="space-y-4">
              <Label className="block text-sm font-medium text-foreground/80 mb-2">
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
                      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="flex gap-3 items-center"
                    >
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="text-base flex-grow rounded-xl border-input/50 bg-card/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/40 transition-all"
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
                            className="shrink-0 text-muted-foreground hover:text-destructive/80 transition-colors h-10 w-10 rounded-xl"
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
                className="w-full gap-2 border-dashed rounded-xl h-11"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                id="question-error"
                role="alert"
                className="text-destructive-foreground bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </form>
        </CardContent>
        <CardFooter className="pt-0 pb-6 px-6 flex flex-col">
          <Button
            type="submit"
            form="poll-creation-form"
            className="w-full text-base font-medium py-3 h-12"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Poll...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Poll & Get Link
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground/60 mt-4">
            No account needed. Your poll will be available instantly.
          </p>
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