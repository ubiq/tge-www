import React from "react";
import { Container } from "react-neu";

import Page from "components/Page";
import PageHeader from "components/PageHeader";
import {
  ContractIncentivizer,
  ContractTimelock,
  ESCH,
  TGE1,
} from "constants/tokenAddresses";
import AddressButton from "components/AddressButton";

const Addresses: React.FC = () => {
  return (
    <Page>
      <PageHeader icon={"🎖️"} title={"Addresses"} subtitle={"Official Addresses"} />
      <Container size="sm">
        <h2>TGE1 Addresses &amp; Assets</h2>
        <AddressButton
          name="TGE1"
          address={TGE1}
          uniswap={false}
          unitext="Buy at Shinobi"
          unilink="https://shinobi.ubiq.ninja/swap?inputCurrency="
        />
        <AddressButton name="ESCH" address={ESCH} uniswap={true} />

        <h3>TGE1 Contracts Addresses</h3>
        <AddressButton name="Timelock" address={ContractTimelock} uniswap={false} />
        <AddressButton name="Incentivizer" address={ContractIncentivizer} uniswap={false} />
      </Container>
    </Page>
  );
};

export default Addresses;
