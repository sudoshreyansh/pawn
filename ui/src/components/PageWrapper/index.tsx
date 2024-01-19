import { Inter } from 'next/font/google'
import { ReactNode, useState } from 'react'
import TopBar from '../TopBar'
import ConnectKitProvider from '@/components/ConnectKitProvider'
import ConnectKitDisplay from '../ConnectKitDisplay'

const inter = Inter({
  subsets: ['latin'],
  variable: "--font-sans",
})

export default function PageWrapper({ children }: {
  children: ReactNode
}) {
  return (
    <ConnectKitProvider>
        <main className={`min-h-screen font-sans ${inter.variable}`}>
          <TopBar />
          <ConnectKitDisplay>
            <div className="px-8 max-w-screen-2xl mx-auto pt-6">
              { children }
            </div>
          </ConnectKitDisplay>
        </main>
    </ConnectKitProvider>
  )
}