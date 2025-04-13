/**
 * Service for interacting with the blockchain backend
 */
class BlockchainService {
  constructor() {
    this.apiUrl = 'http://localhost:5000/api';
    this.useMockData = true; // Set to true to use mock data instead of API calls
  }

  /**
   * Get all tokens from the API
   * @returns {Promise<Array>} List of tokens
   */
  async getAllTokens() {
    if (this.useMockData) {
      // Return mock data
      return Promise.resolve([
        {
          id: '1',
          name: 'TonDoge',
          symbol: 'TDOGE',
          iconUrl: 'https://placehold.co/100x100',
          price: 0.00032,
          marketCap: '$1.2M',
        },
        {
          id: '2',
          name: 'TONPepe',
          symbol: 'PEPE',
          iconUrl: 'https://placehold.co/100x100',
          price: 0.00059,
          marketCap: '$3.5M',
        },
      ]);
    }

    try {
      const response = await fetch(`${this.apiUrl}/tokens`);
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw error;
    }
  }

  /**
   * Get token details by ID
   * @param {string} id - Token ID
   * @returns {Promise<Object>} Token details
   */
  async getTokenById(id) {
    if (this.useMockData) {
      // Return mock data
      return Promise.resolve({
        id,
        name: 'TonDoge',
        symbol: 'TDOGE',
        iconUrl: 'https://placehold.co/100x100',
        price: 0.00032,
        marketCap: '$1.2M',
        description: 'A community-driven meme token on TON blockchain',
      });
    }

    try {
      const response = await fetch(`${this.apiUrl}/tokens/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    }
  }

  /**
   * Create a new token
   * @param {Object} tokenData - Token data
   * @param {string} ownerAddress - Owner's wallet address
   * @returns {Promise<Object>} Created token
   */
  async createToken(tokenData, ownerAddress) {
    if (this.useMockData) {
      // Return mock data
      return Promise.resolve({
        ...tokenData,
        id: Math.random().toString(36).substring(2, 15),
        ownerAddress,
        tokenAddress: `EQ${Math.random().toString(36).substring(2, 30)}`,
        success: true,
      });
    }

    try {
      const response = await fetch(`${this.apiUrl}/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tokenData,
          ownerAddress,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create token');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  /**
   * Get tokens owned by an address
   * @param {string} address - Wallet address
   * @returns {Promise<Array>} List of tokens with balances
   */
  async getTokensByOwner(address) {
    if (this.useMockData) {
      // Return mock data
      return Promise.resolve([
        {
          id: '1',
          name: 'TonDoge',
          symbol: 'TDOGE',
          iconUrl: 'https://placehold.co/100x100',
          price: 0.00032,
          balance: 5000000,
        },
        {
          id: '2',
          name: 'TONPepe',
          symbol: 'PEPE',
          iconUrl: 'https://placehold.co/100x100',
          price: 0.00059,
          balance: 2500000,
        },
      ]);
    }

    try {
      const response = await fetch(`${this.apiUrl}/wallet/${address}/tokens`);
      if (!response.ok) {
        throw new Error('Failed to fetch wallet tokens');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching wallet tokens:', error);
      throw error;
    }
  }

  /**
   * Transfer tokens between addresses
   * @param {string} fromAddress - Sender's address
   * @param {string} toAddress - Recipient's address
   * @param {string} tokenAddress - Token contract address
   * @param {string} amount - Amount to transfer
   * @returns {Promise<Object>} Transaction result
   */
  async transferTokens(fromAddress, toAddress, tokenAddress, amount) {
    if (this.useMockData) {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return Promise.resolve({
        success: true,
        transactionHash: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        fromAddress,
        toAddress,
        tokenAddress,
        amount,
      });
    }

    try {
      const response = await fetch(`${this.apiUrl}/transactions/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress,
          toAddress,
          tokenAddress,
          amount,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to transfer tokens');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error transferring tokens:', error);
      throw error;
    }
  }

  /**
   * Buy tokens with TON
   * @param {string} buyerAddress - Buyer's wallet address
   * @param {string} tokenAddress - Token contract address
   * @param {string} tonAmount - Amount of TON to spend
   * @returns {Promise<Object>} Transaction result
   */
  async buyTokens(buyerAddress, tokenAddress, tonAmount) {
    if (this.useMockData) {
      // Log the request
      console.log('Buy tokens request:', { buyerAddress, tokenAddress, tonAmount });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mock successful transaction
      return Promise.resolve({
        success: true,
        transactionHash: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        buyerAddress,
        tokenAddress,
        tonAmount,
        tokenAmount: (parseFloat(tonAmount) / 0.00032).toString(), // Mock token price
      });
    }

    try {
      const response = await fetch(`${this.apiUrl}/transactions/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerAddress,
          tokenAddress,
          tonAmount,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to buy tokens');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error buying tokens:', error);
      throw error;
    }
  }

  /**
   * Sell tokens for TON
   * @param {string} sellerAddress - Seller's wallet address
   * @param {string} tokenAddress - Token contract address
   * @param {string} tokenAmount - Amount of tokens to sell (optional if sellAll is true)
   * @param {boolean} sellAll - Whether to sell all available tokens
   * @returns {Promise<Object>} Transaction result
   */
  async sellTokens(sellerAddress, tokenAddress, tokenAmount, sellAll = false) {
    if (this.useMockData) {
      // Log the request
      console.log('Sell tokens request:', { sellerAddress, tokenAddress, tokenAmount, sellAll });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mock successful transaction
      return Promise.resolve({
        success: true,
        transactionHash: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        sellerAddress,
        tokenAddress,
        tokenAmount: sellAll ? 'all' : tokenAmount,
        tonAmount: sellAll ? '1.6' : (parseFloat(tokenAmount) * 0.00032).toString(), // Mock token price
      });
    }

    try {
      const response = await fetch(`${this.apiUrl}/transactions/sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerAddress,
          tokenAddress,
          tokenAmount,
          sellAll,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sell tokens');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error selling tokens:', error);
      throw error;
    }
  }

  /**
   * Get wallet information
   * @param {string} address - Wallet address
   * @returns {Promise<Object>} Wallet information
   */
  async getWalletInfo(address) {
    if (this.useMockData) {
      // Return mock data
      return Promise.resolve({
        address,
        balance: (Math.random() * 100).toFixed(2),
        transactions: [],
      });
    }

    try {
      const response = await fetch(`${this.apiUrl}/wallet/${address}/info`);
      if (!response.ok) {
        throw new Error('Failed to fetch wallet information');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      throw error;
    }
  }

  /**
   * Get TON balance for a wallet
   * @param {string} address - Wallet address
   * @returns {Promise<string>} TON balance
   */
  async getTONBalance(address) {
    if (this.useMockData) {
      // Return mock balance
      return Promise.resolve((Math.random() * 100).toFixed(2));
    }

    try {
      const info = await this.getWalletInfo(address);
      return info.balance || '0';
    } catch (error) {
      console.error('Error fetching TON balance:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new BlockchainService(); 