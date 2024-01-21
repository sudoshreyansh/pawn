import useSWR from 'swr';
import { Token } from './types';

const fetcher = (uri: string) => fetch(uri, {
  headers: {
    'x-api-key': process.env.NEXT_PUBLIC_OPENSEA_KEY!,
    'Accept': 'application/json'
  }
}).then(res => res.json())

const images: any = {
  '29000001': 'https://i.seadn.io/s/raw/files/9a100f78b07893567b6780117ee1967c.jpg?auto=format&dpr=1&w=1000',
  '29000002': 'https://i.seadn.io/s/raw/files/87663d34dc5d5fd3e49fe79ae952db29.jpg?auto=format&dpr=1&w=1000',
  '29000003': 'https://i.seadn.io/s/raw/files/1d07768b50b7d450883f7f2db704ee40.jpg?auto=format&dpr=1&w=1000',
  '29000004': 'https://i.seadn.io/s/raw/files/8f75fe8f51dda03044e6ba3d072c68ce.jpg?auto=format&dpr=1&w=1000',
}

export async function getTokenData(address: string, id: string, chain: string): Promise<Token> {
  const data = await fetcher(`https://testnets-api.opensea.io/api/v2/chain/${chain}/contract/${address}/nfts/${id}`);
  data.nft.image_url = (images[id] as string);
  return data.nft as Token;
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