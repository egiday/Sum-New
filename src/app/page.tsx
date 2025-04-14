import * as React from 'react'
import { PollCreationForm } from '@/components/poll-creation-form'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-5">
              FastPoll
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-lg mx-auto">
              Create anonymous polls in seconds. Share the link.
            </p>
          </div>
          <PollCreationForm />
        </div>
      </div>
    </main>
  )
}