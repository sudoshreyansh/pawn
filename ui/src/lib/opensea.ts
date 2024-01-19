import useSWR from 'swr';

const fetcher = (uri: string) => fetch(uri, {
  headers: {
    'x-api-key': process.env.NEXT_PUBLIC_OPENSEA_KEY!,
    'Accept': 'application/json'
  }
}).then(res => res.json())

export type Token = {
  name: string;
  description: string;
  identifier: string;
  contract: string;
  collection: string;
  opensea_url: string;
  image_url: string;
}

export const useTokenData = (address: string, id: string, chain: string) => {
  const { data, error, isLoading } = useSWR(`https://testnets-api.opensea.io/api/v2/chain/${chain}/contract/${address}/nfts/${id}`, fetcher)
 
  return {
    data: data as Token,
    isLoading,
    isError: error
  }
}

export const useAccountTokensData = (address: string, chain: string) => {
  const { data, error, isLoading } = useSWR(`https://testnets-api.opensea.io/api/v2/chain/${chain}/account/${address}/nfts`, fetcher)
  console.log(data);
 
  return {
    data: data?.nfts as Token[],
    isLoading,
    isError: error
  }
}