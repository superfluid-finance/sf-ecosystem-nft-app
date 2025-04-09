import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { 
  polygon,
  gnosis,
  optimism,
  arbitrum,
  avalanche,
  celo,
  bsc,
  base,
  scroll
} from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { PropsWithChildren } from 'react'

// Create query client
const queryClient = new QueryClient()

// Get your project ID from https://cloud.reown.com
// Replace with your actual project ID - you can use a temporary one for development
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'placeholder-project-id'

const metadata = {
  name: 'Superfluid Ecosystem NFT',
  description: 'Superfluid Ecosystem NFT App',
  url: window.location.origin,
  icons: ['https://superfluid.org/favicon.svg']
}

// Create Wagmi Adapter - specify chains directly rather than using an array
const wagmiAdapter = new WagmiAdapter({
  networks: [base, polygon, gnosis, optimism, arbitrum, avalanche, celo, bsc, scroll],
  projectId,
  ssr: false
})

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [base, polygon, gnosis, optimism, arbitrum, avalanche, celo, bsc, scroll], 
  projectId,
  metadata,
  features: {  
    analytics: false,  
    email: false,  
    onramp: false,  
    swaps: false,  
    socials: false  
  },
  privacyPolicyUrl: "https://www.iubenda.com/privacy-policy/34415583/legal",  
  termsConditionsUrl: "https://www.superfluid.finance/termsofuse"
  
})

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
} 