import "./App.css";
import "./styles/appkit-button.css";
import { WalletProvider } from "./providers/WalletProvider";
import { Layout } from "./components/layout";
import { Dashboard } from "./components/views/Dashboard";

function App() {
  return (
    <WalletProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </WalletProvider>
  );
}

export default App;
