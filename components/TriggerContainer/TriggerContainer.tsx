import { useState, useEffect } from 'react';
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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [gifProgress, setGifProgress] = useState<number>(0);

  const NFT_NAME = selectedNft
    ? `Triggered ${selectedNft.metadata.name} (Level ${triggerLevel})`
    : '';

  const FILE_NAME = `${NFT_NAME}.gif`;

  const handleMintClick = () => {
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
    } else if (isMinting) {
      mintNft(blob);
    }
    setIsSaving(false);
    setIsMinting(false);
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
    console.log(result);
  };

  const getNftImage = () => {
    let nftImgSrc = '';
    if (selectedNft.metadata.image_url) {
      nftImgSrc = selectedNft.metadata.image_url;
    } else if (selectedNft.media.length > 0) {
      nftImgSrc = selectedNft.media[0].gateway;
    }
    return nftImgSrc;
  };

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
            imgSrc={getNftImage()}
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
