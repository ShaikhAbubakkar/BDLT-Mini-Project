# Land Registry System

A blockchain-based land registration system using Polygon and IPFS.

## Quick Start

### 1. Install Dependencies
```bash
npm install
cd frontend && npm install
cd ../backend && npm install && cd ..
```

### 2. Test Smart Contracts
```bash
npm test
```

### 3. Deploy
```bash
# To Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Or local
npx hardhat node  # Terminal 1
npx hardhat run scripts/deploy.js --network localhost  # Terminal 2
```

### 4. Run Frontend
```bash
cd frontend
cp .env.example .env
# Update .env with contract addresses from deployment
npm start
```

### 5. Run Backend (Optional)
```bash
cd backend
npm start
```

## Project Structure

```
contracts/          # Smart contracts (Solidity)
test/               # Contract tests
scripts/            # Deployment scripts
frontend/           # React app
backend/            # Express API + IPFS
```

## Features

- Register land on blockchain
- Track ownership and history
- Request transfers with approval workflow
- Store documents on IPFS
- MetaMask wallet integration

## Networks

- **Mumbai Testnet (FREE)**: 80001 - Use for development/testing
- Get free test MATIC: https://faucet.polygon.technology/

## Configuration

1. Create `.env` in root and add your private key:
```env
PRIVATE_KEY=your_wallet_private_key_here
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

2. Create `frontend/.env`:
```env
REACT_APP_LAND_REGISTRY_ADDRESS=0x...
REACT_APP_LAND_TRANSFER_ADDRESS=0x...
REACT_APP_NETWORK_ID=80001
```

3. Create `backend/.env`:
```env
PORT=5000
IPFS_HOST=localhost
IPFS_PORT=5001
```

## Smart Contracts

- **LandRegistry**: Register and manage land properties
- **LandTransfer**: Handle transfer requests with approval

See [contracts/README.md](contracts/README.md) for details.

## Testing

```bash
npm test              # Run all tests
REPORT_GAS=true npm test    # Show gas costs
```

## Development

```bash
# Compile
npm run compile

# Local node
npx hardhat node

# Deploy to local
npx hardhat run scripts/deploy.js --network localhost
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.

## Resources

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [Smart Contracts](contracts/README.md)
