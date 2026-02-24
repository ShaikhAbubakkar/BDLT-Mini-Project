export const LAND_REGISTRY_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_location", type: "string" },
      { internalType: "string", name: "_coordinates", type: "string" },
      { internalType: "uint256", name: "_area", type: "uint256" },
      { internalType: "string", name: "_propertyNumber", type: "string" },
      { internalType: "string", name: "_documentHash", type: "string" },
      { internalType: "string", name: "_ownerName", type: "string" },
      { internalType: "string", name: "_contactInfo", type: "string" },
    ],
    name: "registerLand",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_landId", type: "uint256" },
      { internalType: "address", name: "_coOwnerAddress", type: "address" },
      { internalType: "string", name: "_coOwnerName", type: "string" },
      { internalType: "string", name: "_contactInfo", type: "string" },
      { internalType: "uint256", name: "_ownershipPercentage", type: "uint256" },
    ],
    name: "addCoOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_landId", type: "uint256" },
      { internalType: "string", name: "_coordinates", type: "string" },
      { internalType: "string", name: "_documentHash", type: "string" },
    ],
    name: "updateLandDetails",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_landId", type: "uint256" },
      { internalType: "address", name: "_newOwnerAddress", type: "address" },
      { internalType: "string", name: "_newOwnerName", type: "string" },
      { internalType: "string", name: "_contactInfo", type: "string" },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_landId", type: "uint256" }],
    name: "getLand",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "landId", type: "uint256" },
          { internalType: "string", name: "location", type: "string" },
          { internalType: "string", name: "coordinates", type: "string" },
          { internalType: "uint256", name: "area", type: "uint256" },
          { internalType: "string", name: "propertyNumber", type: "string" },
          { internalType: "string", name: "documentHash", type: "string" },
          { internalType: "bool", name: "isRegistered", type: "bool" },
          { internalType: "uint256", name: "registeredAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
        ],
        internalType: "struct LandRegistry.Land",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_landId", type: "uint256" }],
    name: "getLandOwners",
    outputs: [
      {
        components: [
          { internalType: "address", name: "ownerAddress", type: "address" },
          { internalType: "string", name: "ownerName", type: "string" },
          { internalType: "string", name: "contactInfo", type: "string" },
          { internalType: "uint256", name: "ownershipPercentage", type: "uint256" },
          { internalType: "uint256", name: "acquiredAt", type: "uint256" },
        ],
        internalType: "struct LandRegistry.Owner[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_landId", type: "uint256" }],
    name: "getOwnershipHistory",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_person", type: "address" }],
    name: "getPersonLands",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_landId", type: "uint256" },
      { internalType: "address", name: "_address", type: "address" },
    ],
    name: "isLandOwner",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_landId", type: "uint256" }],
    name: "getCurrentOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_offset", type: "uint256" },
      { internalType: "uint256", name: "_limit", type: "uint256" },
    ],
    name: "getAllLands",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "landId", type: "uint256" },
          { internalType: "string", name: "location", type: "string" },
          { internalType: "string", name: "coordinates", type: "string" },
          { internalType: "uint256", name: "area", type: "uint256" },
          { internalType: "string", name: "propertyNumber", type: "string" },
          { internalType: "string", name: "documentHash", type: "string" },
          { internalType: "bool", name: "isRegistered", type: "bool" },
          { internalType: "uint256", name: "registeredAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
        ],
        internalType: "struct LandRegistry.Land[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "landId", type: "uint256" },
      { indexed: false, internalType: "string", name: "location", type: "string" },
      { indexed: false, internalType: "string", name: "propertyNumber", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "LandRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "landId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "ownershipPercentage", type: "uint256" },
    ],
    name: "OwnershipAdded",
    type: "event",
  },
];

export const LAND_TRANSFER_ABI = [
  {
    inputs: [{ internalType: "address", name: "_landRegistry", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_landId", type: "uint256" },
      { internalType: "address", name: "_toOwnerAddress", type: "address" },
      { internalType: "string", name: "_toOwnerName", type: "string" },
      { internalType: "string", name: "_toOwnerContact", type: "string" },
    ],
    name: "requestTransfer",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_requestId", type: "uint256" }],
    name: "approveTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_requestId", type: "uint256" },
      { internalType: "string", name: "_reason", type: "string" },
    ],
    name: "rejectTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_requestId", type: "uint256" }],
    name: "cancelTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_requestId", type: "uint256" }],
    name: "getTransferRequest",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "requestId", type: "uint256" },
          { internalType: "uint256", name: "landId", type: "uint256" },
          { internalType: "address", name: "fromOwner", type: "address" },
          { internalType: "address", name: "toOwner", type: "address" },
          { internalType: "string", name: "toOwnerName", type: "string" },
          { internalType: "string", name: "toOwnerContact", type: "string" },
          { internalType: "uint256", name: "requestedAt", type: "uint256" },
          { internalType: "bool", name: "fromOwnerApproved", type: "bool" },
          { internalType: "bool", name: "toOwnerApproved", type: "bool" },
          { internalType: "bool", name: "isCompleted", type: "bool" },
          { internalType: "bool", name: "isCancelled", type: "bool" },
          { internalType: "string", name: "rejectionReason", type: "string" },
        ],
        internalType: "struct LandTransfer.TransferRequest",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_landId", type: "uint256" }],
    name: "getLandTransferHistory",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getUserPendingTransfers",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_requestId", type: "uint256" }],
    name: "isPendingApproval",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

export const NETWORK_CONFIG = {
  mumbai: {
    chainId: 80001,
    name: "Polygon Mumbai",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
  },
  polygon: {
    chainId: 137,
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
  },
};

export const CONTRACT_CONFIG = {
  mumbai: {
    landRegistry: process.env.REACT_APP_LAND_REGISTRY_ADDRESS,
    landTransfer: process.env.REACT_APP_LAND_TRANSFER_ADDRESS,
  },
};
