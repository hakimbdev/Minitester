const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');
const Token = require('../models/Token');

/**
 * @route POST /api/transactions/transfer
 * @desc Transfer tokens from one address to another
 */
router.post('/transfer', async (req, res) => {
  try {
    const { fromAddress, toAddress, tokenAddress, amount } = req.body;
    
    // Validate required fields
    if (!fromAddress || !toAddress || !tokenAddress || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Transfer tokens
    const result = await blockchainService.transferTokens(
      fromAddress,
      toAddress,
      tokenAddress,
      amount
    );
    
    res.json({
      success: true,
      transactionHash: result.transactionHash,
      message: 'Transfer successful'
    });
  } catch (error) {
    console.error('Error transferring tokens:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to transfer tokens',
      error: error.message
    });
  }
});

/**
 * @route POST /api/transactions/buy
 * @desc Buy tokens with TON
 */
router.post('/buy', async (req, res) => {
  try {
    const { buyerAddress, tokenAddress, tonAmount } = req.body;
    
    // Validate required fields
    if (!buyerAddress || !tokenAddress || !tonAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get token information
    const token = await Token.findByContractAddress(tokenAddress);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    // Calculate token amount based on price
    const tokenAmount = (parseFloat(tonAmount) / token.price).toString();
    
    // Execute buy transaction
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
      tonAmount,
      message: 'Token purchase successful'
    });
  } catch (error) {
    console.error('Error buying tokens:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to buy tokens',
      error: error.message
    });
  }
});

/**
 * @route POST /api/transactions/sell
 * @desc Sell tokens for TON
 */
router.post('/sell', async (req, res) => {
  try {
    const { sellerAddress, tokenAddress, tokenAmount, sellAll } = req.body;
    
    // Validate required fields
    if (!sellerAddress || !tokenAddress || (!tokenAmount && !sellAll)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get token information
    const token = await Token.findByContractAddress(tokenAddress);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    let amountToSell = tokenAmount;
    
    // If selling all tokens, get the balance
    if (sellAll) {
      const balance = await blockchainService.getTokenBalance(sellerAddress, tokenAddress);
      amountToSell = balance.toString();
    }
    
    // Calculate TON amount based on price
    const tonAmount = (parseFloat(amountToSell) * token.price).toString();
    
    // Execute sell transaction
    const result = await blockchainService.sellTokens(
      sellerAddress,
      tokenAddress,
      amountToSell,
      tonAmount
    );
    
    res.json({
      success: true,
      transactionHash: result.transactionHash,
      tokenAmount: amountToSell,
      tonAmount,
      message: 'Token sale successful'
    });
  } catch (error) {
    console.error('Error selling tokens:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to sell tokens',
      error: error.message
    });
  }
});

/**
 * @route GET /api/transactions/:hash
 * @desc Get transaction status by hash
 */
router.get('/:hash', async (req, res) => {
  try {
    // In a real implementation, this would check transaction status on-chain
    // For now, return mock data
    res.json({
      hash: req.params.hash,
      status: 'completed',
      blockNumber: Math.floor(Math.random() * 1000000),
      timestamp: new Date(),
      from: '0x' + Math.random().toString(16).substring(2, 42),
      to: '0x' + Math.random().toString(16).substring(2, 42),
      value: Math.random() * 10,
      gasUsed: Math.floor(Math.random() * 1000000)
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Failed to fetch transaction' });
  }
});

module.exports = router; 