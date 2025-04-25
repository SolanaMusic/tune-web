import {
  Connection,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import { Buffer } from "buffer";

const PhantomTransaction = () => {
  if (typeof window !== "undefined") {
    window.Buffer = Buffer;
  }

  const createTransaction = async () => {
    const provider = window.solana;
    if (!provider) {
      alert("Phantom Wallet not found");
      return;
    }

    let status = "pending";
    let signature = null;
    const price = 0.0333;

    try {
      const connection = new Connection(
        "https://api.testnet.solana.com",
        "confirmed"
      );

      await provider.connect();
      const senderPublicKey = new PublicKey(provider.publicKey.toString());
      console.log("Sender:", senderPublicKey.toBase58());

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("finalized");

      const recipient = new PublicKey(
        "DpNXPNWvWoHaZ9P3WtfGCb2ZdLihW8VW1w1Ph4KDH9iG"
      );

      const lamports = Math.round(price * 1_000_000_000);

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: senderPublicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipient,
          lamports,
        })
      );

      const signedTransaction = await provider.signTransaction(transaction);
      signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      console.log(`Transaction signature: ${signature}`);

      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      if (confirmation.value.err) {
        console.log("Transaction failed");
        status = "failed";
      } else {
        console.log("Transaction confirmed");
        status = "completed";
      }
    } catch (error) {
      console.error("Transaction processing error:", error);
      status = "failed";
    }

    const paymentRequest = {
      userId: 1,
      currency: "SOL",
      amount: price,
      subscriptionPlanId: 1,
      paymentIntent: signature,
      status: status,
    };

    try {
      const response = await fetch(
        "https://localhost:7210/api/payments/crypto",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentRequest),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Payment recorded:", result);
      } else {
        console.error("Failed to record payment.");
      }
    } catch (error) {
      console.error("Error posting payment record:", error);
    }
  };

  return (
    <div>
      <button onClick={createTransaction}>Pay 0.0333 SOL</button>
    </div>
  );
};

export default PhantomTransaction;
