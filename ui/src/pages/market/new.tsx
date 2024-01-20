import PageWrapper from '@/components/PageWrapper'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
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


export default function NewLoan() {
  const form = useForm()

  function handleSubmit(e: any) {
    e.preventDefault();

    // submit

    form.reset();
  }

  return (
    <PageWrapper>
      <div className='px-12 mb-12 mt-4 flex justify-center'>
        <div className='px-6 py-4  w-2/5 border border-solid border-slate-200 rounded-lg'>
          <div className='text-xl font-bold mb-2'>New Loan</div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                        <SelectItem className="font-[Inter]" value="m@google.com">m@google.com</SelectItem>
                        <SelectItem value="m@google.com">m@google.com</SelectItem>
                        <SelectItem value="m@support.com">m@support.com</SelectItem>
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
              
              <Button type="submit" className='mt-4'>Submit</Button> 
            </form>
          </Form>
        </div>
      </div>
    </PageWrapper>
  )
}