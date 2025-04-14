import * as React from 'react'
import { PollCreationForm } from '@/components/poll-creation-form'

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-foreground relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 -right-24 w-72 h-72 bg-[#9F7AEA]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-64 h-64 bg-[#4FD1C5]/10 rounded-full blur-3xl" />

      <div className="max-w-2xl w-full flex flex-col items-center relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary via-[#9F7AEA] to-[#4FD1C5] p-[2px] shadow-xl mx-auto mb-4">
              <div className="h-full w-full bg-background rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#7e22ce]">
            FastPoll
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
            Create beautiful polls in seconds. Modern. Simple. Fast.
          </p>
        </div>
        <PollCreationForm />
      </div>
    </main>
  )
}