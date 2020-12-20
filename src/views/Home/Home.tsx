import React from "react";
import { useTheme } from "react-neu";

import Page from "components/Page";
import PageHeader from "components/PageHeader";

const Home: React.FC = () => {
  const { darkMode } = useTheme();
  return (
    <Page>
      <PageHeader
        icon={darkMode ? "🌚" : "🌞"}
        subtitle={darkMode ? "🤫 shhh... the TGE1s are sleeping." : "It's a great day to farm TGE1s!"}
        title="Welcome to Ubiq TGE Framework."
      />
    </Page>
  );
};

export default Home;
