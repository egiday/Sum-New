import * as React from 'react'
import { PollCreationForm } from '@/components/poll-creation-form'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4 sm:mb-6">
              FastPoll
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto">
              Create anonymous polls in seconds. No sign-ups required. Share the link instantly.
            </p>
          </div>
          <PollCreationForm />
        </div>
      </div>
    </main>
  )
}