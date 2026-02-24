# Smart Contracts

This directory contains the Solidity smart contracts for the Land Registry System.

## Contracts

### LandRegistry.sol

Core contract managing land registration, ownership records, and ownership history.

**Capabilities:**
- Register new land with location, area, coordinates, and legal documents (IPFS hash)
- Support for single and multiple owners
- Track ownership percentage for co-owners
- Maintain complete ownership history (chain of title)
- Add co-owners with specified ownership percentages
- Transfer full property ownership to new owner
- Update property documents and coordinates

**Key Functions:**
- `registerLand()` - Register new property with initial owner
- `addCoOwner()` - Add co-owner with ownership percentage
- `transferOwnership()` - Transfer property ownership to new owner
- `updateLandDetails()` - Update property coordinates and documents
- `getLandOwners()` - Retrieve all current property owners
- `getOwnershipHistory()` - Retrieve complete chain of title
- `isLandOwner()` - Verify if address owns property
- `getCurrentOwner()` - Get primary owner of property
- `getPersonLands()` - Get all properties owned by address
- `getAllLands()` - Get paginated list of all properties

**Events:**
- `LandRegistered(uint256 landId, string location, string propertyNumber, uint256 timestamp)`
- `OwnershipAdded(uint256 landId, address owner, uint256 ownershipPercentage)`
- `LandUpdated(uint256 landId, uint256 timestamp)`
- `OwnershipTransferred(uint256 landId, address previousOwner, address newOwner, uint256 timestamp)`

**Data Structures:**
- `Land` - Contains property details (location, area, coordinates, documents, registration status)
- `Owner` - Contains owner information (address, name, contact, ownership percentage)

### LandTransfer.sol

Manages property transfer requests and implements multi-party approval workflow.

**Capabilities:**
- Request property transfer with recipient details
- Multi-party approval mechanism (property owner and recipient both approve)
- Reject transfer requests with reason tracking
- Cancel transfer requests (requester only)
- Automatic property ownership update on completion
- Complete transfer request history per property
- Pending transfer tracking by recipient

**Key Functions:**
- `requestTransfer()` - Initiate property transfer to new owner
- `approveTransfer()` - Recipient approves transfer (triggers completion if both approve)
- `rejectTransfer()` - Reject transfer with reason (prevents further action)
- `cancelTransfer()` - Requester cancels transfer
- `getTransferRequest()` - Retrieve transfer request details
- `getLandTransferHistory()` - Get all transfer requests for property
- `getUserPendingTransfers()` - Get pending transfers awaiting user approval
- `isPendingApproval()` - Check if transfer awaiting approval

**Events:**
- `TransferRequested(uint256 requestId, uint256 landId, address fromOwner, address toOwner, uint256 timestamp)`
- `TransferApprovedByRecipient(uint256 requestId, address approver, uint256 timestamp)`
- `TransferCompleted(uint256 requestId, uint256 landId, address newOwner, uint256 timestamp)`
- `TransferRejected(uint256 requestId, address rejectedBy, string reason, uint256 timestamp)`
- `TransferCancelled(uint256 requestId, uint256 timestamp)`

**Data Structures:**
- `TransferRequest` - Contains transfer details (property, parties, approval status, completion status)

## Compilation

```bash
npm run compile
```

Compiles all contracts and generates ABI files and artifacts.

## Testing

```bash
npm test
```

Runs comprehensive test suite covering:
- Contract deployment and initialization
- Land registration with validation
- Ownership management (single/multiple owners)
- Ownership verification
- Land transfer workflows
- Transfer approval and rejection flows
- Ownership history tracking
- Permission-based access control
- Error conditions and edge cases
- Pagination and data retrieval

Run with coverage:
```bash
npx hardhat coverage
```

## Deployment

### Deploy to Mumbai Testnet
```bash
npm run deploy:testnet
```

### Deploy to Polygon Mainnet
Update network configuration in `hardhat.config.js`, then:
```bash
npm run deploy
```

Update contract addresses in `config/contracts.config.js` after deployment.

## Contract Architecture

```
LandRegistry.sol (Core)
├── Manages land properties registration
├── Tracks ownership records
└── Maintains ownership history

LandTransfer.sol (Transfer Management)
├── Creates transfer requests
├── Handles approval workflow
└── Calls LandRegistry to update ownership
```

## Security Design

- Access control: Only land owners can modify property records
- Access control: Only transfer parties can modify transfer requests
- Input validation: Checks for empty/invalid values
- State immutability: Cannot rewrite ownership history
- Event logging: All state changes emit events for off-chain verification
- No reentrancy: Functions use checks-effects-interactions pattern
- Gas efficiency: Minimal storage operations and optimized loops

## Design Patterns

- **Separation of Concerns**: LandRegistry handles land records, LandTransfer handles transfers
- **Event-Driven**: All critical state changes emit events for off-chain tracking
- **Access Control**: Modifiers enforce permission-based operations
- **Data Structure Organization**: Separate mappings for different data relationships

## Gas Optimization

- Efficient mapping-based storage
- Minimal state mutations
- Optimized loop operations (avoided where possible)
- Single-pass array processing
- No unnecessary data copies

## Standards and Dependencies

- Solidity Version: ^0.8.19
- Follows OpenZeppelin contract patterns
- Uses standard naming conventions (camelCase for functions, UPPER_CASE for constants)
- Comprehensive NatSpec documentation

## Future Enhancements

- Dispute resolution contract for ownership disputes
- Multi-signature wallet integration for organization ownership
- Government official verification layer
- Mortgage and lien tracking
- Tax/revenue record integration

