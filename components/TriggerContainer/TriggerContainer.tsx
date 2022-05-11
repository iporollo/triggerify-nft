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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [gifProgress, setGifProgress] = useState<number>(0);

  const handleMintClick = () => {
    console.log('minting logic');
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
      const fileName = `Triggered ${selectedNft.metadata.name} (Level ${triggerLevel}).gif`;
      const tempLink = document.createElement('a');
      tempLink.href = URL.createObjectURL(blob);
      tempLink.setAttribute('download', fileName);
      tempLink.click();
    }
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
