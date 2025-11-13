'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Loader2, Sparkles, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function PollCreationForm() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)

    // Automatically add a new option if user is typing in the last option
    if (index === options.length - 1 && value.trim() && options.length < 10) {
      setOptions([...newOptions, ''])
    }
  }

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ''])
    }
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

    // Filter out empty options before validating
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
      <TooltipProvider>
        <Card className="w-full overflow-hidden border-[0.5px] shadow-xl bg-card/95 backdrop-blur-xl">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-xl sm:text-2xl text-center font-medium flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Create a New Poll
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              It&apos;s quick, easy, and free - no account needed
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 pb-6 px-6">
            <form onSubmit={handleSubmit} className="space-y-6" id="poll-creation-form">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="question" className="text-sm font-medium text-foreground/80 flex items-center gap-1">
                    Question
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        Enter the main question for your poll. Make it clear and specific.
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <span className="text-xs text-muted-foreground">{question.length} / 200</span>
                </div>

                <div className="relative">
                  <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value.slice(0, 200))}
                    placeholder="e.g., Where should we go for lunch?"
                    className={`text-base rounded-xl border-input/50 bg-card/50 backdrop-blur-sm transition-all ${
                      focusedField === 'question' ? 'ring-2 ring-primary/40 border-transparent' : ''
                    }`}
                    required
                    maxLength={200}
                    aria-describedby="question-error"
                    onFocus={() => setFocusedField('question')}
                    onBlur={() => setFocusedField(null)}
                  />

                  <AnimatePresence>
                    {focusedField === 'question' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-3 top-2.5 text-xs text-muted-foreground bg-background/70 px-1.5 py-0.5 rounded-full"
                      >
                        Press Enter to continue
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <Label className="block text-sm font-medium text-foreground/80 flex items-center gap-1">
                    Options
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        Add at least 2 and up to 10 options for your poll. You can remove options by clicking the trash icon.
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <span className="text-xs text-muted-foreground">{options.filter(o => o.trim()).length}/10 options</span>
                </div>

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
                        <div className="w-8 h-8 flex items-center justify-center bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </div>
                        <div className="flex-grow relative">
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value.slice(0, 100))}
                            placeholder={`Option ${index + 1}`}
                            className={`text-base flex-grow rounded-xl border-input/50 bg-card/50 backdrop-blur-sm transition-all ${
                              focusedField === `option-${index}` ? 'ring-2 ring-primary/40 border-transparent' : ''
                            }`}
                            required={index < 2}
                            maxLength={100}
                            aria-label={`Poll option ${index + 1}`}
                            onFocus={() => setFocusedField(`option-${index}`)}
                            onBlur={() => setFocusedField(null)}
                          />
                        </div>
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
                  disabled={options.length >= 10}
                >
                  <Plus className="h-4 w-4" />
                  Add Option {options.length >= 10 && "(max 10)"}
                </Button>
              </motion.div>

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
              className="w-full text-base font-medium py-3 h-12 rounded-xl"
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
      </TooltipProvider>
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