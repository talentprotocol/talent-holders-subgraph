# TalentProtocol Token Transfers Subgraph

A GraphQL subgraph that indexes and tracks TalentProtocol token transfers on the Base network, providing real-time data about token balances, transfer history, and user activity.

## Overview

This subgraph monitors the TalentProtocol token contract deployed on Base network and indexes all transfer events, maintaining comprehensive records of:
- User token balances
- Historical balance changes with timestamps
- Complete transfer transaction details

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- The Graph CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd talent-token-transfers
```

2. Install dependencies:
```bash
yarn install
```

3. Generate types from the GraphQL schema and ABIs:
```bash
yarn codegen
```

4. Build the subgraph:
```bash
yarn build
```

## Development

### Available Scripts

- `yarn codegen` - Generate TypeScript types from GraphQL schema and contract ABIs
- `yarn build` - Build the subgraph for deployment
- `yarn test` - Run unit tests using Matchstick
- `yarn deploy` - Deploy to The Graph Studio
- `yarn create-local` - Create subgraph on local Graph Node
- `yarn deploy-local` - Deploy to local Graph Node
- `yarn remove-local` - Remove subgraph from local Graph Node

### Local Development

For local development, you can run a local Graph Node using Docker:

```bash
docker-compose up
```

Then deploy to your local node:
```bash
yarn create-local
yarn deploy-local
```

### Testing

Run the test suite:
```bash
yarn test
```

Tests are located in the `tests/` directory and use the Matchstick testing framework.

## Contract Information

- **Network**: Base
- **Contract Address**: `0x9a33406165f562E16C3abD82fd1185482E01b49a`
- **Start Block**: `21118758`
- **ABI**: Located in `abis/TalentProtocolToken.json`

## GraphQL Schema

### Entities

#### User
Represents a token holder with their current balance.

```graphql
type User @entity {
  id: ID!                 # User's address in hex format
  address: Bytes!         # User's Ethereum address
  balance: BigInt!        # Current token balance
}
```

#### UserDateBalance
Tracks balance changes over time for historical analysis.

```graphql
type UserDateBalance @entity {
  id: ID!                 # User's address in hex format
  user: User!             # Reference to the User entity
  date: BigInt!           # Timestamp of the balance change
  oldBalance: BigInt!     # Balance before the change
  currentBalance: BigInt! # Balance after the change
}
```

#### Transfer
Immutable record of all token transfer events.

```graphql
type Transfer @entity(immutable: true) {
  id: Bytes!              # Unique ID (transaction hash + log index)
  from: Bytes!            # Sender address
  to: Bytes!              # Recipient address
  value: BigInt!          # Amount transferred
  blockNumber: BigInt!    # Block number
  blockTimestamp: BigInt! # Block timestamp
  transactionHash: Bytes! # Transaction hash
}
```

## Example Queries

### Get all users with their balances
```graphql
{
  users {
    id
    address
    balance
  }
}
```

### Get transfer history for a specific user
```graphql
{
  transfers(where: { from: "0x..." }) {
    id
    to
    value
    blockTimestamp
  }
}
```

### Get balance history for a user
```graphql
{
  userDateBalances(where: { user: "0x..." }) {
    date
    oldBalance
    currentBalance
  }
}
```

## Handler Logic

The `handleTransfer` function in `src/talent-protocol-token.ts` processes transfer events and:

1. **Creates Transfer Records**: Stores immutable transfer event data
2. **Updates User Balances**: Maintains current token balances for all users
3. **Tracks Balance History**: Records balance changes with timestamps
4. **Handles Edge Cases**: Manages insufficient balance scenarios gracefully

### Key Features

- **Automatic User Creation**: New users are automatically created when they first receive tokens
- **Balance Validation**: Ensures users have sufficient balance before deducting tokens
- **Historical Tracking**: Maintains complete balance change history
- **Transaction Metadata**: Captures block numbers, timestamps, and transaction hashes

## Deployment

### The Graph Studio

1. Authenticate with The Graph CLI:
```bash
graph auth --studio YOUR_DEPLOY_KEY
```

2. Deploy the subgraph:
```bash
yarn deploy
```

### Local Graph Node

1. Start the local Graph Node:
```bash
docker-compose up
```

2. Create and deploy:
```bash
yarn create-local
yarn deploy-local
```

## Project Structure

```
talent-token-transfers/
├── abis/                          # Contract ABIs
│   └── TalentProtocolToken.json
├── src/                           # Subgraph handlers
│   └── talent-protocol-token.ts
├── tests/                         # Unit tests
│   ├── talent-protocol-token.test.ts
│   └── talent-protocol-token-utils.ts
├── generated/                     # Generated code (created after codegen)
├── docker-compose.yml             # Local Graph Node setup
├── networks.json                  # Network configurations
├── package.json                   # Dependencies and scripts
├── schema.graphql                 # GraphQL schema definition
├── subgraph.yaml                  # Subgraph manifest
└── tsconfig.json                  # TypeScript configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is UNLICENSED.

## Support

For questions, issues, or contributions, please refer to the project's issue tracker or contact the development team. 