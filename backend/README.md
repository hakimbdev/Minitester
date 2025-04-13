# MemePad Backend

This is the backend for the MemePad application, which provides APIs for interacting with the TON blockchain and managing meme tokens.

## System Architecture

The backend follows a layered architecture:

1. **API Layer**: Express routes that handle HTTP requests
2. **Service Layer**: Business logic for token and blockchain operations
3. **Blockchain Layer**: Integration with TON blockchain
4. **Data Layer**: Token and transaction data storage

## Key Components

### API Routes

- `/api/tokens`: Endpoints for token management (create, list, get details)
- `/api/wallet`: Endpoints for wallet operations (balance, token holdings)
- `/api/transactions`: Endpoints for token transfers and transaction history

### Services

- `blockchainService.js`: Handles interactions with the TON blockchain
- Additional services for user management, authentication, etc. (to be implemented)

### Blockchain Integration

- `contractDeployer.js`: Utility for deploying smart contracts to TON
- `TokenContract.js`: Template for token smart contracts

## Blockchain Functionality

1. **Token Creation**:
   - Deploy a new token contract on TON blockchain
   - Initialize token with name, symbol, and total supply
   - Set creator as the owner

2. **Token Transfers**:
   - Transfer tokens between wallets
   - Check balances and approve transfers

3. **Wallet Integration**:
   - Connect with user wallets via TON Connect
   - Sign transactions and verify ownership

## Setup and Deployment

### Prerequisites

- Node.js 16+
- MongoDB (for a full implementation)
- TON API Key

### Environment Variables

Create a `.env` file with:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/memepad
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
TON_TESTNET_ENDPOINT=https://testnet.toncenter.com/api/v2/jsonRPC
TON_MAINNET_ENDPOINT=https://toncenter.com/api/v2/jsonRPC
TON_API_KEY=your_ton_api_key
```

### Installation

```bash
npm install
```

### Running

```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Token Endpoints

#### Create Token

```
POST /api/tokens
```

Request body:
```json
{
  "name": "TonDoge",
  "symbol": "TDOGE",
  "totalSupply": "100000000000",
  "ownerAddress": "EQCBszTNaBYaXRtWY_MjqR6Wn-_qvcvRZWYLdZ-6upPP-z3u",
  "description": "A community-driven meme token",
  "imageUrl": "https://example.com/image.png"
}
```

#### Get All Tokens

```
GET /api/tokens
```

#### Get Token Details

```
GET /api/tokens/:id
```

### Wallet Endpoints

#### Get Wallet Info

```
GET /api/wallet/:address/info
```

#### Get Wallet Tokens

```
GET /api/wallet/:address/tokens
```

### Transaction Endpoints

#### Transfer Tokens

```
POST /api/transactions/transfer
```

Request body:
```json
{
  "fromAddress": "EQCBszTNaBYaXRtWY_MjqR6Wn-_qvcvRZWYLdZ-6upPP-z3u",
  "toAddress": "EQBeIDoqSVSXqzE15UYQmikKRJ-h8iQBoaD1RbI5JJ6VDqGJ",
  "tokenAddress": "EQDVUOAvkCugHm6CQoJ7Bp9r9J5YjkFgBx_UNBdj69nVQZFI",
  "amount": "1000000000"
}
```

## Security Considerations

- API authentication and authorization
- Safe contract interactions
- Input validation
- Rate limiting
- Error handling and logging

## Future Improvements

- Add full MongoDB integration
- Implement user authentication
- Add WebSocket support for real-time updates
- Expand token functionality (staking, voting, etc.)
- Add comprehensive testing 