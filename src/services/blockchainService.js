// Mock blockchain service for development
const mockTokens = [
  {
    id: '1',
    name: 'Doge TON',
    symbol: 'DTON',
    iconUrl: 'https://placekitten.com/48/48',
    price: 0.00145,
    marketCap: '1.5M',
    change24h: 12.5,
    launchStatus: 'live',
    owned: 1000,
    tokenAddress: '0x123...456',
  },
  {
    id: '2',
    name: 'Pepe TON',
    symbol: 'PTON',
    iconUrl: 'https://placekitten.com/50/50',
    price: 0.00089,
    marketCap: '2.1M',
    change24h: -5.2,
    launchStatus: 'live',
    progress: 75,
    tokenAddress: '0x789...012',
  },
  {
    id: '3',
    name: 'Moon TON',
    symbol: 'MTON',
    iconUrl: 'https://placekitten.com/52/52',
    price: 0.00234,
    marketCap: '500K',
    change24h: 45.8,
    launchStatus: 'upcoming',
    progress: 25,
    tokenAddress: '0x345...678',
  },
  {
    id: '4',
    name: 'Rocket TON',
    symbol: 'RTON',
    iconUrl: 'https://placekitten.com/54/54',
    price: 0.00167,
    marketCap: '800K',
    change24h: -2.3,
    launchStatus: 'recentlyAdded',
    tokenAddress: '0x901...234',
  }
];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class BlockchainService {
  async getAllTokens() {
    // Simulate API delay
    await delay(500);
    return mockTokens;
  }

  async getTokensByOwner(address) {
    // Simulate API delay
    await delay(300);
    // Return only tokens marked as owned
    return mockTokens.filter(token => token.owned && token.owned > 0);
  }

  async buyTokens(walletAddress, tokenAddress, amount) {
    // Simulate transaction delay
    await delay(1500);
    return { success: true };
  }

  async sellTokens(walletAddress, tokenAddress, amount, sellAll) {
    // Simulate transaction delay
    await delay(1500);
    return { success: true };
  }
}

export default new BlockchainService();