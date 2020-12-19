import React from "react";
import { Box, Button, Notice, NoticeContent, NoticeIcon, Spacer } from "react-neu";
import styled from "styled-components";

const ResumedLPsNotice: React.FC = () => (
  <>
    <Notice>
      <NoticeIcon>💧</NoticeIcon>
      <NoticeContent>
        <StyledNoticeContentInner>
          <span>LP rewards are resumed, you can now farm again!</span>
          <Box flex={1} />
          <Spacer size="sm" />
          <Button
            size="sm"
            text="Add Liquidity"
            href="https://shinobi-info.ubiq.ninja/pair/0xf102ad140b26c3c6af9e9358da9deaa27cb1dbea"
            variant="secondary"
          />
        </StyledNoticeContentInner>
      </NoticeContent>
    </Notice>
    <Spacer />
  </>
);

const StyledNoticeContentInner = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`;

export default ResumedLPsNotice;
