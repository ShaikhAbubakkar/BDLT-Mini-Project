# Backend - Node.js/Express

This backend handles off-chain operations for the House Rental System.

## Main Responsibilities

1. **File Upload**: Handle property images to IPFS
2. **Metadata Storage**: Store additional property metadata
3. **Email Notifications**: Send notifications to users
4. **API Gateway**: Serve data not stored on-chain

## Project Structure

```
backend/
├── routes/         # API routes
├── middleware/     # Custom middleware
├── server.js       # Main server file
└── package.json    # Dependencies
```

## Installation & Setup

```bash
npm install
npm run dev
```

## API Endpoints

### Properties
- `POST /api/properties/upload` - Upload property details
- `GET /api/properties/:id` - Get property metadata
- `GET /api/properties` - List all properties

### Upload
- `POST /api/upload/image` - Upload image to IPFS

## Environment Variables

```
PORT=5000
IPFS_URL=https://ipfs.infura.io:5001
```
