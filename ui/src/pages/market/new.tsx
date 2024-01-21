import PageWrapper from '@/components/PageWrapper'
import { useForm } from "react-hook-form"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { useToast } from "@/components/ui/use-toast";
import { usePublicClient, useWalletClient } from 'wagmi'
import { MOCK_NFT, PAWN_POOL_ADDRESS } from '@/lib/address'
import { ERC721TokenABI } from '@/lib/abi'
import NewLoanForm from '@/components/NewLoanForm'


export default function NewLoan() {
  return (
    <PageWrapper>
      <div className='px-12 mb-12 mt-4 flex justify-center'>
        <div className='px-6 py-4  w-2/5 border border-solid border-slate-200 rounded-lg'>
          <div className='text-xl font-bold mb-2'>New Loan</div>
          <NewLoanForm />
        </div>
      </div>
    </PageWrapper>
  )
}