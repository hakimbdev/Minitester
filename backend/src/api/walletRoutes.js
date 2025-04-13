const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');
const Token = require('../models/Token');

/**
 * @route GET /api/wallet/:address/info
 * @desc Get wallet information
 */
router.get('/:address/info', async (req, res) => {
  try {
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
router.get('/:address/tokens', async (req, res) => {
  try {
    const address = req.params.address;
    
    // Get tokens created by this address
    const createdTokens = await Token.findByOwner(address);
    
    // In a real implementation, you would also check token balances
    // for other tokens the user might own but didn't create
    
    // Mock response with some sample data
    const tokenBalances = createdTokens.map(token => ({
      token: token,
      balance: token.ownerAddress === address ? token.totalSupply : 0,
      value: token.price * (token.ownerAddress === address ? token.totalSupply : 0)
    }));
    
    res.json(tokenBalances);
  } catch (error) {
    console.error('Error fetching wallet tokens:', error);
    res.status(500).json({ message: 'Failed to fetch wallet tokens' });
  }
});

/**
 * @route GET /api/wallet/:address/token/:tokenAddress/balance
 * @desc Get token balance for a specific token
 */
router.get('/:address/token/:tokenAddress/balance', async (req, res) => {
  try {
    const { address, tokenAddress } = req.params;
    
    // Get token information
    const token = await Token.findByContractAddress(tokenAddress);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    
    // Get token balance from blockchain
    const balance = await blockchainService.getTokenBalance(address, tokenAddress);
    
    res.json({
      token,
      balance,
      value: token.price * balance
    });
  } catch (error) {
    console.error('Error fetching token balance:', error);
    res.status(500).json({ message: 'Failed to fetch token balance' });
  }
});

module.exports = router; 