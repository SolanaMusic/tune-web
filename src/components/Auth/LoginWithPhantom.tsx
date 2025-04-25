import { useState, useEffect } from "react";

const LoginWithPhantom = () => {
  const [isPhantomAvailable, setIsPhantomAvailable] = useState(false);

  useEffect(() => {
    if (window.solana && window.solana.isPhantom) {
      setIsPhantomAvailable(true);
    } else {
      alert("Phantom Wallet unavailable");
    }
  }, []);

  const handleLogin = async () => {
    if (isPhantomAvailable) {
      try {
        if (!window.solana) {
          alert("Phantom Wallet is not available.");
          return;
        }

        const response = await window.solana.connect();

        console.log(
          "Connected to Phantom wallet:",
          response.publicKey.toString()
        );

        const publicKey = response.publicKey.toString();
        const message = `Please sign this message to login: ${publicKey}`;
        const signedMessage = await window.solana.signMessage(
          new TextEncoder().encode(message),
          "utf8"
        );

        const uint8Array = new Uint8Array(signedMessage.signature);
        const signatureBase64 = btoa(String.fromCharCode(...uint8Array));

        const body = {
          publicKey: publicKey,
          message: message,
          signature: signatureBase64,
          walletName: "phantom",
        };

        console.log(body);

        const result = await fetch(
          "https://localhost:7210/api/auth/solana-wallet-auth",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        const responseJson = await result.json();
        console.log(responseJson);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={!isPhantomAvailable}>
        Login with Phantom
      </button>
    </div>
  );
};

export default LoginWithPhantom;
