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

export const CryptoWalletLogin: FC = () => {
  const network = WalletAdapterNetwork.Testnet;

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

        var response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/solana-wallet-auth`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data?.jwt) {
          console.log("Server response:", response.data);
          router.push("/");
        } else {
          console.error("Server error:", response.statusText);
        }
      } catch (error) {
        console.error("Error signing message:", error);
      }
    }
  };

  useEffect(() => {
    if (connected) {
      signMessageIfConnected();
    }
  }, [connected, publicKey]);

  return (
    <div>
      {connected && publicKey ? (
        <div>
          <p>Wallet Address: {publicKey.toBase58()}</p>
        </div>
      ) : (
        <p>Please connect your wallet.</p>
      )}
    </div>
  );
};
