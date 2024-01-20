export type Token = {
  name: string;
  identifier: string;
  contract: string;
  opensea_url: string;
  image_url: string;
}

export type Loan = {
  id: BigInt;
  token: Token;
  principal: BigInt;
  rate: BigInt;
  expiry: BigInt;
}