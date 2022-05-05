import {
  HeaderStyled,
  HeaderInner,
  StyledHeaderText,
  StyledHeaderLink,
} from '../../styles/indexStyles';

const AppHeader: React.FC = () => (
  <HeaderStyled>
    <HeaderInner>
      <StyledHeaderText>
        <StyledHeaderLink>Triggerify NFT</StyledHeaderLink>
      </StyledHeaderText>
    </HeaderInner>
  </HeaderStyled>
);

export default AppHeader;
