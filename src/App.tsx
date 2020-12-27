import React, { useCallback, useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "react-neu";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UseWalletProvider } from "use-wallet";

import MobileMenu from "components/MobileMenu";
import TopBar from "components/TopBar";

import { BalancesProvider } from "contexts/Balances";
import { FarmingProvider } from "contexts/Farming";
import UbiqProvider from "contexts/UbiqProvider";
import useLocalStorage from "hooks/useLocalStorage";

import Farm from "views/Farm";
import Home from "views/Home";
import Addresses from "views/Addresses";

const App: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false);
  }, [setMobileMenu]);

  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true);
  }, [setMobileMenu]);

  return (
    <Router>
      <Providers>
        <TopBar onPresentMobileMenu={handlePresentMobileMenu} />
        <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/farm">
            <Farm />
          </Route>
          <Route exact path="/addresses">
            <Addresses />
          </Route>
        </Switch>
      </Providers>
    </Router>
  );
};

const Providers: React.FC = ({ children }) => {
  const [darkModeSetting] = useLocalStorage("darkMode", false);
  const { dark: darkTheme, light: lightTheme } = useMemo(() => {
    return createTheme({
      baseColor: { h: 338, s: 100, l: 41 },
      baseColorDark: { h: 339, s: 89, l: 49 },
      borderRadius: 28,
    });
  }, []);
  return (
    <ThemeProvider darkModeEnabled={darkModeSetting} darkTheme={darkTheme} lightTheme={lightTheme}>
      <UseWalletProvider chainId={8}>
        <UbiqProvider>
          <BalancesProvider>
            <FarmingProvider>{children}</FarmingProvider>
          </BalancesProvider>
        </UbiqProvider>
      </UseWalletProvider>
    </ThemeProvider>
  );
};

export default App;
