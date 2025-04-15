const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');
const Token = require('../models/Token');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: { message: 'Too many requests from this IP' }
});

// Apply middleware
router.use(limiter);

/**
 * @route GET /api/wallet/:address/info
 * @desc Get wallet information (public route)
 */
router.get('/:address/info', async (req, res) => {
  try {
    if (!blockchainService.validateAddress(req.params.address)) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }

    const accountInfo = await blockchainService.getAccountInfo(req.params.address);
    res.json(accountInfo);
  } catch (error) {
    console.error('Error fetching wallet info:', error);
    res.status(500).json({ message: 'Failed to fetch wallet information' });
  }
});

/**
 * @route GET /api/wallet/:address/tokens
 * @desc Get tokens owned by an address
 */
router.get('/:address/tokens', authMiddleware, async (req, res) => {
  try {
    const address = req.params.address;
    
    // Verify that the requested address matches the authenticated user
    if (address.toLowerCase() !== req.user.walletAddress.toLowerCase()) {
      return res.status(403).json({ message: 'Unauthorized access to wallet data' });
    }
    
    // Get tokens created by this address
    const createdTokens = await Token.findByOwner(address);
    
    // Get token balances from blockchain
    const tokenBalances = await blockchainService.getWalletTokenBalances(address);
    
    const response = {
      createdTokens,
      tokenBalances,
      tonBalance: await blockchainService.getTONBalance(address)
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching wallet tokens:', error);
    res.status(500).json({ message: 'Failed to fetch wallet tokens' });
  }
});

/**
 * @route POST /api/wallet/validate-signature
 * @desc Validate a wallet signature for authentication
 */
router.post('/validate-signature', async (req, res) => {
  try {
    const { signature, message, walletAddress } = req.body;

    if (!signature || !message || !walletAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const isValid = await blockchainService.verifyTransactionSignature(
      signature,
      { message },
      walletAddress
    );

    if (isValid) {
      const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ valid: true, token });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    console.error('Error validating signature:', error);
    res.status(500).json({ message: 'Failed to validate signature' });
  }
});

module.exports = router;