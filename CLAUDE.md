# Project Knowledge

**PURPOSE**: Technical reference and general project information for Claude AI assistant.
This file contains PERMANENT project knowledge, architecture, and development patterns that Claude needs to understand the codebase. Do NOT include temporary tasks, session priorities, or planning here - those belong in DEVELOPMENT_PLAN.md.

## Project Overview

ProDefi is a Solidity-based prediction platform built on Ethereum using the Foundry framework. The project implements a sports prediction system where users can purchase prediction cards (cartones) as ERC1155 tokens and submit predictions for games and tournament winners.

## Core Architecture

### Smart Contracts

- **Carton.sol**: ERC1155 contract for prediction cards with role-based access control
  - Implements minting, burning, pausing functionality
  - Multi-asset purchase support: ETH via `buyCarton()` and ERC20 via `buyCartonWithToken()`
  - **Treasury Integration**: Auto-deposits sales to Treasury contract when configured
  - Security: ReentrancyGuard protection, SafeERC20 for token operations
  - Uses OpenZeppelin's AccessControl for role management
  - Roles: DEFAULT_ADMIN_ROLE, URI_SETTER_ROLE, PAUSER_ROLE, MINTER_ROLE
  - Automatic token ownership tracking via `_update()` override

- **Predictions.sol**: Main prediction logic contract
  - Manages game predictions and winner predictions
  - Implements point calculation system for predictions
  - Handles submission deadlines and result validation
  - Calculates total points including both game and winner predictions
  - Enhanced with O(1) position lookup via `tokenPositions` mapping

- **Treasury.sol**: Multi-asset prize pool management and distribution contract
  - **Multi-asset support**: Manages ETH and ERC20 (USDC, etc) prize pools per tournament
  - Prize pools tracked per `(tournamentId, token)` - address(0) = ETH
  - Role-based access control (FUND_DEPOSITOR_ROLE, TOURNAMENT_MANAGER_ROLE)
  - **Tournament Lifecycle**: `closeTournament()` snapshots pool, freezes deposits/claims
  - Core functions: `depositFromSales()`, `depositFromSalesERC20()`, `setPrizeDistribution()`, `claimPrize()`, `closeTournament()`
  - Users can claim prizes for multiple assets in same tournament (ETH + USDC)
  - Security: SafeERC20 for token transfers, checks-effects-interactions pattern, snapshot-based fairness
  - Integrates with both Carton and Predictions contracts
  - Uses efficient integer division for prize calculations

### Key Features

1. **Multi-asset Carton Purchase**:
   - Buy with ETH via `buyCarton()`
   - Buy with ERC20 (USDC, etc) via `buyCartonWithToken()`
   - Automatic Treasury deposit on each purchase
2. **Game Predictions**: Users predict scores for 4 games
3. **Winner Predictions**: Users predict top 4 teams in tournament
4. **Point System**:
   - Game predictions: Base 7 points minus goal difference, +2 for correct outcome
   - Winner predictions: 19 points (1st), 16 points (2nd), 10 points (3rd/4th)
5. **Leaderboard**: Owner can set final positions based on total points
6. **Multi-asset Prize Pool Management**:
   - Treasury system handles ETH and ERC20 deposits per tournament
   - Auto-deposit from Carton sales (when configured)
   - Separate prize distributions per asset type
   - Tournament closing snapshots prize pool for fairness
7. **Role-based Prize Claims**: Users claim prizes based on final token positions
   - Can claim multiple assets (ETH + USDC) for same tournament
   - Claims require tournament to be closed (ensures fair distribution)

## Common Development Commands

### Build and Test
```bash
# Build the project
forge build

# Run all tests
forge test

# Run tests with verbosity (shows console.log output)
forge test -vvv

# Run specific test file
forge test --match-contract PredictionsTest

# Run specific test function
forge test --match-test testSubmitAndReadPicks
```

### Formatting and Analysis
```bash
# Format Solidity code
forge fmt

# Create gas snapshots
forge snapshot

# Check contract size
forge build --sizes
```

### Local Development
```bash
# Start local Ethereum node
anvil

# Deploy to local network
forge script script/Deploy.s.sol --fork-url http://localhost:8545 --broadcast

# Extract ABIs after deployment (for frontend integration)
forge inspect Carton abi --format-json > frontend/src/lib/contracts/carton-abi.json
forge inspect Predictions abi --format-json > frontend/src/lib/contracts/predictions-abi.json
forge inspect Treasury abi --format-json > frontend/src/lib/contracts/treasury-abi.json
```

## Development Setup

1. The project uses Solidity 0.8.27 with OpenZeppelin contracts
2. Tests are written using Foundry's testing framework
3. Uses forge-std for testing utilities
4. OpenZeppelin contracts are in lib/openzeppelin-contracts/

## Project Structure (Monorepo)

### Smart Contracts (Root Directory)
- `src/`: Main contract source files
- `test/`: Test files (*.t.sol) - 106 tests passing
- `script/`: Deployment scripts with full Treasury integration
- `lib/`: Dependencies (forge-std, openzeppelin-contracts)
- `foundry.toml`: Foundry configuration
- `out/`: Compiled artifacts (ABIs to copy to frontend)

### Frontend (`/frontend/`)
- `src/routes/`: TanStack Router pages (/, /predictions, /leaderboard)
- `src/components/`: React components (shadcn/ui + custom)
- `src/lib/`: Utilities, contracts configuration, Wagmi setup
- `package.json`: Frontend dependencies (Vite, React, TypeScript, Wagmi, RainbowKit)

#### Admin (dev-only)
- Route: `/admin/dev` in `frontend/src/routes/admin.dev.tsx`.
- Visibility: only in development (`import.meta.env.DEV`). In production it renders a disabled message.
- Navbar: dev-only link in `frontend/src/routes/__root.tsx` guarded by `import.meta.env.DEV`.
- Owner actions (Predictions): setTeamsHash, freezeTeamsHash, setSubmissionDeadline.
- Uses Wagmi read/write hooks with polling and toast notifications.

#### Teams utilities & hashing
- Type: `Team = { id: number; name: string }` in `frontend/src/lib/teams.ts`.
- `serializeTeams(teams)`: `${id}:${normalizedName}` per line, sorted asc by id.
- `computeTeamsHash(teams)`: keccak256 of serialization via viem.
- Lookups:
  - `teamsById: Record<number, string>` derived once from `teams` for O(1) access.
  - `indexTeamsById(list)` to memoize custom lists (use with `useMemo`).
  - `getTeamNameById(id, list?)` exists but prefer map for bulk rendering.

##### Usage examples

Static (canonical teams):

```ts
import { teamsById } from '@/lib/teams'

const name = teamsById[12] ?? 'Unknown'
const names = ids.map((id) => teamsById[id] ?? 'Unknown')
```

Dynamic list (from props/API) — build the index once per change with `useMemo`:

```tsx
import { useMemo } from 'react'
import { indexTeamsById, type Team } from '@/lib/teams'

function TeamsList({ teams, ids }: { teams: Team[]; ids: number[] }) {
  const byId = useMemo(() => indexTeamsById(teams), [teams])

  return (
    <ul>
      {ids.map((id) => (
        <li key={id}>{byId[id] ?? 'Unknown'}</li>
      ))}
    </ul>
  )
}
```

Evitar recrear el índice en cada render (no `teams.map(...)` inline). Siempre memoizar con `useMemo` si la lista es dinámica.

## Testing Patterns

Tests use Foundry's testing framework with:
- `vm.prank()` for simulating different users
- `vm.expectRevert()` for testing failure cases
- `vm.warp()` for time manipulation
- Custom setup functions and modifiers

## Current Status (October 14, 2025)

### Completed Components

**Smart Contracts (106 tests passing):**
- **Carton.sol**: ERC1155 prediction cards with multi-asset purchase system (35 tests)
  - ETH purchase via `buyCarton()`, ERC20 purchase via `buyCartonWithToken()`
  - **Automatic Treasury integration**: Auto-deposits sales to Treasury on each purchase
  - Security: ReentrancyGuard, SafeERC20, low-level calls for ETH transfers
  - Enhanced with `getUserTokens()` function for efficient user token tracking
  - Automatic token ownership tracking via `_update()` override
  - Admin functions: `setTreasuryAddress()`, `setActiveTournament()`, `setAcceptedToken()`

- **Predictions.sol**: Game predictions, winner predictions, point calculation, O(1) position lookups (19 tests)

- **Treasury.sol**: Multi-asset prize pool management with tournament lifecycle (52 tests)
  - **Complete ERC20 support**: Manages ETH and ERC20 (USDC, etc) prize pools per tournament
  - **Tournament lifecycle management**: `closeTournament()` snapshots pool, freezes deposits
  - Separate prize distributions per asset type
  - SafeERC20 for secure token operations
  - Users can claim multiple assets for same tournament
  - Claims gated to closed tournaments (prevents unfair late deposits)
  - FUND_DEPOSITOR_ROLE granted to Carton, TOURNAMENT_MANAGER_ROLE for closing
  - **Critical bug fixed**: Late deposits no longer affect earlier claimants

- **View Functions**: `getPrizePool()`, `getUserPrizeAmount()`, `hasUserClaimed()`, `getUserTokens()`
- **Complete integration**: Carton → Treasury → Predictions flow working seamlessly
- **Deployment**: Full setup script with Treasury integration, role configuration, and lifecycle support

**Frontend (Full Web3 Integration):**
- **Vite + React** + TypeScript + Tailwind CSS + shadcn/ui
- **TanStack Router**: Updated to latest non-deprecated plugin (@tanstack/router-plugin)
- **Web3 Integration**: Wagmi + RainbowKit + TanStack Query
- **Deployed Contracts**: Working on Anvil localhost:8545 with real transactions
- **Working Features**:
  - Buy carton transactions with loading states and toast notifications
  - Buy carton with USDC (allowance + approve flow)
  - Real-time ETH balance display
  - Real-time USDC balance display
  - **Show owned cartones**: Displays user's NFT collection with automatic updates
  - **Polling updates**: 10-second refresh + focus-based refresh
  - **Admin (dev-only)**: Owner actions at `/admin/dev` with dev-only navbar link
  - **Teams lookup optimization**: `teamsById` map for O(1) name-by-id
  - **Game predictions UI**: Complete form with 6 games, working submission to contract
  - **Winner predictions UI**: TeamWinnerSelector component with duplicate prevention
  - **Prize pools**: ETH + USDC pools displayed from Treasury

### Current Phase: Prediction System
- ✅ **Show owned cartones**: Complete with real-time updates
- ✅ **Game predictions**: Complete implementation with working contract submission
- ✅ **Winner predictions UI + submit**: State management, form UI, contract submission wired
- ✅ **Display real prize pool data**: From Treasury contract
- **Prediction display**: Show user's submitted predictions

## Learning Context

**IMPORTANT**: The user is a senior developer learning and practicing Solidity development. This is an educational project where:
- Claude should provide concise, technical guidance without over-explaining basics
- Code should be implemented step-by-step but assume strong programming knowledge
- TODOs are intentionally left as learning exercises
- Focus on Solidity-specific patterns and Web3 integration concepts
- Encourage experimentation with new blockchain/smart contract concepts

**CRITICAL WORKFLOW**: Senior dev wants to learn by doing, not watching:
- User gives the topic/feature they want to implement
- Claude provides technical guidance and architectural direction
- User implements the code themselves following the guidance
- Claude explains Solidity/Web3 specific concepts when needed
- **NEVER implement code directly unless explicitly asked**
- **NEVER paste complete code snippets for the user to copy**
- **NEVER dictate line-by-line changes with exact code**
- **ALWAYS guide the user to write the code themselves**
- **Explain WHAT needs to be done and WHY, not HOW character-by-character**
- Provide architectural guidance: "You need to add X property to handle Y because Z"
- Point to examples in the codebase: "Look at how we did it in file.ts:123"
- Explain concepts: "ERC20 requires approve() before transfer because..."
- Be concise, assume programming competence, focus on blockchain-specific learnings
- **User will interrupt tool use if Claude tries to write code directly**
- **If user explicitly says "do it" or similar, ONLY THEN write the code yourself**

## Frontend Tech Stack

**Core Framework:**
- Vite + React + TypeScript
- TanStack Router (type-safe file-based routing)
- Tailwind CSS + shadcn/ui components

**Web3 Integration:**
- Wagmi v2 (React hooks for Ethereum)
- Viem (TypeScript Ethereum library)  
- RainbowKit (Wallet connection UI)
- TanStack Query (State management)

**Development:**
- ESLint + TypeScript strict mode
- Anvil local development chain (localhost:8545)
- Hot reload and fast refresh
- Sonner for toast notifications


## Important Notes

- The project is in Spanish with extensive comments
- Uses ERC1155 for prediction cards (cartones)
- Implements complex point calculation logic
- Owner-controlled result setting and position management
- Submission deadlines enforced for predictions

## Instrucciones para Claude

- Al buscar archivos, **siempre excluir `node_modules`** y `lib/` salvo que se pida explícitamente.
- Si no se encuentra un archivo con el nombre aproximado que dio el usuario, intentar variantes antes de responder que no existe.

## Related Documents

- See DEVELOPMENT_PLAN.md for active tasks and priorities.
- See AGENTS.md for contributor workflow and repo conventions.
- See TECH_RESEARCH.md for technology evaluations and research.
