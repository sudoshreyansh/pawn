import { useLoansDataForMarket } from "@/lib/loans";
import { UpdateIcon } from "@radix-ui/react-icons";
import LoanMarketCard from "../LoanMarketCard";
import { Skeleton } from "../ui/skeleton";

export default function LoansDisplayForMarket() {
  const { success, loans } = useLoansDataForMarket();

  if ( !success ) {
    return (
      <div className="py-8">
        <Skeleton className="w-60 h-4 mb-2" />
        <Skeleton className="w-48 h-4 mb-2" />
        <Skeleton className="w-96 h-4 mb-2" />
      </div>
    )
  }

  if ( loans?.length == 0 ) {
    return (
      <div className='text-sm py-8'>
        Nothing on the market yet.
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-6 py-8">
        {
          loans?.map(loan => (
            <LoanMarketCard loan={loan} />
          ))
        }
      </div>
    </>
  )
}