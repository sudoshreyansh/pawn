import { useLoansDataForUser } from "@/lib/loans";
import { Skeleton } from "../ui/skeleton";

export default function LoansDisplayForSupply() {
  const { success, loans } = useLoansDataForUser();

  if ( !success ) {
    return (
      <div className="py-2">
        <Skeleton className="w-60 h-4 mb-2" />
        <Skeleton className="w-96 h-4" />
      </div>
    )
  }

  return (
    <div className='text-sm py-2'>
      Nothing supplied yet.
    </div>
  )
}