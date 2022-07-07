import { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import TriggerCanvas from '../TriggerCanvas/TriggerCanvas';
import { NFTObject } from '../../utils/globalTypes';
import { TriggerSpan } from '../../styles/indexStyles';

const TriggerRangeContainer = styled.div`
  width: 100%;
`;

const RangeInputWrapper = styled.div`
  margin: 20px 0px;
`;

const RangeInput = styled.input`
  appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: rgb(239, 239, 239);
  outline: none;
`;

const TriggerLevelDisplay = styled.h2`
  text-align: center;
  letter-spacing: 1px;
`;

const ButtonStyled = styled.button`
  background: none;
  background-color: orangered;
  color: white;
  border: none;
  padding: 12px;
  margin: 0px 6px;
  text-transform: uppercase;
  font-weight: bold;
  cursor: pointer;

  ${(props) =>
    props.disabled &&
    css`
      background: grey;
    `}
`;

const ProgressContainer = styled.div`
  max-width: 130px;
  display: flex;
  margin: auto;
  margin-bottom: 20px;
`;

interface TriggerContainerProps {
  selectedNft: NFTObject;
  accountData: any;
}

const TriggerContainer = ({
  selectedNft,
  accountData,
}: TriggerContainerProps) => {
  const [triggerLevel, setTriggerLevel] = useState<number>(5);
  const [renderingGif, setRenderingGif] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintMessage, setMintMessage] = useState<JSX.Element | undefined>(
    undefined
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [gifProgress, setGifProgress] = useState<number>(0);
  const [nftImageUrl, setNftImageUrl] = useState<string>('');

  const NFT_NAME = selectedNft
    ? `Triggered ${selectedNft.name} (Level ${triggerLevel})`
    : '';

  const FILE_NAME = `${NFT_NAME}.gif`;

  const handleMintClick = () => {
    setMintMessage(undefined);
    setRenderingGif(true);
    setIsMinting(true);
  };

  const handleSaveClick = () => {
    setRenderingGif(true);
    setIsSaving(true);
  };

  const gifProgressCallback = (progress: number) => {
    console.log('progress', progress);
    setGifProgress(progress);
  };

  const gifFinishedCallback = (blob: Blob) => {
    setRenderingGif(false);
    if (isSaving) {
      const tempLink = document.createElement('a');
      tempLink.href = URL.createObjectURL(blob);
      tempLink.setAttribute('download', FILE_NAME);
      tempLink.click();
      setIsSaving(false);
      setIsMinting(false);
    } else if (isMinting) {
      mintNft(blob);
    }
  };

  const mintNft = async (blob: Blob) => {
    const form = new FormData();

    var file = new File([blob], FILE_NAME, {
      type: 'image/gif',
      lastModified: Date.now(),
    });
    form.append('file', file, FILE_NAME);

    const options = {
      method: 'POST',
      body: form,
      headers: {
        Authorization: process.env.NEXT_PUBLIC_NFTPORT_API_KEY || '',
      },
    };

    const response = await fetch(
      'https://api.nftport.xyz/v0/mints/easy/files?' +
        new URLSearchParams({
          chain: 'polygon',
          name: NFT_NAME,
          description: `Created by triggerify.xyz - A triggered version of your NFT - ${NFT_NAME}`,
          mint_to_address: accountData?.address,
        }),
      options
    );

    const result = await response.json();
    if (result.response === 'NOK') {
      const message = <p>{result.error.message}</p>;
      setMintMessage(message);
    } else if (result.response === 'OK') {
      const message = (
        <p>
          {`Minted ${NFT_NAME}. Click `}{' '}
          <a href={result.transaction_external_url}>here to see transaction.</a>
        </p>
      );
      setMintMessage(message);
    }
    setIsSaving(false);
    setIsMinting(false);
  };

  const getNftImage = useCallback(
    () => selectedNft.previews.image_large_url,
    [selectedNft]
  );

  useEffect(() => {
    const fetchNFTImage = async () => {
      const nftImgSrc = getNftImage();
      const imageResponse = await fetch(nftImgSrc);
      const imageBlob = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setNftImageUrl(imageUrl);
    };
    if (selectedNft) fetchNFTImage();
  }, [selectedNft, getNftImage]);

  return (
    <>
      {!selectedNft && !!accountData && (
        <h1>
          Click an NFT to <TriggerSpan>triggerify</TriggerSpan>
        </h1>
      )}
      {selectedNft && (
        <>
          <TriggerCanvas
            imgSrc={nftImageUrl}
            triggerLevel={triggerLevel}
            shouldRender={renderingGif}
            gifProgressCallback={gifProgressCallback}
            gifFinishedCallback={gifFinishedCallback}
          />
          <TriggerRangeContainer>
            <RangeInputWrapper>
              <RangeInput
                type="range"
                min={0}
                max={10}
                value={triggerLevel}
                onChange={(e) => {
                  setTriggerLevel(parseInt(e.target.value));
                }}
              />
            </RangeInputWrapper>
            <TriggerLevelDisplay>
              Trigger Level:
              <TriggerSpan>{triggerLevel}</TriggerSpan>
            </TriggerLevelDisplay>
          </TriggerRangeContainer>
          <div>
            {renderingGif && (
              <ProgressContainer>
                <progress value={gifProgress * 100} max="100" />
              </ProgressContainer>
            )}
            {(isMinting || isSaving) && renderingGif && (
              <div>
                <p>Creating gif...</p>
              </div>
            )}
            {isMinting && !renderingGif && (
              <div>
                <p>Minting NFT...</p>
              </div>
            )}
            {mintMessage && (
              <div>
                <p>{mintMessage}</p>
              </div>
            )}
          </div>
          <div>
            <ButtonStyled disabled={renderingGif} onClick={handleMintClick}>
              Mint
            </ButtonStyled>
            <ButtonStyled disabled={renderingGif} onClick={handleSaveClick}>
              Save
            </ButtonStyled>
          </div>
        </>
      )}
    </>
  );
};

export default TriggerContainer;
