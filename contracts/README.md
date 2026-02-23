# Smart Contracts

This directory contains all smart contracts for the House Rental System.

## Contracts Overview

### 1. PropertyRegistry.sol
Manages property listings and details.
- Add property
- Update property
- Get property details
- List all properties

### 2. RentalAgreement.sol
Handles rental agreements between landlords and tenants.
- Create rental agreement
- Approve rental terms
- Track lease duration
- Early termination logic

### 3. PaymentEscrow.sol
Manages payments and security deposits.
- Receive monthly rent
- Hold security deposits
- Release deposits
- Withdraw funds for landlord

## Compilation & Testing

```bash
npm run compile
npm test
```

## Deployment

```bash
npm run deploy:testnet
```
