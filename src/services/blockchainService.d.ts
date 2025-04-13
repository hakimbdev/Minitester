declare class BlockchainService {
  constructor();
  apiUrl: string;

  /**
   * Get all tokens from the API
   * @returns {Promise<Array>} List of tokens
   */
  getAllTokens(): Promise<any[]>;

  /**
   * Get token details by ID
   * @param {string} id - Token ID
   * @returns {Promise<Object>} Token details
   */
  getTokenById(id: string): Promise<any>;

  /**
   * Create a new token
   * @param {Object} tokenData - Token data
   * @param {string} ownerAddress - Owner's wallet address
   * @returns {Promise<Object>} Created token
   */
  createToken(tokenData: any, ownerAddress: string): Promise<any>;

  /**
   * Get tokens owned by an address
   * @param {string} address - Wallet address
   * @returns {Promise<Array>} List of tokens with balances
   */
  getTokensByOwner(address: string): Promise<any[]>;

  /**
   * Transfer tokens between addresses
   * @param {string} fromAddress - Sender's address
   * @param {string} toAddress - Recipient's address
   * @param {string} tokenAddress - Token contract address
   * @param {string} amount - Amount to transfer
   * @returns {Promise<Object>} Transaction result
   */
  transferTokens(fromAddress: string, toAddress: string, tokenAddress: string, amount: string): Promise<any>;

  /**
   * Buy tokens with TON
   * @param {string} buyerAddress - Buyer's wallet address
   * @param {string} tokenAddress - Token contract address
   * @param {string} tonAmount - Amount of TON to spend
   * @returns {Promise<Object>} Transaction result
   */
  buyTokens(buyerAddress: string, tokenAddress: string, tonAmount: string): Promise<any>;

  /**
   * Sell tokens for TON
   * @param {string} sellerAddress - Seller's wallet address
   * @param {string} tokenAddress - Token contract address
   * @param {string} tokenAmount - Amount of tokens to sell (optional if sellAll is true)
   * @param {boolean} sellAll - Whether to sell all available tokens
   * @returns {Promise<Object>} Transaction result
   */
  sellTokens(sellerAddress: string, tokenAddress: string, tokenAmount: string, sellAll?: boolean): Promise<any>;

  /**
   * Get wallet information
   * @param {string} address - Wallet address
   * @returns {Promise<Object>} Wallet information
   */
  getWalletInfo(address: string): Promise<any>;

  /**
   * Get TON balance for a wallet
   * @param {string} address - Wallet address
   * @returns {Promise<string>} TON balance
   */
  getTONBalance(address: string): Promise<string>;
}

declare const blockchainService: BlockchainService;
export default blockchainService; 