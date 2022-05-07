import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAccount } from 'wagmi';
import { TriggerSpan, TriggeredAnimation } from '../../styles/indexStyles';

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

  const calculateTriggerDuration = (): number => {
    if (triggerLevel === 0) return 0;
    return 5 / (triggerLevel * 1.0);
  };

  const TriggeredContainer = styled.div`
    margin-bottom: 24px;
    animation-name: ${TriggeredAnimation};
    animation-duration: calc(${calculateTriggerDuration()}s);
    transform-origin: 50% 50%;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  `;

  return (
    <>
      {!selectedNft && !!accountData && (
        <h1>
          Click an NFT to <TriggerSpan>triggerify</TriggerSpan>
        </h1>
      )}
      {selectedNft && (
        <>
          <TriggeredContainer>
            <img src={selectedNft} alt={selectedNft} width={256} />
          </TriggeredContainer>
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
