import { Inter } from 'next/font/google'
import { ReactNode, useState } from 'react'
import TopBar from '../TopBar'
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'

const inter = Inter({
  subsets: ['latin'],
  variable: "--font-sans",
})

export default function PageWrapper({ children }: {
  children: ReactNode
}) {
  const [active, setActive] = useState<boolean>(false);

  return (
    <main className={`min-h-screen font-sans ${inter.variable}`}>
      <TopBar />
      {
        !active ?
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[225px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <div className="mt-4">
              Please connect your wallet to continue.
            </div>
            <Button onClick={() => setActive(true)}>
              Connect Wallet
            </Button>
          </div>
        </div> :
        <div className="px-8 max-w-screen-2xl mx-auto pt-6">
          { children }
        </div>
      }
    </main>
  )
}