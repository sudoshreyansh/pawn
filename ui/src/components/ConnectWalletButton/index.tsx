import { ConnectKitButton } from "connectkit";
import { Button } from "../ui/button";

export const ConnectWalletButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        return (
          <Button onClick={show} {...(isConnecting && {disabled: true})}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};