import { useState, useCallback } from "react";

const useTransaction = () => {
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txReceipt, setTxReceipt] = useState(null);

  const execute = useCallback(async (transaction) => {
    try {
      setTxLoading(true);
      setTxError(null);
      setTxHash(null);
      setTxReceipt(null);

      const tx = await transaction();

      if (!tx) {
        throw new Error("Transaction failed");
      }

      setTxHash(tx.hash);

      const receipt = await tx.wait();
      setTxReceipt(receipt);

      return receipt;
    } catch (err) {
      const errorMessage = err.reason || err.message || "Transaction failed";
      setTxError(errorMessage);
      console.error("Transaction error:", err);
      throw err;
    } finally {
      setTxLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTxLoading(false);
    setTxError(null);
    setTxHash(null);
    setTxReceipt(null);
  }, []);

  return {
    execute,
    reset,
    txLoading,
    txError,
    txHash,
    txReceipt,
    isSuccess: !!txReceipt,
  };
};

export default useTransaction;
