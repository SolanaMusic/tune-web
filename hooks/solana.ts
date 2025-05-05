import {
  PublicKey,
  SystemProgram,
  Transaction,
  Connection,
} from "@solana/web3.js";

export function useSolana() {
  const sendSolanaTransaction = async (
    toAddress: string,
    lamportsAmount: number
  ): Promise<string | null> => {
    try {
      const provider = window.solana;
      const connection = new Connection(
        `${process.env.NEXT_PUBLIC_CONNECTION_ADRESS}`,
        "confirmed"
      );

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

  return { sendSolanaTransaction };
}
