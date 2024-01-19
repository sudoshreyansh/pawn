import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider as Provider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";
import { sepolia } from "wagmi";

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
    appName: "Pawn",
    chains: [sepolia]
  })
);

export default function ConnectKitProvider({ children }: {
  children: ReactNode
}) {
  return (
    <WagmiConfig config={config}>
      <Provider theme="soft">
        { children }
      </Provider>
    </WagmiConfig>
  )
}