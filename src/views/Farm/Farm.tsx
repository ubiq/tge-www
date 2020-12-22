import React, { useMemo } from "react";

import { Box, Button, Container, Separator, Spacer } from "react-neu";

import Page from "components/Page";
import PageHeader from "components/PageHeader";
import Split from "components/Split";
import useFarming from "hooks/useFarming";
import HarvestCard from "./components/Harvest";
import StakeCard from "./components/Stake";
import { useWallet } from "use-wallet";

const Farm: React.FC = () => {
  const { status } = useWallet();

  const { isRedeeming, onRedeemESCHUBQ } = useFarming();

  const RedeemButton = useMemo(() => {
    if (status !== "connected") {
      return <Button disabled text="Harvest &amp; Unstake ESCH/UBQ" variant="secondary" />;
    }
    if (!isRedeeming) {
      return <Button onClick={onRedeemESCHUBQ} text="Harvest &amp; Unstake ESCH/UBQ" variant="secondary" />;
    }
    return <Button disabled text="Redeeming..." variant="secondary" />;
  }, [isRedeeming, onRedeemESCHUBQ]);

  return (
    <Page>
      <PageHeader icon="🌾🦖" subtitle="Stake ESCH/UBQ Shinobi LP tokens and grow TGE1s" title="Farm" />
      <Container>
        <Spacer />
        <Split>
          <StakeCard />
          <HarvestCard />
        </Split>
        <Spacer />
        <Box row justifyContent="center">
          {RedeemButton}
        </Box>
        <Spacer size="lg" />
        <Separator />
        <Spacer size="lg" />
        <Split>
          <Button full text="Addresses" to="/addresses" variant="secondary" />
          <Button
            full
            text="Get ESCH/UBQ LP tokens"
            href="https://shinobi-info.ubiq.ninja/pair/0xf102ad140b26c3c6af9e9358da9deaa27cb1dbea"
            variant="tertiary"
          />
        </Split>
      </Container>
    </Page>
  );
};

export default Farm;
