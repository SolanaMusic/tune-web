import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface PurchaseModalProps {
  name: string;
  image: string;
  collection: string;
  price: number;
  currency: string;
  address: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<string>;
}

export const PurchaseModal = ({
  name,
  image,
  collection,
  price,
  currency,
  address,
  isOpen,
  onClose,
  onConfirm,
}: PurchaseModalProps) => {
  const [isPurchaseInProgress, setIsPurchaseInProgress] = useState(false);
  const [txId, setTxId] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState<
    "success" | "timeout" | "failure" | null
  >(null);

  const handleConfirm = async () => {
    setIsPurchaseInProgress(true);
    setPurchaseStatus(null);

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject("timeout"), 30000)
    );

    try {
      const transactionId = await Promise.race([onConfirm(), timeout]);
      if (typeof transactionId === "string") {
        setTxId(transactionId);
      }

      setPurchaseStatus("success");
    } catch (error) {
      if (error === "timeout") {
        setPurchaseStatus("timeout");
      } else {
        console.error("Error during purchase:", error);
        setPurchaseStatus("failure");
      }
    } finally {
      setIsPurchaseInProgress(false);
    }
  };

  const handleClose = () => {
    onClose();
    setPurchaseStatus(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (!isPurchaseInProgress) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="bg-zinc-900 border-zinc-800"
        onInteractOutside={(e) => {
          if (isPurchaseInProgress) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isPurchaseInProgress) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>NFT Mint</DialogTitle>
          <DialogDescription>Confirm mint of the NFT</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-zinc-800">
            <img
              src={image || "/placeholder.svg"}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-zinc-400 truncate max-w-[200px]">
              {collection}
            </p>
            <p className="text-purple-400 font-semibold mt-1">
              {price} {currency}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Mint: {address.substring(0, 8)}...
            </p>
          </div>
        </div>

        <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-3 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-purple-400 flex-shrink-0" />
          <div>
            <span className="text-purple-200 text-sm font-medium">
              NFT Mint
            </span>
            <p className="text-purple-200/70 text-xs mt-1">
              When you confirm the transaction, you will send {price} SOL to the
              seller
            </p>
          </div>
        </div>

        {purchaseStatus === "timeout" && (
          <div className="bg-amber-900/30 border-amber-600/30 border rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-200 text-sm mb-2 font-medium">
                  Transaction submitted but confirmation is pending
                </p>
                <p className="text-amber-300/70 text-xs mb-2">
                  The transaction may take longer to confirm due to network
                  conditions.
                </p>
                <a
                  href={`${process.env.NEXT_PUBLIC_SOLSCAN_URL}token/${address}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 text-sm underline hover:text-opacity-80"
                >
                  View on Solscan
                </a>
              </div>
            </div>
          </div>
        )}

        {purchaseStatus === "success" && (
          <div className="bg-green-900/30 border-green-600/30 border rounded-lg p-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-200 text-sm mb-2 font-medium">
                  Transaction successfully confirmed!
                </p>
                <p className="text-green-300/70 text-xs mb-2">
                  The NFT has been minted for {price} SOL
                </p>
                <a
                  href={`${process.env.NEXT_PUBLIC_SOLSCAN_URL}tx/${txId}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 text-sm underline hover:text-opacity-80"
                >
                  View on Solscan
                </a>
              </div>
            </div>
          </div>
        )}

        {purchaseStatus === "failure" && (
          <div className="bg-red-900/30 border-red-600/30 flex items-center gap-2 rounded-lg p-3">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-200 text-smfont-medium">
                Transaction failed
              </p>
              <p className="text-red-300/70 text-xs">
                An error occurred while processing your transaction
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="mt-3">
          {purchaseStatus === null ? (
            <>
              <Button
                variant="outline"
                className="bg-white text-black hover:bg-gray-300 hover:text-black"
                onClick={handleClose}
                disabled={isPurchaseInProgress}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isPurchaseInProgress}>
                {isPurchaseInProgress ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Buy for ${price} ${currency}`
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleClose}
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={isPurchaseInProgress}
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
