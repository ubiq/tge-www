import React, { useMemo } from "react";
import { Modal, ModalContent, ModalProps, Spacer } from "react-neu";
import styled from "styled-components";
import { useWallet } from "use-wallet";

import metamaskLogo from "assets/metamask-fox.svg";
import sparrowLogo from "assets/sparrow.png";

declare const window: any;

const ConfirmTransactionModal: React.FC<ModalProps> = ({ isOpen }) => {
  const { connector } = useWallet();

  let injectedLogo = metamaskLogo;

  if (window.ethereum) {
    if (window.ethereum.isSparrow) {
      injectedLogo = sparrowLogo;
    }
  }

  const WalletLogo = useMemo(() => {
    if (connector === "injected") {
      return <img src={injectedLogo} alt="Wallet Logo" style={{ height: 96, width: 96, alignSelf:"center" }}/>;
    }
  }, [connector]);

  return (
    <Modal isOpen={isOpen}>
      <ModalContent>
        {WalletLogo}
        <Spacer />
        <StyledText>Confirm transaction in wallet.</StyledText>
      </ModalContent>
    </Modal>
  );
};

const StyledText = styled.div`
  font-size: 24px;
  text-align: center;
`;

export default ConfirmTransactionModal;
