import * as React from 'react'
import { PollCreationForm } from '@/components/poll-creation-form'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Quick Group Poll
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
              Create anonymous polls in seconds. No sign-ups required.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <PollCreationForm />
          </div>
        </div>
      </div>
    </main>
  )
}