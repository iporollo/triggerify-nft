import styled, { keyframes } from 'styled-components';

const HeaderStyled = styled.header`
  background: orangered;
  margin-bottom: 1.45rem;
`;

const TriggeredAnimation = keyframes`
  0% { transform: translate(16px, 8px); }
  5% { transform: translate(-8px, -16px);}
  10% { transform: translate(-32px, 0px); }
  15% { transform: translate(0px, 16px); }
  20% { transform: translate(8px, -8px); }
  25% { transform: translate(-8px, 16px); }
  30% { transform: translate(-32px, 8px); }
  35% { transform: translate(16px, 8px); }
  40% { transform: translate(-8px, -8px); }
  45% { transform: translate(16px, 16px); }
  50% { transform: translate(8px, -16px); }
  55% { transform: translate(16px, 8px); }
  60% { transform: translate(-8px, -16px); }
  65% { transform: translate(-32px, 0px); }
  70% { transform: translate(0px, 16px); }
  75% { transform: translate(8px, -8px); }
  80% { transform: translate(-8px, 16px); }
  85% { transform: translate(-32px, 8px); }
  90% { transform: translate(16px, 8px); }
  95% { transform: translate(-8px, -8px); }
  100% { transform: translate(16px, 16px); }
`;

const HeaderInner = styled.div`
  margin: 0px auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem;
  animation-name: ${TriggeredAnimation};
  animation-duration: calc(0.8333s);
  transform-origin: 50% 50%;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

const StyledHeaderText = styled.h1`
  margin: 4px 0px 0px;
  font-family: Trigger, sans-serif;
  text-shadow: black 10px 10px;
  transform-origin: left bottom;
  transform: rotate(-3deg);
  font-size: 2.5rem;
`;

const StyledHeaderLink = styled.a`
  color: white;
  text-decoration: none;
`;

export { HeaderStyled, HeaderInner, StyledHeaderText, StyledHeaderLink };
