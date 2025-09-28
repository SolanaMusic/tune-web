import axios from "axios";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  Connection,
  Keypair,
  SendTransactionError,
} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { useUserStore } from "@/stores/UserStore";

export const useSolana = () => {
  const { user } = useUserStore();
  const connection = new Connection(
    `${process.env.NEXT_PUBLIC_CONNECTION_ADRESS}`,
    "confirmed"
  );

  const sendSolanaTransaction = async (
    toAddress: string,
    lamportsAmount: number
  ): Promise<string | null> => {
    try {
      const provider = (window as any).solana;

      if (!provider) throw new Error("Wallet not found");
      await provider.connect();

      const senderPublicKey = new PublicKey(provider.publicKey.toString());
      const recipient = new PublicKey(toAddress);

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("finalized");

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: senderPublicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipient,
          lamports: lamportsAmount,
        })
      );

      const signedTransaction = await provider.signTransaction(transaction);
      let signature: string;

      try {
        signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );
      } catch (error) {
        if (error instanceof SendTransactionError) {
          const logs = await error.getLogs(connection);
          console.error("Transaction simulation logs:", logs);
        }
        throw error;
      }

      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      if (confirmation.value.err) {
        console.error("Transaction failed:", confirmation.value.err);
        return null;
      }

      console.log("Transaction confirmed. Signature:", signature);
      return signature;
    } catch (error) {
      console.error("Error during Solana transaction:", error);
      return null;
    }
  };

  const mintNft = async (id: number, mintAddress: string, price: number) => {
    const provider = window.solana;
    await provider.connect();

    const toAddress = process.env.NEXT_PUBLIC_SYSTEM_WALLET_ADRESS;
    const byteArrayString = process.env.NEXT_PUBLIC_PRIVATE_KEY;

    if (!toAddress || !byteArrayString) {
      throw new Error(
        "System wallet address or private key is missing in env variables."
      );
    }

    const buyerPublicKey = new PublicKey(provider.publicKey);
    const nftMint = new PublicKey(mintAddress);

    try {
      const byteArray = byteArrayString.split(",").map(Number);
      const payer = Keypair.fromSecretKey(Uint8Array.from(byteArray));

      const buyerTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        nftMint,
        buyerPublicKey
      );

      const sellerTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        nftMint,
        payer.publicKey
      );

      const transactionTx = await sendSolanaTransaction(
        toAddress,
        price * 1_000_000_000
      );

      const transferTx = await transfer(
        connection,
        payer,
        sellerTokenAccount.address,
        buyerTokenAccount.address,
        payer.publicKey,
        1
      );

      await connection.confirmTransaction(transferTx);
      await sendMintRequest(
        id,
        provider.publicKey.toString(),
        price,
        mintAddress
      );

      return transactionTx;
    } catch (error) {
      console.error("Error during NFT minting:", error);
      return null;
    }
  };

  const sendMintRequest = async (
    id: number,
    owner: string,
    amount: number,
    address: string
  ) => {
    const nftRequest = {
      nftRequest: {
        id,
        owner,
      },
      transactionRequest: {
        userId: user?.id,
        currencyId: 2,
        amount,
        paymentIntent: address,
        transactionType: "NftMint",
        paymentMethod: "Crypto",
        status: "Completed",
      },
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/mint`,
        nftRequest,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error during minting request:", error);
      throw error;
    }
  };

  return { sendSolanaTransaction, mintNft };
};
