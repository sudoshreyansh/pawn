import { useLoanData } from "@/lib/loans";
import { Button } from "../ui/button";
import SliderInput from "../SliderInput";
import Counter from "../Counter";
import { RAY, WAD, formatRayToDecimal, formatStringToDecimal, formatTimestampToString, formatWadToDecimal } from "@/lib/display";
import Link from "next/link";

export default function LoansDisplayForLoan({ loanId }: {loanId: string}) {
  const { loan, bid, success } = useLoanData(loanId)

  if ( !success ) return <></>;

  return (
    <div className='px-12 mb-12 mt-4'>
        <div className='flex gap-6'>
          <div className='w-[45%] border border-solid border-slate-200 rounded-lg overflow-hidden'>
            <div className='pt-[100%] bg-contain bg-no-repeat bg-center bg-gray-100' style={{ backgroundImage: `url("${loan?.collateral.image_url}")` }}></div>
          </div>
          <div className='grow p-6'>
            <div className='text-4xl font-bold'>
              { loan?.collateral.name }
            </div>
            <div className='pt-6 pb-4'>
              <div className='flex gap-6'>
                <span className='w-32 font-bold text-gray-900 '>Capital</span>
                <span>{formatWadToDecimal(loan?.principal!, 2)} GHO</span>
              </div>
              <div className='flex gap-6'>
                <span className='w-32 font-bold text-gray-900 '>Max Premium</span>
                <span>{formatRayToDecimal(loan?.maxPremium!, 2)}%</span>
              </div>
              <div className='flex gap-6'>
                <span className='w-32 font-bold text-gray-900 '>Duration</span>
                <span>{formatTimestampToString(loan?.expiry!)}</span>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href={loan?.collateral.opensea_url!}>View on Opensea</Link>
            </Button>

            <div className='mt-8 rounded-lg py-4 px-6 border border-solid border-slate-200'>
              <div className='text-xl font-semibold pb-4'>
                Bidding ends in: <Counter endTime={parseInt((loan?.requestTimestamp! + loan?.expiry!).toString())} />
              </div>
              {
                !(bid && bid.id > 0) ?
              (
                <>
                <div className='pt-4'>
                  <SliderInput
                    defaultValue={parseInt(((loan?.principal! * BigInt(100)) / WAD).toString())}
                    max={parseInt(((loan?.principal! * BigInt(100)) / WAD).toString())}
                    min={parseInt(((loan?.principal! * BigInt(20)) / WAD).toString())}
                    step={100}
                    title={"Amount"}
                    formatValue={v => `${(v/100).toFixed(2)} GHO`}
                    />
                </div>
                <div className='pt-4'>
                  <SliderInput
                    defaultValue={parseInt(((loan?.maxPremium! * BigInt(10)) / RAY).toString())}
                    max={parseInt(((loan?.maxPremium! * BigInt(10)) / RAY).toString())}
                    min={0}
                    step={1}
                    title={"Rate"}
                    formatValue={v => `${(v/10).toFixed(2)}%`}
                    />
                </div>
                <Button className='mt-6'>Place Bid</Button>
                </>
              ) :
                (
                  <>
                  <div className='flex justify-between w-full'>
                    <span className='font-semibold text-gray-900 '>Amount</span>
                    <span className='text-right'>{formatWadToDecimal(bid.amount, 2)} GHO</span>
                  </div>
                  <div className='flex justify-between w-full'>
                    <span className='font-semibold text-gray-900 '>Premium %</span>
                    <span className='text-right'>{formatRayToDecimal(bid.premium, 1)}%</span>
                  </div>
                  <div className='flex justify-between w-full'>
                    <span className='font-semibold text-gray-900 '>Profit <span className='font-light'>(after full duration)</span></span>
                    <span className='text-right'>{formatWadToDecimal((bid.amount * bid.premium) / (RAY * BigInt(100)))} GHO</span>
                  </div>
                  <div className='flex justify-between w-full'>
                    <span className='font-semibold text-gray-900 '>Collateral Share</span>
                    <span className='text-right'>{formatStringToDecimal(((bid.amount * BigInt(10000)) / loan?.principal!).toString())}%</span>
                  </div>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
  )
}