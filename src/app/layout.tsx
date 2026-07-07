import { AuthModalProvider } from '@/components/auth/AuthModalProvider'
import { CookieConsentBanner } from '@/components/cookies/CookieConsentBanner'
import { DevLoginToolbar } from '@/components/dev/DevLoginToolbar'
import { EditModeProvider } from '@/context/EditModeContext'
import type { Metadata } from 'next'
import { Geist_Mono, Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Opera Prima',
  description: 'Plataforma para artistas emergentes. Mentorías, eventos y oportunidades.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased${process.env.NEXT_PUBLIC_LINES === 'off' ? 'lines-off' : ''}`}
    >
      <body className="flex min-h-full flex-col">
        <AuthModalProvider>
          <EditModeProvider>
            {children}
            <CookieConsentBanner />
            <DevLoginToolbar />
          </EditModeProvider>
        </AuthModalProvider>
      </body>
    </html>
  )
}
