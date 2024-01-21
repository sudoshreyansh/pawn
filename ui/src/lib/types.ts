export type Token = {
  name: string;
  id: bigint;
  contract: `0x${string}`;
  opensea_url: string;
  image_url: string;
}

export type Loan = {
  id: bigint;
  status: number;
  collateral: Token;
  principal: bigint;
  maxPremium: bigint;
  expiry: bigint;
  requestTimestamp: bigint;
}

export type Bid = {
  id: bigint;
  amount: bigint;
  premium: bigint;
}