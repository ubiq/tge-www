import React, { useMemo } from "react";
import styled from "styled-components";
import copy from "assets/copy.svg";
import confirm from "assets/copy_confirm.svg";
import { Box, Spacer, useTheme } from "react-neu";

interface AddressButtonProps {
  name?: string;
  address?: string;
  shinobi?: boolean;
  shinobitext?: string;
  shinobilink?: string;
  to?: string;
}

const AddressButton: React.FC<AddressButtonProps> = ({ name, address, shinobi, shinobitext, shinobilink }) => {
  const { darkMode } = useTheme();

  const DisplayShinobi = useMemo(() => {
    if (shinobi) {
      return (
        <>
          <Spacer />
          <StyledLink
            darkMode={darkMode}
            href={shinobilink ? shinobilink + address : "https://shinobi.ubiq.ninja/swap?inputCurrency=" + address}
            target="_blank"
            color="white"
            overflow={true}
          >
            <StyledShinobiButton darkMode={darkMode}>
              <StyledSpan>
                <span>{shinobitext ? shinobitext : "Buy at Shinobi"}</span>
              </StyledSpan>
            </StyledShinobiButton>
          </StyledLink>
        </>
      );
    }
  }, [darkMode, shinobi]);

  const DisplayAddress = useMemo(() => {
    if (shinobi) {
      return (
        <>
          <span className="address combine">
            <AddressStart>{address}</AddressStart>
            <AddressEnd>{address}</AddressEnd>
          </span>
        </>
      );
    } else {
      return (
        <>
          <span className="address">{address}</span>
        </>
      );
    }
  }, [darkMode, shinobi]);

  return (
    <>
      <Box row>
        <StyledButton darkMode={darkMode} shinobi={shinobi}>
          <StyledSpan>
            <StyledName darkMode={darkMode} shinobi={shinobi}>
              {name ? name + " " : ""}
            </StyledName>
            <StyledLink darkMode={darkMode} color="hsl(339deg 89% 49% / 100%)" href={"https://ubiqscan.io/address/" + address} target="_blank">
              {DisplayAddress}
            </StyledLink>
            <StyledCopy
              darkMode={darkMode}
              shinobi={shinobi}
              onClick={() => {
                navigator.clipboard.writeText(address ? address : "");
              }}
            ></StyledCopy>
          </StyledSpan>
        </StyledButton>
        {DisplayShinobi}
      </Box>
      <Spacer />
    </>
  );
};

interface StyledButtonProps {
  to?: string;
  darkMode?: boolean;
  shinobi?: boolean;
}

interface StyledSpanProps {
  darkMode?: boolean;
  shinobi?: boolean;
}

interface StyledLinkProps {
  darkMode?: boolean;
  color?: string;
  overflow?: boolean;
}

interface StyledCopyProps {
  darkMode?: boolean;
  shinobi?: boolean;
}

const StyledButton = styled.div<StyledButtonProps>`
  background: ${(props) =>
    props.darkMode
      ? "radial-gradient(circle at top,hsl(339deg 17% 15% / 100%),hsl(339deg 20% 10% / 100%))"
      : "radial-gradient(circle at top,hsl(338deg 20% 96% / 100%),hsl(338deg 20% 94% / 100%))"};
  box-shadow: ${(props) =>
    props.darkMode
      ? "-8px 8px 16px 0 hsl(339deg 20% 5% / 100%), 8px -8px 16px 0px hsl(339deg 100% 100% / 7.5%)"
      : "-8px 8px 16px 0 hsl(338deg 95% 4% / 15%), 8px -8px 16px 0px hsl(338deg 100% 100% / 100%);"};
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 0;
  border-radius: 28px;
  box-sizing: border-box;
  color: hsl(339deg 89% 49% / 100%);
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 48px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  margin: 0;
  outline: none;
  padding-left: 24px;
  padding-right: 24px;
  white-space: nowrap;
  line-height: 50px;
  min-width: 48px;
  width: ${(props) => (!props.shinobi ? "-webkit-fill-available" : null)};
`;

const StyledShinobiButton = styled(StyledButton)`
  border-radius: 9px;
  color: #ffffff;
  background: radial-gradient(174.47% 188.91% at 1.84% 10%, rgb(255, 0, 122) 0%, rgb(6 44 97) 80%), rgb(237, 238, 242);
  min-width: 152px;
  padding-left: 10px;
  padding-right: 10px;
`;

const StyledName = styled.span<StyledSpanProps>`
  color: ${(props) => (props.darkMode ? props.theme.colors.grey[100] : props.theme.colors.grey[400])};
  margin: 0px 5px 0px 0px;
  min-width: ${(props) => (!props.shinobi ? "85" : "45")}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledLink = styled.a<StyledLinkProps>`
  cursor: pointer;
  color: ${(props) => (props.color ? props.color : "white")};
  overflow: ${(props) => (props.overflow ? null : "hidden")};
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0px 5px;
  &:hover {
    color: ${(props) => (!props.darkMode ? (props.color ? props.theme.colors.grey[400] : "white") : "white")};
  }
`;

const StyledSpan = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledCopy = styled.span<StyledCopyProps>`
  cursor: pointer;
  mask-image: url(${copy});
  -webkit-mask-image: url(${copy});
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 12px;
  background-color: ${(props) => (props.darkMode ? props.theme.colors.primary.main : props.theme.colors.grey[500])};
  width: ${(props) => (!props.shinobi ? "32" : "50")}px;
  margin: 20px 0px 16px 5px;
  &:hover {
    opacity: 0.6;
  }
  &:active {
    -webkit-mask-image: url(${confirm});
    mask-image: url(${confirm});
    opacity: 1;
  }
`;

const AddressStart = styled.span`
  display: inline-block;
  width: calc(50% + 22px);
  text-overflow: ellipsis;
`;

const AddressEnd = styled.span`
  display: inline-flex;
  width: calc(50% - 28px);
  justify-content: flex-end;
`;

export default AddressButton;
