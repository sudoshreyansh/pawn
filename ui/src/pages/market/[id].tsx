import LoansDisplayForLoan from '@/components/LoansDisplay/loan';
import PageWrapper from '@/components/PageWrapper'
import { useRouter } from 'next/router';

export default function Market() {
  const router = useRouter();

  return (
    <PageWrapper>
      <LoansDisplayForLoan loanId={router.query.id as string} />
    </PageWrapper>
  )
}
