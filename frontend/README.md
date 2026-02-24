# Frontend Documentation

## Overview

The frontend is a React.js application providing a user interface for interacting with the Land Registry smart contracts on the Polygon blockchain.

## Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── NavBar.js
│   │   ├── LandCard.js
│   │   ├── Modal.js
│   │   └── ...
│   ├── pages/             # Full page components
│   │   ├── Home.js
│   │   ├── BrowseLands.js
│   │   ├── RegisterLand.js
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   │   ├── useWallet.js   # MetaMask wallet connection
│   │   ├── useContract.js # Contract interaction
│   │   ├── useTransaction.js # Transaction handling
│   │   └── ...
│   ├── config/            # Configuration files
│   │   └── contracts.js   # Contract ABIs and addresses
│   ├── utils/             # Utility functions
│   │   └── index.js       # Validation and formatting
│   ├── App.js             # Main app component
│   ├── App.css            # Global styles
│   ├── index.js           # Entry point
│   └── index.css          # Global CSS
├── public/                # Static assets
├── package.json           # Dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Setup

### Installation

```bash
cd frontend
npm install
```

### Environment Configuration

```bash
cp .env.example .env
```

Update `.env` with deployed contract addresses:
```
REACT_APP_LAND_REGISTRY_ADDRESS=0x...
REACT_APP_LAND_TRANSFER_ADDRESS=0x...
```

### Running Development Server

```bash
npm start
```

Application runs on http://localhost:3000

### Building for Production

```bash
npm run build
```

## Features

### Pages

**Home** (`/`)
- Project overview
- Feature highlights
- Get started call-to-action
- No wallet connection required

**Browse Lands** (`/browse`)
- View all registered lands
- Paginated results (6 per page)
- Click to view land details
- Requires wallet connection

**Register Land** (`/register`)
- Form to register new land
- Input validation
- Real-time error feedback
- Transaction status tracking
- Requires wallet connection

### Components

**NavBar**
- Navigation menu
- Wallet connection button
- Account display
- Responsive design

**LandCard**
- Display land information
- Status indicator
- View Details button
- Hover effects

**Modal**
- Reusable modal dialog
- Customizable title and buttons
- Click-outside to close
- Accessibility features

## Hooks

### useWallet

Manages MetaMask wallet connection.

```javascript
const {
  account,
  provider,
  signer,
  isConnecting,
  error,
  connect,
  disconnect,
  switchNetwork,
  isConnected
} = useWallet();
```

### useContract

Initializes contract instance from ABI and address.

```javascript
const { contract, loading, error } = useContract(
  signer,
  contractAddress,
  contractABI,
  contractName
);
```

Specialized hooks:
- `useLandRegistry(signer, address)` - LandRegistry contract
- `useLandTransfer(signer, address)` - LandTransfer contract

### useTransaction

Handles blockchain transaction execution and status.

```javascript
const {
  execute,
  reset,
  txLoading,
  txError,
  txHash,
  txReceipt,
  isSuccess
} = useTransaction();

// Usage
await execute(async () => {
  return await contract.someFunction();
});
```

## Utilities

### Formatting

- `formatAddress(address)` - Shorten address (e.g., 0x1234...5678)
- `convertToDate(timestamp)` - Convert Unix timestamp to readable date
- `convertAreaSquareMeters(area)` - Format area with thousand separators

### Validation

- `validateLocation(location)` - Check location input
- `validatePropertyNumber(number)` - Check property number
- `validateArea(area)` - Check area is valid number
- `validateOwnerName(name)` - Check owner name format
- `validateContactInfo(contact)` - Check contact info
- `validateCoordinates(coordinates)` - Validate GPS coordinates
- `validateIPFSHash(hash)` - Validate IPFS hash format

## Styling

Project uses plain CSS with the following structure:

- Global styles in `index.css` and `App.css`
- Component-specific styles in `ComponentName.css`
- Consistent color scheme and spacing
- Mobile-responsive design
- Accessible color contrast ratios

## Integration with Smart Contracts

### LandRegistry Interactions

```javascript
// Register land
const tx = await landRegistry.registerLand(
  location,
  coordinates,
  area,
  propertyNumber,
  documentHash,
  ownerName,
  contactInfo
);

// Get lands
const lands = await landRegistry.getAllLands(offset, limit);

// Get land details
const land = await landRegistry.getLand(landId);
```

### Event Listening

Contract events are emitted and can be monitored in real-time:
- `LandRegistered` - When land is registered
- `OwnershipAdded` - When co-owner is added
- `OwnershipTransferred` - When ownership changes

## Error Handling

- Input validation with user-friendly error messages
- Transaction error handling with revert reasons
- Wallet connection error handling
- Contract interaction error handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires MetaMask or compatible Web3 wallet.

## Development Standards

- Follow component composition best practices
- Use custom hooks for logic separation
- Validate user input before submission
- Handle loading and error states
- Provide user feedback for all actions
- Maintain responsive design
- Use semantic HTML

## Build and Deployment

### Build Process

```bash
npm run build
```

Creates optimized production build in `build/` directory.

### Deployment Options

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

### Environment Variables for Production

Update `.env.production` with production contract addresses.

## Performance Optimization

- React.lazy for code splitting
- Memoization for expensive components
- Efficient state management
- Optimized contract calls with pagination

## Future Enhancements

- User dashboard with owned lands
- Land transfer workflow UI
- Ownership history visualization
- Search and filter functionality
- Mobile app version
- Advanced mapping integration
- Document upload and storage

## Troubleshooting

### Wallet Connection Issues
- Ensure MetaMask is installed
- Check network is set to Polygon Mumbai
- Verify contract addresses in `.env`

### Contract Interaction Errors
- Verify contract deployment
- Check contract addresses match deployment
- Ensure user has sufficient MATIC for gas
- Check contract ABI is up to date

### Build Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`
