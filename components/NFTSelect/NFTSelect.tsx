import { useState, useEffect } from 'react';
import styled from 'styled-components';

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
  handleSelectNft: (nftImageSrc: string) => void;
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
  const [nftImageList, setNftImageList] = useState<string[]>([]);

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
        {nftImageList.map((imgSrc, idx) => (
          <NFTSelectButton key={idx} onClick={() => handleSelectNft(imgSrc)}>
            <img src={imgSrc} alt={imgSrc} width={256} />
          </NFTSelectButton>
        ))}
      </NFTList>
    );
  }
};

export default NFTSelect;
