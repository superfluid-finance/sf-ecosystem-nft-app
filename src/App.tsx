import "./App.css";
import { PrivyProvider } from "@privy-io/react-auth";
import type { PrivyClientConfig } from "@privy-io/react-auth";
import {
  bsc,
  polygon,
  gnosis,
  optimism,
  arbitrum,
  avalanche,
  celo,
  base,
  scroll,
} from "viem/chains";
import { Layout } from "./components/layout";
import { Dashboard } from "./components/views/Dashboard";
import { mumbai, sepolia, avalancheFuji } from "./lib/default";

const privyConfig: PrivyClientConfig = {
  loginMethods: ["wallet"],
  appearance: {
    theme: "light",
    showWalletLoginFirst: true,
    walletList: [
      "detected_wallets",
      "metamask",
      "coinbase_wallet",
      "rainbow",
      "wallet_connect",
    ],
  },
  defaultChain: mumbai,
  supportedChains: [
    mumbai,
    sepolia,
    avalancheFuji,
    bsc,
    polygon,
    gnosis,
    optimism,
    arbitrum,
    avalanche,
    celo,
    base,
    scroll,
  ],
};

const handleLogin = (user: any) => {
  console.log(`User ${user.id} logged in!`);
};

function App() {
  return (
    <PrivyProvider
      appId={`clpispdty00ycl80fpueukbhl`}
      onSuccess={handleLogin}
      config={privyConfig}
    >
      <Layout>
        <Dashboard />
      </Layout>
    </PrivyProvider>
  );
}

export default App;