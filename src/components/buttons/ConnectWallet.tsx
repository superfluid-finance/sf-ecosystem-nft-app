import { useAppKit } from '@reown/appkit/react'
import { MouseEvent, useEffect } from 'react'

// Primary Connect Wallet component that uses ReOwn's appkit-button with custom styling
export function ConnectWallet() {
  const { open } = useAppKit()
  
  // Since the web component may not inherit styles properly, we'll use the custom approach
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    open()
  }
  
  return (
    <button 
      onClick={handleClick}
      className="w-full bg-sf-green hover:bg-sf-green/80 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      Connect Wallet
    </button>
  )
}

// Alternative that uses the web component directly (simpler but less styling control)
export function AppKitButton() {
  return <appkit-button />
}

// Styled version of the web component
export function StyledAppKitButton() {
  // Add CSS variables to customize the appkit-button
  useEffect(() => {
    // Add CSS to style the appkit-button
    const style = document.createElement('style')
    style.textContent = `
      appkit-button {
        --appkit-color-accent: #00C66F;
        --appkit-color-accent-hover: #00A55C;
        --appkit-button-border-radius: 0.5rem;
        --appkit-button-width: 100%;
        --appkit-button-height: 38px;
        display: block;
        width: 100%;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  return (
    <div className="w-full">
      <appkit-button />
    </div>
  )
}
