import { usePrivy } from "@privy-io/react-auth";

export const ConnectWallet = () => {
  const { login } = usePrivy();

  return (
    <button
      className="cursor-pointer w-full bg-sf-green active:border-transparent active:outline-none focus:border-transparent focus:outline-none hover:border-transparent hover:outline-none rounded-[0.625rem] font-medium text-white"
      onClick={login}
    >
      Connect Wallet
    </button>
  );
};
