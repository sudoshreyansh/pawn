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
import { ERC721TokenABI, PawnPoolABI } from '@/lib/abi'
import { RAY, WAD } from "@/lib/display"
import { sleep } from "@/lib/utils"

export default function NewLoanForm() {
  const form = useForm();
  const {toast} = useToast();
  const {data: walletClient} = useWalletClient();
  const publicClient = usePublicClient();

  async function handleApproveToken(v: any) {
    if ( !walletClient ) return;
    
    const hash = await walletClient.writeContract({
      address: MOCK_NFT,
      abi: ERC721TokenABI,
      functionName: 'approve',
      args: [PAWN_POOL_ADDRESS, BigInt(v.collateral)]
    })

    const {dismiss} = toast({
      description: <div className="font-[Inter]">Please wait. Processing transaction.</div>
    });

    await publicClient.waitForTransactionReceipt({ hash });
    
    await sleep();
    
    dismiss();
    toast({
      description: <div className="font-[Inter]">Transaction processed. Please initiate the loan.</div>
    });
  }

  async function handleSubmit(v: any) {
    if ( !walletClient ) return;
    
    const hash = await walletClient!.writeContract({
      address: PAWN_POOL_ADDRESS,
      abi: PawnPoolABI,
      functionName: 'requestLoan',
      args: [
        MOCK_NFT,
        BigInt(v.collateral),
        BigInt(parseInt(v.amount)) * WAD,
        BigInt(parseInt((parseFloat(v.premium) * 10).toString())) * RAY / BigInt(10),
        BigInt(24*60*60*v.duration)
      ]
    })

    const {dismiss} = toast({
      description: <div className="font-[Inter]">Please wait. Processing transaction.</div>
    });

    await sleep();

    await publicClient.waitForTransactionReceipt({ hash });
    
    dismiss();
    toast({
      description: <div className="font-[Inter]">Transaction processed. Your loan has been requested.</div>
    });

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="collateral"
          render={({ field }) => (
            <FormItem className='py-2'>
              <FormLabel>Collateral Token</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a NFT for collateral" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="font-[Inter]" value="29000003">Close and Apart - PawnERC721</SelectItem>
                  <SelectItem className="font-[Inter]" value="29000004">Downtown Hive - PawnERC721</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className='py-2'>
                <FormLabel>Amount</FormLabel>
                <Input type="number" onChange={field.onChange} defaultValue={field.value} />
                <FormDescription>
                  The amount to borrow in GHO.
                </FormDescription>
                <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="premium"
          render={({ field }) => (
            <FormItem className='py-2'>
                <FormLabel>Max Premium Rate</FormLabel>
                <Input type="string" onChange={field.onChange} defaultValue={field.value} />
                <FormDescription>
                  Max Premium Rate over the Base GHO Interest Rate to pay.
                </FormDescription>
                <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem className='py-2'>
                <FormLabel>Duration</FormLabel>
                <Input type="number" onChange={field.onChange} defaultValue={field.value} />
                <FormDescription>
                  Duration of the loan in days.
                </FormDescription>
                <FormMessage />
            </FormItem>
          )}
        />
        
        <Button variant="outline" onClick={() => handleApproveToken(form.getValues())} className='mt-4'>Approve</Button> 
        <Button onClick={() => handleSubmit(form.getValues())} className='mt-4'>Submit</Button> 
      </form>
    </Form>
  )
}