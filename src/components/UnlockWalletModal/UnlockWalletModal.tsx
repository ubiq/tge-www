import React, { useCallback, useEffect } from "react";
import { Box, Button, Modal, ModalActions, ModalContent, ModalProps, ModalTitle } from "react-neu";
import styled from "styled-components";
import { useWallet } from "use-wallet";

import metamaskLogo from "assets/metamask-fox.svg";
import sparrowLogo from "assets/sparrow.png";

import WalletProviderCard from "./components/WalletProviderCard";

declare const window: any;

const UnlockWalletModal: React.FC<ModalProps> = ({ isOpen, onDismiss }) => {
  const { account, connector, connect } = useWallet();

  const handleConnectMetamask = useCallback(() => {
    connect("injected");
  }, [connect]);

  const handleConnectSparrow = useCallback(() => {
    connect("injected");
  }, [connect]);
  console.log(window.ethereum.isMetaMask)
  let injectedLogo = metamaskLogo;
  let injectedName = "Metamask";

  if (window.ethereum) {
    if (window.ethereum.isSparrow) {
      injectedLogo = sparrowLogo;
      injectedName = "Sparrow"
    }
  }

  useEffect(() => {
    if (account) {
      onDismiss && onDismiss();
    }
    if (connector) {
      localStorage.setItem("walletProvider", connector);
    }
  }, [account, onDismiss]);

  
  return (
    <Modal isOpen={isOpen}>
      <ModalTitle text="Select a wallet provider." />
      <ModalContent>
        <StyledWalletsWrapper>
          <Box flex={1}>
            <WalletProviderCard icon={<img src={injectedLogo} style={{ height: 32 }} />} name={injectedName} onSelect={handleConnectMetamask} />
          </Box>
        </StyledWalletsWrapper>
      </ModalContent>
      <ModalActions>
        <Box flex={1} row justifyContent="center">
          <Button onClick={onDismiss} text="Cancel" variant="secondary" />
        </Box>
      </ModalActions>
    </Modal>
  );
};

const StyledWalletsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    flex-wrap: none;
  }
`;

export default UnlockWalletModal;
