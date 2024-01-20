import PageWrapper from '@/components/PageWrapper'
import HomeCard from '@/components/HomeCard'
import { Separator } from '@radix-ui/react-separator'

export default function Home() {
  return (
    <PageWrapper>
      <div className='px-12 mb-12 mt-4'>
        <div className='text-3xl font-bold'>
          PAWN
        </div>
        <div className='mt-2 font-medium text-sm'>
          NFT-Collaterized GHO Loans at Best Rates
        </div>
      </div>
      <div className="flex px-12 gap-16">
        <div className='grow basis-0'>
          <HomeCard title="Your Borrowed Loans" button="Request New Loan" link='/market/new'>
            {/* <div className='text-sm py-2'>
              Nothing borrowed yet.
            </div> */}
            <div className='text-sm grid grid-cols-5 gap-1 w-full font-medium cursor-pointer hover:bg-slate-100 py-2 border-solid border-b'>
              <div className='col-span-2 flex gap-3'>
                <div className='w-5 h-5 bg-contain' style={{ backgroundImage: 'url("https://i.seadn.io/s/raw/files/98d791be4fc84c87a399be540f5dc748.jpg?auto=format&dpr=1&w=384")' }}></div>
                <div>BAYC NFT #0x223</div>
              </div>
              <div className='text-center'>100.00 GHO</div>
              <div className='text-center'>5.0%</div>
              <div className='text-center'>30 days</div>
            </div>
            <div className='text-sm grid grid-cols-5 gap-1 w-full font-medium cursor-pointer hover:bg-slate-100 py-2 border-solid border-b last:border-b-0'>
              <div className='col-span-2 flex gap-3'>
                <div className='w-5 h-5 bg-contain' style={{ backgroundImage: 'url("https://i.seadn.io/s/raw/files/98d791be4fc84c87a399be540f5dc748.jpg?auto=format&dpr=1&w=384")' }}></div>
                <div>BAYC NFT #0x223</div>
              </div>
              <div className='text-center'>100.00 GHO</div>
              <div className='text-center'>5.0%</div>
              <div className='text-center'>30 days</div>
            </div>
          </HomeCard>
        </div>
        <div className='grow basis-0'>
          <HomeCard title="Your Supplied Loans" button="Supply Loan" link='/market'>
            <div className='text-sm py-2'>
              Nothing Supplied yet.
            </div>
          </HomeCard>
        </div>
      </div>
    </PageWrapper>
  )
}
