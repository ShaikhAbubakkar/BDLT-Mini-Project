const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Upload image to IPFS
router.post('/image', upload.single('file'), (req, res) => {
  res.json({ message: 'Image upload handler', ipfsHash: 'QmXxx...' });
});

module.exports = router;
