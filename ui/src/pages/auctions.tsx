import PageWrapper from '@/components/PageWrapper'

export default function Auctions() {
  return (
    <PageWrapper>
      <div className='px-12 mb-12 mt-4'>
        <div className='text-3xl font-bold'>
          Auctions
        </div>
        <div className='italic py-4'>Currently, no items are listed for auction.</div>
      </div>
    </PageWrapper>
  )
}