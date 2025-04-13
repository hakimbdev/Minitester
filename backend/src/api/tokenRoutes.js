const express = require('express');
const router = express.Router();
const Token = require('../models/Token');
const blockchainService = require('../services/blockchainService');

/**
 * @route GET /api/tokens
 * @desc Get all tokens
 */
router.get('/', async (req, res) => {
  try {
    const tokens = await Token.findAll();
    res.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api/tokens/:id
 * @desc Get token by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    res.json(token);
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api/tokens
 * @desc Create a new token (deploy contract)
 */
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      symbol, 
      totalSupply, 
      ownerAddress, 
      description, 
      imageUrl,
      website,
      telegram,
      twitter
    } = req.body;

    // Validate required fields
    if (!name || !symbol || !totalSupply || !ownerAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create token on blockchain
    const deployResult = await blockchainService.createToken(
      { name, symbol, totalSupply },
      ownerAddress
    );

    // Create token record
    const token = new Token({
      name,
      symbol,
      contractAddress: deployResult.tokenAddress,
      ownerAddress,
      totalSupply,
      description,
      imageUrl,
      website,
      telegram,
      twitter,
      launchStatus: 'live'
    });

    await token.save();
    
    res.status(201).json(token);
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).json({ message: 'Failed to create token' });
  }
});

/**
 * @route GET /api/tokens/owner/:address
 * @desc Get tokens by owner address
 */
router.get('/owner/:address', async (req, res) => {
  try {
    const tokens = await Token.findByOwner(req.params.address);
    res.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens by owner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 