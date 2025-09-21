import React, { FC, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import axios from "axios";
import { useUserStore } from "@/stores/UserStore";

export const CryptoWalletLogin: FC = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  );

  useEffect(() => {
    const resizeButton = () => {
      const dropdown = document.querySelector<HTMLDivElement>(
        ".wallet-adapter-dropdown"
      );
      if (dropdown) {
        const width = dropdown.getBoundingClientRect().width;

        const button = document.querySelector<HTMLDivElement>(
          ".wallet-adapter-button.wallet-adapter-button-trigger"
        );

        if (button) {
          button.style.width = `${width}px`;
        }
      }
    };

    setTimeout(resizeButton, 100);
    window.addEventListener("resize", resizeButton);

    return () => window.removeEventListener("resize", resizeButton);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletDisplay />
          <WalletMultiButton>
            <Image
              src="/icons/sol-logo-icon.svg"
              alt="Solana"
              width={25}
              height={25}
            />
            <span className="sr-only">Solana Wallet</span>
          </WalletMultiButton>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const WalletDisplay: FC = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const { connected, publicKey, wallet } = useWallet();
  const [message] = useState("Sign this message to authenticate");

  const signMessageIfConnected = async () => {
    if (connected && publicKey && wallet?.adapter?.signMessage) {
      try {
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await wallet.adapter.signMessage(encodedMessage);
        const signatureBase64 = btoa(String.fromCharCode(...signedMessage));

        const body = {
          publicKey: publicKey.toString(),
          signature: signatureBase64,
          message: message,
          walletName: wallet.adapter.name,
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/solana-wallet-auth`,
          body
        );

        const token = response.data?.jwt;
        if (token) {
          const user = {
            id: response.data.user.id,
            name: response.data.user.artistName || response.data.user.userName,
            role: response.data.role,
            avatar: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${response.data.user.profile.avatarUrl}`,
            tokensAmount: response.data.user.profile.tokensAmount,
            token,
          };

          setUser(user);
          router.push("/");
        } else {
          console.error("Auth error:", response.statusText);
        }
      } catch (error) {
        console.error("Error signing message:", error);
      }
    }
  };

  useEffect(() => {
    if (connected && !user) {
      signMessageIfConnected();
    }
  }, [connected, publicKey]);

  return null;
};
