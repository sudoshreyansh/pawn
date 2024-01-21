import { formatRayToDecimal, formatTimestampToString, formatWadToDecimal } from "@/lib/display";
import { useLoansDataForUser } from "@/lib/loans";
import { UpdateIcon } from "@radix-ui/react-icons";

export default function LoansDisplayForSupply() {
  const { success, loans } = useLoansDataForUser();

  if ( !success ) {
    return (
      <div className="pt-10 pb-4 flex items-center justify-center">
        <UpdateIcon className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  // if ( loans?.length == 0 ) {
    return (
      <div className='text-sm py-2'>
        Nothing supplied yet.
      </div>
    )
  // }

  return (
    <>
      {
        loans?.map(loan => (
          <div className='text-sm grid grid-cols-5 gap-1 w-full font-medium cursor-pointer hover:bg-slate-100 py-2 border-solid border-b last:border-b-0'>
            <div className='col-span-2 flex gap-3'>
              <div className='w-5 h-5 bg-contain' style={{ backgroundImage: `url("${loan.collateral.image_url}")` }}></div>
              <div>{loan.collateral.name}</div>
            </div>
            <div className='text-center'>{formatWadToDecimal(loan.principal, 2)} GHO</div>
            <div className='text-center'>{formatRayToDecimal(loan.maxPremium, 1)}%</div>
            <div className='text-center'>{formatTimestampToString(loan.expiry)}</div>
          </div>
        ))
      }
    </>
  )
}