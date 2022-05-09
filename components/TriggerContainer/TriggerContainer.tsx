import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TriggerSpan } from '../../styles/indexStyles';
import TriggerCanvas from '../TriggerCanvas/TriggerCanvas';

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

interface TriggerContainerProps {
  selectedNft: string;
  accountData: any;
}

const TriggerContainer = ({
  selectedNft,
  accountData,
}: TriggerContainerProps) => {
  const [triggerLevel, setTriggerLevel] = useState<number>(5);

  return (
    <>
      {!selectedNft && !!accountData && (
        <h1>
          Click an NFT to <TriggerSpan>triggerify</TriggerSpan>
        </h1>
      )}
      {selectedNft && (
        <>
          <TriggerCanvas imgSrc={selectedNft} triggerLevel={triggerLevel} />
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
        </>
      )}
    </>
  );
};

export default TriggerContainer;
