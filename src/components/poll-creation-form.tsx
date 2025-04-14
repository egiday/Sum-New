'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
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
    <Card className="w-full max-w-2xl shadow-lg border-neutral-200/70 dark:border-neutral-800/70">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl sm:text-2xl text-center font-semibold text-gray-800 dark:text-gray-200">Create a New Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" id="poll-creation-form">
          <div className="space-y-2">
            <label htmlFor="question" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Question
            </label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Where should we go for lunch?"
              className="text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
              required
              aria-describedby="question-error"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Options
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="text-base dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600"
                    required={index < 2}
                    aria-label={`Poll option ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="shrink-0 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
                      aria-label={`Remove option ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="w-full gap-2 text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </Button>
          </div>

          {error && (
            <div id="question-error" role="alert" className="text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-sm font-medium border border-red-200 dark:border-red-800/50">
              {error}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="poll-creation-form"
          className="w-full text-base font-semibold py-3 px-6 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-neutral-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Poll & Get Link'}
        </Button>
      </CardFooter>
    </Card>
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