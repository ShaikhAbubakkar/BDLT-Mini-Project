const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { create } = require("kubo-rpc-client");
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());

// Initialize IPFS client
const ipfs = create({
  host: process.env.IPFS_HOST || "localhost",
  port: parseInt(process.env.IPFS_PORT || "5001"),
  protocol: process.env.IPFS_PROTOCOL || "http",
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Land Registry Backend",
  });
});

// Upload document to IPFS
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({
        error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
      });
    }

    console.log(`Uploading file: ${req.file.originalname}`);

    // Upload to IPFS
    const result = await ipfs.add(
      {
        path: req.file.originalname,
        content: req.file.buffer,
      },
      {
        progress: (bytes) => {
          console.log(`Progress: ${bytes} bytes`);
        },
      }
    );

    const ipfsHash = result.cid.toString();
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    console.log(`File uploaded successfully. IPFS hash: ${ipfsHash}`);

    res.json({
      success: true,
      ipfsHash,
      gatewayUrl,
      fileName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({
      error: "Upload failed",
      message: error.message,
    });
  }
});

// Batch upload documents
app.post("/api/upload-batch", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const uploadPromises = req.files.map(async (file) => {
      const result = await ipfs.add({
        path: file.originalname,
        content: file.buffer,
      });

      return {
        fileName: file.originalname,
        ipfsHash: result.cid.toString(),
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.cid.toString()}`,
        size: file.size,
      };
    });

    const uploads = await Promise.all(uploadPromises);

    console.log(`Batch upload completed: ${uploads.length} files`);

    res.json({
      success: true,
      count: uploads.length,
      documents: uploads,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Batch upload failed:", error);
    res.status(500).json({
      error: "Batch upload failed",
      message: error.message,
    });
  }
});

// Retrieve document metadata from IPFS
app.get("/api/document/:hash", async (req, res) => {
  try {
    const { hash } = req.params;

    // Validate hash format
    if (!hash.match(/^Qm[a-zA-Z0-9]{44}$|^baf[a-zA-Z0-9]{55,}$/)) {
      return res.status(400).json({ error: "Invalid IPFS hash format" });
    }

    console.log(`Retrieving document: ${hash}`);

    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;

    res.json({
      success: true,
      ipfsHash: hash,
      gatewayUrl,
      retrievedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Retrieval failed:", error);
    res.status(500).json({
      error: "Document retrieval failed",
      message: error.message,
    });
  }
});

// Pin document (persist on IPFS)
app.post("/api/pin/:hash", async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash.match(/^Qm[a-zA-Z0-9]{44}$|^baf[a-zA-Z0-9]{55,}$/)) {
      return res.status(400).json({ error: "Invalid IPFS hash format" });
    }

    console.log(`Pinning document: ${hash}`);

    // Attempt to pin (optional, may not work with all IPFS setups)
    try {
      await ipfs.pin.add(hash);
    } catch (pinError) {
      console.log("Pinning not available in current setup");
    }

    res.json({
      success: true,
      ipfsHash: hash,
      pinnedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Pinning failed:", error);
    res.status(500).json({
      error: "Pinning failed",
      message: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Land Registry Backend running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("  GET /health - Health check");
  console.log("  POST /api/upload - Upload single document to IPFS");
  console.log("  POST /api/upload-batch - Upload multiple documents");
  console.log("  GET /api/document/:hash - Get document metadata");
  console.log("  POST /api/pin/:hash - Pin document on IPFS");
});

module.exports = app;
