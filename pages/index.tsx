import { useState, useEffect, useCallback } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styled from 'styled-components';
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
import NFTSelect from '../components/NFTSelect/NFTSelect';
import TriggerContainer from '../components/TriggerContainer/TriggerContainer';
import { NFTObject } from '../utils/globalTypes';
import styles from '../styles/Home.module.css';
import '@rainbow-me/rainbowkit/styles.css';

const StyledButtonContainer = styled.div`
  margin-top: 20px;
`;

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon],
  [
    apiProvider.alchemy(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY),
    apiProvider.fallback(),
  ]
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

const MainApp: React.FC = () => {
  const [selectedNft, setSelectedNft] = useState<NFTObject>(undefined);
  const [accountData, setAccountData] = useState<any>(undefined);
  const [accountLoading, setAccountLoading] = useState<boolean>(true);
  const [accountError, setAccountError] = useState<boolean>(false);

  const handleSelectNft = (nft: NFTObject) => {
    setSelectedNft(nft);
  };

  const { data, isError, isLoading } = useAccount();

  useEffect(() => {
    setAccountData(data);
    setAccountLoading(isLoading);
    setAccountError(isError);
  }, [data, isError, isLoading]);

  return (
    <main className={styles.main}>
      <TriggerContainer selectedNft={selectedNft} accountData={accountData} />
      <NFTSelect
        handleSelectNft={handleSelectNft}
        accountData={accountData}
        accountLoading={accountLoading}
        accountError={accountError}
      />
      <StyledButtonContainer>
        <ConnectButton showBalance={false} />
      </StyledButtonContainer>
    </main>
  );
};

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Triggerify NFT</title>
        <meta name="description" content="Triggerify NFT" />
        <link rel="icon" href="/favicon.ico" />
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </Head>
      <AppHeader />
      <WagmiProvider client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <MainApp />
        </RainbowKitProvider>
      </WagmiProvider>
      <AppFooter />
    </div>
  );
};

export default Home;
