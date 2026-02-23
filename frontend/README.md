# Frontend - React.js

This is the React-based frontend for the House Rental System.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Full page components
├── hooks/         # Custom React hooks (Web3 integration)
├── utils/         # Utility functions
├── App.js         # Main app component
└── index.js       # Entry point
```

## Key Features

- **Property Browsing**: View available rental properties
- **User Dashboard**: Landlord and tenant dashboards
- **Payment Management**: Track rent payments
- **Contract Management**: View and sign rental agreements
- **Wallet Integration**: Connect MetaMask wallet

## Installation & Setup

```bash
npm install
npm start
```

The app will run on `http://localhost:3000`

## Web3 Integration

Uses Ethers.js to interact with smart contracts:
- Connect wallet
- Call contract functions
- Listen to events
- Send transactions

## Environment Variables

See `.env.example` for required variables.
