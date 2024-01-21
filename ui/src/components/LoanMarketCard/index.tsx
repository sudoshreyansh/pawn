import { Loan } from "@/lib/types"
import { formatWadToDecimal, formatRayToDecimal, formatTimestampToString } from "@/lib/display"
import { Button } from '@/components/ui/button'

export default function LoanMarketCard({ loan }: {
  loan: Loan
}) {
  return (
    <div className="flex border border-solid border-slate-200 cursor-pointer overflow-hidden rounded-md">
      <div className='w-48 h-48 bg-contain' style={{ backgroundImage: `url("${loan.collateral.image_url}")` }}></div>
      <div className="grow-1 py-4 px-8 flex flex-col justify-between items-start">
        <div className="text-sm">
          <div className="text-xl font-bold pb-2">{loan.collateral.name}</div>
          <div className="">
            <span className="font-semibold">Required Funds: </span>
            <span className="">{formatWadToDecimal(loan.principal)} GHO</span>
          </div>
          <div className="">
            <span className="font-semibold">Max Premium: </span>
            <span className="">{formatRayToDecimal(loan.maxPremium)}%</span>
          </div>
          <div className="">
            <span className="font-semibold">Bidding Ends in: </span>
            <span className="">{formatTimestampToString(loan.expiry)}</span>
          </div>
        </div>
        <Button variant="outline">View Details</Button>
      </div>
    </div>
  )
}