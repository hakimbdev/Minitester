const jwt = require('jsonwebtoken');
const { TonClient } = require('ton');

const authMiddleware = async (req, res, next) => {
  try {
    const { signature, message, walletAddress } = req.headers;
    
    if (!signature || !message || !walletAddress) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify TON wallet signature
    const client = new TonClient({
      endpoint: process.env.NODE_ENV === 'production' 
        ? process.env.TON_MAINNET_ENDPOINT 
        : process.env.TON_TESTNET_ENDPOINT,
      apiKey: process.env.TON_API_KEY
    });

    const isValid = await client.verifySignature(
      Buffer.from(signature, 'hex'),
      Buffer.from(message),
      walletAddress
    );

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Generate JWT token for subsequent requests
    const token = jwt.sign({ walletAddress }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    req.user = { walletAddress };
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};