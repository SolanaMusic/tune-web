import axios from "axios";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  Connection,
  Keypair,
} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

export const useSolana = () => {
  const connection = new Connection(
    `${process.env.NEXT_PUBLIC_CONNECTION_ADRESS}`,
    "confirmed"
  );

  const sendSolanaTransaction = async (
    toAddress: string,
    lamportsAmount: number
  ): Promise<string | null> => {
    try {
      const provider = window.solana;
      await provider.connect();
      const senderPublicKey = new PublicKey(provider.publicKey.toString());
      const recipient = new PublicKey(toAddress);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipient,
          lamports: lamportsAmount,
        })
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("finalized");
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderPublicKey;

      const signedTransaction = await provider.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

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
    const buyerPublicKey = new PublicKey(provider.publicKey);
    const nftMint = new PublicKey(mintAddress);

    try {
      const byteArrayString = process.env.NEXT_PUBLIC_PRIVATE_KEY;
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

      await sendSolanaTransaction(toAddress, price * 1_000_000_000);

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

      return transferTx;
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
        userId: 1,
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
