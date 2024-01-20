import Counter from '@/components/Counter'
import PageWrapper from '@/components/PageWrapper'
import SliderInput from '@/components/SliderInput';
import { Button } from '@/components/ui/button'

const endTime = Date.now() + 21*60*60*1000;

export default function Market() {
  return (
    <PageWrapper>
      <div className='px-12 mb-12 mt-4'>
        <div className='flex gap-6'>
          <div className='w-[45%] border border-solid border-slate-200 rounded-lg overflow-hidden'>
            <div className='pt-[100%] bg-contain bg-no-repeat bg-center bg-gray-100' style={{ backgroundImage: `url("https://i.seadn.io/s/raw/files/98d791be4fc84c87a399be540f5dc748.jpg?auto=format&dpr=1&w=384")` }}></div>
          </div>
          <div className='grow p-6'>
            <div className='font-bold text-gray-400 uppercase text-sm'>
              Bored Ape Yacht Club
            </div>
            <div className='text-4xl font-bold'>
              BAYC NFT #4455
            </div>
            <div className='pt-6 pb-4'>
              <div className='flex gap-6'>
                <span className='w-32 font-bold text-gray-900 '>Capital</span>
                <span>1000.00 GHO</span>
              </div>
              <div className='flex gap-6'>
                <span className='w-32 font-bold text-gray-900 '>Max Premium</span>
                <span>5.00%</span>
              </div>
              <div className='flex gap-6'>
                <span className='w-32 font-bold text-gray-900 '>Duration</span>
                <span>24 days</span>
              </div>
            </div>
            <Button variant="outline">View on Opensea</Button>

            <div className='mt-8 rounded-lg py-4 px-6 border border-solid border-slate-200'>
              <div className='text-xl font-semibold pb-4'>
                Bidding ends in: <Counter endTime={endTime} />
              </div>
              <div className='pt-4'>
                <SliderInput
                  defaultValue={5000}
                  max={100000}
                  min={5000}
                  step={100}
                  title={"Amount"}
                  formatValue={v => `${(v/100).toFixed(2)} GHO`}
                   />
              </div>
              <div className='pt-4'>
                <SliderInput
                  defaultValue={500}
                  max={500}
                  min={0}
                  step={1}
                  title={"Rate"}
                  formatValue={v => `${(v/10).toFixed(2)}%`}
                   />
              </div>
              <Button className='mt-6'>Place Bid</Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
