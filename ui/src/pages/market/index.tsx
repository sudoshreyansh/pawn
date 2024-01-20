import LoanMarketCard from '@/components/LoanMarketCard'
import PageWrapper from '@/components/PageWrapper'
import { WAD, RAY } from '@/lib/display'

export default function Market() {
  return (
    <PageWrapper>
      <div className='px-12 mb-12 mt-4'>
        <div className='text-3xl font-bold'>
          Market
        </div>
        <div className="grid grid-cols-2 gap-6 py-8">
          {
            Array(9).fill(undefined).map(() => (
              <LoanMarketCard loan={{
                id: BigInt(1),
                token: {
                  name: 'BAYC NFT #890',
                  identifier: '',
                  contract: '',
                  opensea_url: '',
                  image_url: 'https://i.seadn.io/s/raw/files/98d791be4fc84c87a399be540f5dc748.jpg?auto=format&dpr=1&w=384'
                },
                principal: BigInt(1000) * WAD,
                rate: BigInt(5) * RAY,
                expiry: BigInt(2*60*60*1000)
              }} />
            ))
          }
        </div>
      </div>
    </PageWrapper>
  )
}
