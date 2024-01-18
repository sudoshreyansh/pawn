import { ReactNode } from "react"
import { Button } from "../ui/button"
import Link from "next/link"

export default function HomeCard({
  title,
  children,
  button,
  link
}: {
  title: string,
  children: ReactNode,
  button: string,
  link: string
}) {
  return (
    <div className='bg-white p-6 px-8 rounded-xl border border-solid border-slate-200'>
      <div className='text-xl font-bold'>
        { title }
      </div>
      <div className='mt-6'>
        { children }
      </div>
      <div className="flex justify-center">
        <Button variant="outline" className="mt-12" asChild>
          <Link href={link}>{ button }</Link>
        </Button>
      </div>
    </div>
  )
}