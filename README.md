# MemePad - TON Blockchain Meme Token Platform

MemePad is a decentralized platform for creating, launching, and trading meme tokens on the TON blockchain.

## System Architecture

The project consists of two main parts:

1. **Frontend**: A React-based web application built as a Telegram Mini App
2. **Backend**: A Node.js server that interfaces with the TON blockchain

## Features

- Create and launch meme tokens on TON blockchain
- Browse and discover new meme tokens
- Buy and sell tokens directly from the app
- Track token prices and portfolio value
- Connect with TON wallet for secure transactions

## Tech Stack

### Frontend
- React.js
- React Router
- TON Connect for wallet integration
- Telegram Mini Apps SDK

### Backend
- Node.js with Express
- TON SDK for blockchain interaction
- Smart contracts written in FunC
- RESTful API design

## System Design

### Frontend Components

The frontend is structured as a single-page application with the following main sections:

- **MemePad Page**: Main dashboard for browsing tokens
- **Token Detail Page**: View detailed information about a token
- **Create Token Page**: Interface for creating new tokens
- **My Tokens Page**: View tokens owned by the user
- **TON Connect Page**: Wallet connection interface

### Backend Components

The backend provides the following functionality:

- **API Layer**: RESTful endpoints for the frontend
- **Blockchain Service**: Interacts with TON blockchain
- **Contract Management**: Deploys and interacts with smart contracts
- **Data Storage**: Manages token metadata and user data

### Blockchain Integration

1. **Token Creation**:
   - User provides token details (name, symbol, supply)
   - Backend deploys a new token contract on TON
   - Token metadata is stored and linked to the contract address

2. **Wallet Integration**:
   - Users connect their TON wallets via TON Connect
   - Wallets sign transactions for security
   - Contract interactions require wallet authorization

3. **Token Transactions**:
   - Buying/selling tokens happens directly on-chain
   - Transactions are verified and confirmed on the blockchain
   - Real-time updates reflect blockchain state

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- TON wallet (for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/memepad.git
cd memepad
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

3. Access the application at `http://localhost:3000`

## Backend Developer Role

The backend developer will be responsible for:

1. **Smart Contract Development**:
   - Implementing token contracts in FunC
   - Testing and deploying contracts to TON testnet/mainnet
   - Ensuring contract security and efficiency

2. **Blockchain Integration**:
   - Building robust services to interact with TON blockchain
   - Managing on-chain data and state
   - Implementing transaction handling and confirmation

3. **API Development**:
   - Creating and maintaining RESTful endpoints
   - Implementing security measures
   - Optimizing performance for blockchain operations

4. **Database Design**:
   - Designing schemas for token metadata
   - Implementing efficient data storage and retrieval
   - Syncing on-chain and off-chain data

## Directory Structure

```
memepad/
├── src/                   # Frontend source code
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── services/          # Frontend services
│   ├── assets/            # Static assets
│   └── types/             # TypeScript type definitions
│
├── backend/               # Backend source code
│   ├── src/
│   │   ├── api/           # API routes
│   │   ├── blockchain/    # Blockchain utilities
│   │   ├── contracts/     # Smart contract templates
│   │   ├── models/        # Data models
│   │   ├── services/      # Business logic services
│   │   └── utils/         # Utility functions
│   │
│   ├── server.js          # Express server
│   └── README.md          # Backend documentation
│
├── public/                # Public assets
└── README.md              # Main documentation
```

## Security Considerations

- Smart contract auditing
- Secure wallet connection
- Input validation and sanitization
- Rate limiting to prevent abuse
- Proper error handling

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# Minizero
# Minitester
# Minitester
# Minitester
# Minitester
