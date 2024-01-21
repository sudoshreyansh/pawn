import PageWrapper from '@/components/PageWrapper'
import HomeCard from '@/components/HomeCard'
import LoansDisplayForBorrow from '@/components/LoansDisplay/borrow'
import LoansDisplayForSupply from '@/components/LoansDisplay/supply'

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
            <LoansDisplayForBorrow />
          </HomeCard>
        </div>
        <div className='grow basis-0'>
          <HomeCard title="Your Supplied Loans" button="Supply Loan" link='/market'>
            <LoansDisplayForSupply />
          </HomeCard>
        </div>
      </div>
    </PageWrapper>
  )
}
