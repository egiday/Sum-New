import * as React from 'react'
import { PollCreationForm } from '@/components/poll-creation-form'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Enhanced background decorative elements with animations */}
      <motion.div 
        className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-60"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-1/4 -right-24 w-72 h-72 bg-[#9F7AEA]/10 rounded-full blur-3xl opacity-70"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 0.9, 0.7],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -bottom-32 left-1/3 w-64 h-64 bg-[#4FD1C5]/10 rounded-full blur-3xl opacity-60"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.8, 0.6],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <section className="py-12 md:py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div 
              className="flex justify-center mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary via-[#9F7AEA] to-[#4FD1C5] p-[2px] shadow-xl pulse-glow">
                <div className="h-full w-full bg-background rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </div>
              </div>
            </motion.div>
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#9F7AEA] to-[#7e22ce] animate-gradient-x">
                FastPoll
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Create beautiful polls in seconds. <span className="font-semibold text-foreground">Modern. Simple. Fast.</span>
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-10 items-center">
            <motion.div
              className="md:col-span-3 space-y-6 text-center md:text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <h2 className="text-2xl sm:text-3xl font-semibold">Share Your Opinion, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#7e22ce]">Collect Results</span></h2>
              <p className="text-muted-foreground text-lg">
                Create polls in seconds with our intuitive and beautiful interface.
                No sign-up required - just create and share instantly.
              </p>

              <ul className="space-y-3 text-left max-w-lg mx-auto md:mx-0">
                {[
                  'No account needed, results are instant',
                  'Beautiful, responsive design that works on all devices',
                  'Real-time results with animated charts',
                  'Share with just a link - no emails or logins'
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.span 
                      className="mt-1 text-primary"
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: index * 0.2,
                        repeat: Infinity,
                        repeatDelay: 5,
                      }}
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.span>
                    <span className="group-hover:text-foreground transition-colors">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <PollCreationForm />
            </motion.div>
          </div>
        </div>
      </section>

      <motion.div
        className="bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 py-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-6">Ready to create your first poll?</h2>
          <motion.div
            className="inline-flex items-center text-primary font-medium gap-1 text-lg cursor-pointer"
            whileHover={{
              scale: 1.1,
              color: 'var(--primary)',
              textShadow: '0 0 8px rgba(59, 130, 246, 0.5)',
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => {
              // Scroll to the form
              const form = document.getElementById('poll-creation-form');
              form?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start now <ArrowRight className="h-4 w-4 ml-1" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}