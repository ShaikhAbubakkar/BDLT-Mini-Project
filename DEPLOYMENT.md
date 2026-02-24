# Deployment Guide (Free - Mumbai Testnet Only)

## Prerequisites

- Node.js 16+
- MetaMask wallet (free)
- IPFS daemon (optional, for document storage)

## Step 1: Get Free Test MATIC

1. Go to: https://faucet.polygon.technology/
2. Connect wallet
3. Request test MATIC (free, appears in 1-2 min)

## Step 2: Setup Environment

```bash
# Copy template
cp .env.example .env

# Edit .env - add your private key from MetaMask
# (Right-click account → Account Details → Export Private Key)
PRIVATE_KEY=your_wallet_private_key_here
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

## Step 3: Deploy Smart Contracts

```bash
# Install dependencies
npm install
npm run compile

# Test locally (no cost)
npm test

# Deploy to Mumbai testnet (costs free test MATIC)
npx hardhat run scripts/deploy.js --network mumbai
```

This saves contract addresses to deployment file.

## Step 4: Configure Frontend

```bash
cd frontend

# Copy deployment addresses
cp .env.example .env

# Edit .env with contract addresses from Step 3
REACT_APP_LAND_REGISTRY_ADDRESS=0x...
REACT_APP_LAND_TRANSFER_ADDRESS=0x...
REACT_APP_NETWORK_ID=80001

npm install
npm start
```

Frontend runs at http://localhost:3000

## Step 5: Test in Browser

1. Install MetaMask (free)
2. Add Mumbai testnet to MetaMask:
   - RPC: https://rpc-mumbai.maticvigil.com
   - Chain ID: 80001
   - Currency: MATIC
3. Go to http://localhost:3000
4. Click "Connect Wallet"
5. Register test land (costs fake MATIC - free)

## Step 6: Optional - Setup IPFS Backend

```bash
# Install IPFS: https://docs.ipfs.tech/install/

# Start IPFS daemon
ipfs daemon  # Terminal 1

# In another terminal
cd backend
npm install
npm start
```

Backend runs at http://localhost:5000

## Verify Deployment

1. Check contract on block explorer:
   - https://mumbai.polygonscan.com
   - Search for contract address from Step 3

2. View transactions:
   - Search your wallet address
   - See all test transactions

3. Download IPFS files (if using backend):
   - https://gateway.pinata.cloud/ipfs/{hash}

## Troubleshooting

**"Insufficient balance"**
- You didn't get test MATIC yet - use faucet above

**"Network mismatch"**
- MetaMask wrong network - switch to Mumbai (80001)

**"Contract address missing"**
- Re-check `.env` in frontend
- Copy exact address from deployment output

**IPFS connection refused**
- Start daemon: `ipfs daemon` in another terminal

## That's it!

You now have a fully working blockchain app with zero cost.
All data is on testnet and will reset with testnet updates.
