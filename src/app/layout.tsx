import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/lib/auth-context'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'FastPoll | Fast, Simple, Beautiful Polling',
  description: 'Create beautiful polls in seconds with this Apple-inspired polling app. No sign-ups required.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90 flex flex-col">
              <Navbar />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <footer className="py-4 text-center text-sm text-muted-foreground">
                <div className="container mx-auto px-4">
                  &copy; {new Date().getFullYear()} FastPoll. Simple. Fast. Beautiful.
                </div>
              </footer>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}