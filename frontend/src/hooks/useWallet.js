import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const signer = await provider.getSigner();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);

      // Subscribe to account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      });

      // Subscribe to chain changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (err) {
      setError(err.message);
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setError(null);
  };

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (err) {
      if (err.code === 4902) {
        console.error("Network not found. Please add it manually.");
      }
      throw err;
    }
  };

  return {
    account,
    provider,
    signer,
    isConnecting,
    error,
    connect,
    disconnect,
    switchNetwork,
    isConnected: !!account,
  };
};

export default useWallet;
