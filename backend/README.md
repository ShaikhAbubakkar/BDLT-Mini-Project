# Backend API Documentation

## Overview

The backend provides IPFS document storage integration for the Land Registry System. It handles file uploads, retrieval, and pinning of land documents on the distributed IPFS network.

## Getting Started

### Installation

```bash
cd backend
npm install
```

### Environment Configuration

Create `.env` file:

```
PORT=5000
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
NODE_ENV=development
```

### Running the Server

```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Health Check

```
GET /health
```

Returns server status.

### Upload Document

```
POST /api/upload
Content-Type: multipart/form-data
```

Upload a single document to IPFS.

**Response:**
```json
{
  "success": true,
  "ipfsHash": "QmXxxx...",
  "gatewayUrl": "https://gateway.pinata.cloud/ipfs/QmXxxx...",
  "fileName": "document.pdf",
  "size": 1024000,
  "mimeType": "application/pdf"
}
```

### Upload Multiple Documents

```
POST /api/upload-batch
Content-Type: multipart/form-data
```

Upload up to 10 documents at once.

### Get Document Information

```
GET /api/document/:hash
```

Retrieve document metadata by IPFS hash.

### Pin Document

```
POST /api/pin/:hash
```

Persist a document on the IPFS network.

## Usage Examples

### Upload from JavaScript/Frontend

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.ipfsHash);
```

### Integrate with Smart Contract

```javascript
// Frontend
const uploadResponse = await fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  body: formData
});
const { ipfsHash } = await uploadResponse.json();

// Send hash to smart contract
const tx = await landRegistry.registerLand(
  location,
  coordinates,
  area,
  propertyNumber,
  ipfsHash,  // Use IPFS hash as document proof
  ownerName,
  contactInfo
);
```

## Architecture

### Document Upload Flow

1. **Client** sends file via POST /api/upload
2. **Backend** validates file size and type
3. **IPFS Client** uploads to IPFS network
4. **Server** returns IPFS hash and gateway URL
5. **Frontend** stores hash in blockchain

### Document Retrieval Flow

1. **Smart Contract** stores IPFS hash
2. **Frontend** fetches hash from contract
3. **GET /api/document/:hash** gets metadata
4. **Gateway URL** used to download file

## IPFS Integration

### Kubo RPC Client

Uses `kubo-rpc-client` to interact with IPFS daemon.

### System Requirements

- IPFS go-ipfs daemon running (version 0.20+)
- Or: Use Infura IPFS API
- Available on port 5001 (default)

### Starting IPFS Daemon

```bash
# Install IPFS
ipfs init

# Start daemon
ipfs daemon
```

## Production Deployment

### Use Infura IPFS for Production

```javascript
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https"
});
```

### Use Pinata for Reliable Pinning

Pinata provides:
- Guaranteed pinning
- Content delivery
- Analytics
- API management

## Error Handling

### Common Errors

**400: No file provided**
**400: Invalid IPFS hash format**
**400: File too large (max 50MB)**
**500: Upload failed** - IPFS daemon not running

### Troubleshooting

**IPFS Connection Refused**
Solution: Start IPFS daemon with `ipfs daemon`

**Invalid IPFS Hash**
Ensure hash is valid CID format (starts with Qm... or baf...)

## Development

### Testing Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Upload file
curl -F "file=@test.pdf" http://localhost:5000/api/upload
```

## Security Considerations

### File Validation
- Validate file type (MIME type)
- Check file size limits
- Validate IPFS hash format

### CORS Configuration

Backend allows requests from frontend origin:
```
http://localhost:3000
```

### HTTPS in Production

Always use HTTPS in production deployment.

## Monitoring

### Logging

Server logs all operations:
- File uploads
- IPFS operations
- API errors
- Performance metrics

### Metrics to Track

- Upload success rate
- Average file size
- IPFS operation latency
- API response time

## Future Enhancements

- [ ] Add database for document metadata
- [ ] Implement document versioning
- [ ] Add virus scanning
- [ ] Support encrypted storage
- [ ] Document retention policies
- [ ] Document sharing permissions
- [ ] Document search functionality
- [ ] Document signing/verification

## Resources

- IPFS: https://ipfs.tech/
- Kubo RPC Client: https://github.com/ipfs/js-kubo-rpc-client
- Express.js: https://expressjs.com/
- Pinata: https://www.pinata.cloud/
