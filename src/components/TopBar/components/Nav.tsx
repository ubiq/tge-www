import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledRouterLink exact activeClassName="active" to="/farm">
        Farm
      </StyledRouterLink>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`;

const StyledRouterLink = styled(NavLink)`
  color: ${(props) => props.theme.colors.grey[500]};
  font-weight: 700;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.colors.grey[600]};
  }
  &.active {
    color: ${(props) => props.theme.colors.primary.main};
  }
`;

export default Nav;
