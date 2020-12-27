import React from "react";
import { Container } from "react-neu";

import Page from "components/Page";
import PageHeader from "components/PageHeader";
import { TGE1ESCHUBQYieldFarm, ESCH, TGE1 } from "constants/tokenAddresses";
import AddressButton from "components/AddressButton";

const Addresses: React.FC = () => {
  return (
    <Page>
      <PageHeader icon={"🎖️"} title={"Addresses"} subtitle={"Official Addresses"} />
      <Container size="sm">
        <h2>TGE1 Addresses &amp; Assets</h2>
        <AddressButton name="TGE1" address={TGE1} shinobi={false} shinobitext="Buy at Shinobi" shinobilink="https://shinobi.ubiq.ninja/swap?inputCurrency=" />
        <AddressButton name="ESCH" address={ESCH} shinobi={true} />

        <h3>TGE1 Contracts Addresses</h3>
        <AddressButton name="Yield Farm" address={TGE1ESCHUBQYieldFarm} shinobi={false} />
      </Container>
    </Page>
  );
};

export default Addresses;
