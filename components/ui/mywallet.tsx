import { useEffect, useState, useMemo, FC } from "react";
import Image from "next/image";
import "@solana/wallet-adapter-react-ui/styles.css";
import "@/styles/globals.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Unplug, Copy } from "lucide-react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

export const MyWallet = () => {
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

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <MyWalletDisplay />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const MyWalletDisplay: FC = () => {
  const { connected, publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const connection = new Connection(endpoint, "confirmed");

  useEffect(() => {
    const getBalance = async () => {
      if (publicKey) {
        try {
          const balanceInLamports = await connection.getBalance(publicKey);
          const balanceInSol = balanceInLamports / 1000000000;
          setBalance(balanceInSol);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    if (connected) {
      getBalance();
    }
  }, [connected, publicKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!publicKey ? (
            <WalletMultiButton>
              <Image
                src="/icons/sol-logo-icon.svg"
                alt="Solana"
                width={25}
                height={25}
              />
              Connect
            </WalletMultiButton>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Balance</div>
                  <div className="text-2xl font-bold">
                    {(balance ?? 0).toFixed(6)} SOL
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-muted px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Current Address
                  </div>
                  <div className="text-sm font-mono font-semibold text-primary">
                    {`${publicKey.toString().slice(0, 6)}...${publicKey
                      .toString()
                      .slice(-4)}`}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(publicKey.toString());
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Copy address"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <WalletDisconnectButton>
                <Unplug />
                Disconnect
              </WalletDisconnectButton>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
