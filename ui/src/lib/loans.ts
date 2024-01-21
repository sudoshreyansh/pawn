import { PublicClient, usePublicClient, useWalletClient } from "wagmi";
import type { Bid, Loan } from "./types";
import { useEffect, useState } from "react";
import { PAWN_RECEIPT_ADDRESS } from "./address";
import { ReceiptTokenABI } from "./abi";
import { getTokenData } from "./opensea";

async function getLoanDetailsForUser ( publicClient: PublicClient, user: `0x${string}`, index: BigInt ) {
  const loan = await publicClient.readContract({
    address: PAWN_RECEIPT_ADDRESS,
    abi: ReceiptTokenABI,
    functionName: 'getDetailsForUser',
    args: [user, index.valueOf()]
  })

  const underlying = await getTokenData(loan.collateral.tokenAddress, loan.collateral.tokenId.toString(), 'sepolia');

  return {
    ...loan,
    collateral: underlying
  } as Loan;
}

async function getLoanDetailsForMarket ( publicClient: PublicClient, index: BigInt ) {
  const loan = await publicClient.readContract({
    address: PAWN_RECEIPT_ADDRESS,
    abi: ReceiptTokenABI,
    functionName: 'getDetailsForMarket',
    args: [index.valueOf()]
  })

  const underlying = await getTokenData(loan.collateral.tokenAddress, loan.collateral.tokenId.toString(), 'sepolia');

  return {
    ...loan,
    collateral: underlying
  } as Loan;
}

async function getLoanDetailsExtended ( publicClient: PublicClient, loanId: BigInt, user: `0x${string}` ) {
  const loan = await publicClient.readContract({
    address: PAWN_RECEIPT_ADDRESS,
    abi: ReceiptTokenABI,
    functionName: 'getDetails',
    args: [loanId.valueOf()]
  });
  
  const underlying = await getTokenData(loan.collateral.tokenAddress, loan.collateral.tokenId.toString(), 'sepolia');

  const bid = await publicClient.readContract({
    address: PAWN_RECEIPT_ADDRESS,
    abi: ReceiptTokenABI,
    functionName: 'getBidDetailsForUser',
    args: [user, loanId.valueOf()]
  });

  return {
    loan: {
      ...loan,
      collateral: underlying 
    } as Loan,
    bid: bid as Bid
  }
}

type LoansState = {
  success: boolean;
  loans?: Loan[];
  loan?: Loan;
  bid?: Bid;
}

export function useLoansDataForUser() {
  const { data: wallet, status } = useWalletClient();
  const client = usePublicClient();
  const [data, setData] = useState<LoansState>({ success: false });

  useEffect(() => {
    if ( status != 'success' ) return;
    if ( !wallet ) return;

    async function fetch() {
      let balance = await client.readContract({
        address: PAWN_RECEIPT_ADDRESS,
        abi: ReceiptTokenABI,
        functionName: 'balanceOf',
        args: [wallet?.account.address!]
      });

      const promises: any[] = [];
      while ( balance > 0 ) {
        balance--;

        promises.push(getLoanDetailsForUser(client, wallet?.account.address!, balance));
      }

      const loans = await Promise.all(promises);
      setData({
        success: true,
        loans
      });
    }

    fetch();
  }, [status]);

  return data;
}

export function useLoansDataForMarket() {
  const { data: wallet, status } = useWalletClient();
  const client = usePublicClient();
  const [data, setData] = useState<LoansState>({ success: false });

  useEffect(() => {
    if ( status != 'success' ) return;
    if ( !wallet ) return;

    async function fetch() {
      let balance = await client.readContract({
        address: PAWN_RECEIPT_ADDRESS,
        abi: ReceiptTokenABI,
        functionName: 'totalSupply'
      });

      const promises: any[] = [];
      while ( balance > 0 ) {
        balance--;

        promises.push(getLoanDetailsForMarket(client, balance));
      }

      const loans = (await Promise.all(promises)).filter((value: Loan) => (
        BigInt(Date.now() / 1000) - value.requestTimestamp > BigInt(24*60*60)
      ));

      setData({
        success: true,
        loans
      });
    }

    fetch();
  }, [status]);

  return data;
}

export function useLoanData({ loanId }: { loanId: string }) {
  const { data: wallet, status } = useWalletClient();
  const client = usePublicClient();
  const [data, setData] = useState<LoansState>({ success: false });

  useEffect(() => {
    if ( status != 'success' ) return;
    if ( !wallet ) return;

    async function fetch() {
      const {loan, bid} = await getLoanDetailsExtended(client, BigInt(loanId), wallet?.account.address!);

      setData({
        success: true,
        loan,
        bid
      });
    }

    fetch();
  }, [status]);

  return data;
}