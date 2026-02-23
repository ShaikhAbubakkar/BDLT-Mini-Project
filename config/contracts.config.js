// Smart Contract Addresses & ABIs
// Update these after deployment

const contracts = {
  PropertyRegistry: {
    address: "0x...", // Update after deployment
    abi: [] // Contract ABI goes here
  },
  RentalAgreement: {
    address: "0x...",
    abi: []
  },
  PaymentEscrow: {
    address: "0x...",
    abi: []
  }
};

const networks = {
  mumbai: {
    chainId: 80001,
    rpcUrl: "https://rpc-mumbai.maticvigil.com"
  },
  polygon: {
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com"
  }
};

module.exports = { contracts, networks };
