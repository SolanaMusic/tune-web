import { Transaction } from "@solana/web3.js";

interface SolanaProvider {
  isPhantom: boolean;
  publicKey: {
    toString(): string;
  };
  connect: () => Promise<{ publicKey: { toString(): string } }>;
  signMessage: (
    message: Uint8Array,
    encoding: string
  ) => Promise<{ signature: Uint8Array }>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
  signAndSendTransaction?: (
    transaction: Transaction
  ) => Promise<{ signature: string }>;
  disconnect?: () => Promise<void>;
  on?: (event: string, handler: (args: any) => void) => void;
}

declare global {
  interface Window {
    solana?: SolanaProvider;
  }
}
