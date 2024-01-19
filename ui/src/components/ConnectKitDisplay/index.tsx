'use client';

import { ReactNode, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'
import { ConnectWalletButton } from "../ConnectWalletButton";

export default function ConnectKitDisplay({ children }: {
  children: ReactNode
}) {
  const { isConnected } = useAccount();

  return (
    <>
      {
        !isConnected ?
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-y-4 text-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[225px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <div className="mt-4">
              Please connect your wallet to continue.
            </div>
            <ConnectWalletButton />
          </div>
        </div> :
        <>
          { children }
        </>
      }

    </>
  )
}