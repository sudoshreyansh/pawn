'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { Avatar, ChainIcon, ConnectKitButton } from "connectkit";
import { sepolia } from "wagmi";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function TopBar() {
  return (
    <div className="py-2 px-8 flex items-center max-w-screen-2xl mx-auto bg-white">
      <div className="font-bold text-sm">
        PAWN
      </div>
      <div className="grow ml-12">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/market" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Market
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/auctions" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Auctions
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <ConnectKitButton.Custom>
        {({isConnected, truncatedAddress, address, ensName, show}) => {
          if ( !isConnected ) return <></>;

          return (
            <div className="flex">
              <Button variant="outline" onClick={show} className="flex text-sm items-center gap-2 ml-2">
                <ChainIcon id={sepolia.id} size={20} />
                <Separator orientation="vertical" className="mx-0.5" />
                <Avatar {...(ensName ? {name: ensName} : { address })} size={20} />
                <div>
                  { ensName ? ensName : truncatedAddress }
                </div>
              </Button>
            </div>
          )
        }}
      </ConnectKitButton.Custom>
    </div>
  )
}