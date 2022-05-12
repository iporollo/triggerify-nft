import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NFTObject } from '../../utils/globalTypes';

const NFTList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 24px 0px;
`;

const NFTSelectButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  margin: 0px 12px;
`;

interface NFTSelectProps {
  handleSelectNft: (nft: NFTObject) => void;
  accountData: any;
  accountLoading: boolean;
  accountError: boolean;
}

const NFTSelect = ({
  handleSelectNft,
  accountData,
  accountLoading,
  accountError,
}: NFTSelectProps) => {
  const [nftList, setNftList] = useState<any[]>([]);

  useEffect(() => {
    const fetchNFTs = async (ownerAddress: string) => {
      const baseURL = 'https://eth-mainnet.alchemyapi.io/v2/demo/getNFTs/';
      const fetchURL = `${baseURL}?owner=${ownerAddress}`;

      try {
        const response = await fetch(fetchURL);
        if (response.ok) {
          const responseJson = await response.json();
          const ownedNfts: any[] = responseJson.ownedNfts;
          setNftList(ownedNfts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (accountData?.address) fetchNFTs(accountData.address);
  }, [accountData]);

  if (accountLoading) {
    return <div>Loading NFTs...</div>;
  } else if (accountError) {
    return <div>Error loading NFTs</div>;
  } else if (!accountData) {
    return null;
  } else if (nftList.length === 0) {
    return <div>No NFTs found, go mint one.</div>;
  } else {
    return (
      <NFTList>
        {nftList.map((nft, idx) => {
          let nftImgSrc = '';

          if (nft.metadata && nft.metadata.image_url) {
            nftImgSrc = nft.metadata.image_url;
          } else if (nft.media && nft.media.length > 0) {
            nftImgSrc = nft.media[0].gateway;
          }

          return (
            <NFTSelectButton key={idx} onClick={() => handleSelectNft(nft)}>
              <img
                src={nftImgSrc}
                alt={nft.metadata ? nft.metadata.name : ''}
                width={256}
              />
            </NFTSelectButton>
          );
        })}
      </NFTList>
    );
  }
};

export default NFTSelect;
