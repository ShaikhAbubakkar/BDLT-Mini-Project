# Smart Contract Tests

This directory contains all test files for the smart contracts.

## Test Structure

- `PropertyRegistry.test.js` - Tests for property management
- `RentalAgreement.test.js` - Tests for rental agreements
- `PaymentEscrow.test.js` - Tests for payment handling

## Running Tests

```bash
npm test
```

## Test Coverage

```bash
npx hardhat coverage
```

## Writing Tests

Use Hardhat's built-in testing framework with Chai assertions:

```javascript
describe("Contract Name", () => {
  it("should do something", async () => {
    // Test code
  });
});
```
