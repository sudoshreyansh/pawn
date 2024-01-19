import { ConnectKitButton } from "connectkit";
import { Button } from "../ui/button";

export const ConnectWalletButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnecting, show }) => {
        return (
          <Button onClick={show} {...(isConnecting && {disabled: true})}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};