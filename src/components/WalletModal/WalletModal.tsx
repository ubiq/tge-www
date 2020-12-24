import React, { useCallback, useState, useEffect } from "react";

import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";

import numeral from "numeral";
import { Box, Button, Modal, ModalActions, ModalContent, ModalProps, ModalTitle, Separator, Spacer } from "react-neu";

import FancyValue from "components/FancyValue";

import useBalances from "hooks/useBalances";

const WalletModal: React.FC<ModalProps> = ({ isOpen, onDismiss }) => {
  const [, setWalletModalIsOpen] = useState(false);
  const { reset } = useWallet();
  const { TGE1Balance } = useBalances();

  const getDisplayBalance = useCallback((value?: BigNumber) => {
    if (value) {
      return numeral(value).format("0.00a");
    } else {
      return "--";
    }
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem("account");
    localStorage.removeItem("walletProvider");
    setWalletModalIsOpen(false);
    reset();
    if (onDismiss) {
      onDismiss();
    }
  }, [reset]);

  useEffect(() => {
    isOpen = !isOpen;
  }, [setWalletModalIsOpen]);

  return (
    <Modal isOpen={isOpen}>
      <ModalTitle text="My Wallet" />
      <ModalContent>
        <Box row>
          <FancyValue icon="🦖" label="TGE1 balance" value={getDisplayBalance(TGE1Balance)} />
        </Box>
        <Spacer />
      </ModalContent>
      <Separator />
      <ModalActions>
        <Button onClick={onDismiss} text="Cancel" variant="secondary" />
        <Button onClick={handleSignOut} text="Sign Out" />
      </ModalActions>
    </Modal>
  );
};

export default WalletModal;
