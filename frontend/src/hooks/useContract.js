import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { LAND_REGISTRY_ABI, LAND_TRANSFER_ABI } from "../config/contracts";

const useContract = (signer, contractAddress, contractABI, contractName) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (signer && contractAddress && contractABI) {
      try {
        setLoading(true);
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contractInstance);
        setError(null);
      } catch (err) {
        setError(`Failed to initialize ${contractName} contract`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [signer, contractAddress, contractABI, contractName]);

  return { contract, loading, error };
};

export const useLandRegistry = (signer, contractAddress) => {
  return useContract(signer, contractAddress, LAND_REGISTRY_ABI, "LandRegistry");
};

export const useLandTransfer = (signer, contractAddress) => {
  return useContract(signer, contractAddress, LAND_TRANSFER_ABI, "LandTransfer");
};

export default useContract;
