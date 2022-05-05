import { useState, useEffect, useCallback } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, createClient, WagmiProvider, useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AppHeader from '../components/AppHeader/AppHeader';
import AppFooter from '../components/AppFooter/AppFooter';
import styles from '../styles/Home.module.css';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [apiProvider.alchemy(process.env.ALCHEMY_ID), apiProvider.fallback()]
);

const { connectors } = getDefaultWallets({
  appName: 'Triggerify NFT',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const NFTDisplay: React.FC = () => {
  const [accountLoading, setAccountLoading] = useState<boolean>(true);
  const [accountData, setAccountData] = useState<any>(undefined);
  const [accountError, setAccountError] = useState<boolean>(false);
  const [nftList, setNftList] = useState<any[]>([]);
  const [nftImageList, setNftImageList] = useState<string[]>([]);

  const { data, isError, isLoading } = useAccount();

  useEffect(() => {
    setAccountLoading(isLoading);
    setAccountError(isError);
    setAccountData(data);
  }, [data, isError, isLoading]);

  useEffect(() => {
    const fetchNFTs = async (ownerAddress: string) => {
      const baseURL = 'https://eth-mainnet.alchemyapi.io/v2/demo/getNFTs/';
      const fetchURL = `${baseURL}?owner=${ownerAddress}`;

      try {
        const response = await fetch(fetchURL);
        if (response.ok) {
          const responseJson = await response.json();
          const ownedNfts: any[] = responseJson.ownedNfts;
          const nftImages: string[] = [];
          ownedNfts.forEach((nft) => {
            if (nft.metadata.image_url) {
              nftImages.push(nft.metadata.image_url);
            } else if (nft.media.length > 0) {
              nftImages.push(nft.media[0].gateway);
            }
          });
          setNftList(ownedNfts);
          setNftImageList(nftImages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (data?.address) fetchNFTs(data.address);
  }, [data]);

  if (accountLoading) {
    return <div>Loading...</div>;
  } else if (accountError) {
    return <div>Error</div>;
  } else {
    return (
      <div>
        {nftImageList.map((imgSrc, idx) => (
          <img key={idx} src={imgSrc} alt={imgSrc} />
        ))}
      </div>
    );
  }
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Triggerify NFT</title>
        <meta name="description" content="Triggerify NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppHeader />
      <WagmiProvider client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <main className={styles.main}>
            <ul>
              <li>set trigger level on nft</li>
              <li>mint new nft</li>
            </ul>
            <NFTDisplay />
            <ConnectButton showBalance={false} />
          </main>
        </RainbowKitProvider>
      </WagmiProvider>
      <AppFooter />
    </div>
  );
};

export default Home;
