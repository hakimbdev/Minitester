const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');
const Token = require('../models/Token');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting: 5 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: 'Too many requests, please try again later' }
});

// Apply authentication middleware to all routes
router.use(authMiddleware);
router.use(limiter);

/**
 * @route POST /api/transactions/transfer
 * @desc Transfer tokens from one address to another
 */
router.post('/transfer', async (req, res) => {
  try {
    const { toAddress, tokenAddress, amount, signature } = req.body;
    const fromAddress = req.user.walletAddress;
    
    // Validate required fields
    if (!toAddress || !tokenAddress || !amount || !signature) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Execute secure transfer
    const result = await blockchainService.secureTransferTokens(
      fromAddress,
      toAddress,
      tokenAddress,
      amount,
      signature
    );
    
    res.json({
      success: true,
      transactionHash: result.transactionHash,
      message: 'Transfer successful'
    });
  } catch (error) {
    console.error('Error transferring tokens:', error);
    res.status(error.status || 500).json({ 
      success: false,
      message: error.message || 'Failed to transfer tokens'
    });
  }
});

/**
 * @route POST /api/transactions/buy
 * @desc Buy tokens with TON
 */
router.post('/buy', async (req, res) => {
  try {
    const { tokenAddress, tonAmount, signature } = req.body;
    const buyerAddress = req.user.walletAddress;
    
    if (!tokenAddress || !tonAmount || !signature) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get token information
    const token = await Token.findByContractAddress(tokenAddress);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    // Verify transaction signature
    if (!(await blockchainService.verifyTransactionSignature(signature, {
      buyerAddress,
      tokenAddress,
      tonAmount
    }))) {
      return res.status(401).json({ message: 'Invalid transaction signature' });
    }

    // Calculate token amount and execute purchase
    const tokenAmount = (parseFloat(tonAmount) / token.price).toString();
    const result = await blockchainService.buyTokens(
      buyerAddress,
      tokenAddress,
      tonAmount,
      tokenAmount
    );
    
    res.json({
      success: true,
      transactionHash: result.transactionHash,
      tokenAmount,
      message: 'Purchase successful'
    });
  } catch (error) {
    console.error('Error buying tokens:', error);
    res.status(error.status || 500).json({ 
      success: false,
      message: error.message || 'Failed to buy tokens'
    });
  }
});

module.exports = router;