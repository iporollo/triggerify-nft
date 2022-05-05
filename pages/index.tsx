import type { NextPage } from 'next';
import Head from 'next/head';
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, createClient, WagmiProvider } from 'wagmi';
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
            <ConnectButton />
            <ul>
              <li>pull nfts</li>
              <li>list the nfts</li>
              <li>set trigger level on nft</li>
              <li>mint new nft</li>
            </ul>
          </main>
        </RainbowKitProvider>
      </WagmiProvider>
      <AppFooter />
    </div>
  );
};

export default Home;
