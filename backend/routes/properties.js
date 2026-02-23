const express = require('express');
const router = express.Router();

// Get all properties
router.get('/', (req, res) => {
  res.json({ message: 'Get all properties from blockchain' });
});

// Get single property
router.get('/:id', (req, res) => {
  res.json({ message: `Get property ${req.params.id}` });
});

// Upload property metadata
router.post('/upload', (req, res) => {
  res.json({ message: 'Property metadata uploaded' });
});

module.exports = router;
