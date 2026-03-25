# Funding Security Module

This module provides security infrastructure for the ticket purchase system, preventing supply chain attacks and address tampering.

## Architecture

### Smart Contract Layer

- **contracts/FundingSecurity/ProjectRegistry.sol** — Authoritative on-chain registry for ticket sale contract addresses

### Frontend Layer

- **frontend/src/lib/fundingSecurity/** — Validation and security utilities

## Components

### 1. ProjectRegistry.sol Contract

Solidity smart contract deployed once to serve as the authoritative source for contract address mappings.

**Key Functions:**

- `registerProject(projectId, ticketContract)` — Register a new project
- `updateProject(projectId, newContract)` — Update an existing project's contract
- `getTicketContract(projectId)` — Read registered address for a project
- `verifyContractAddress(projectId, address)` — Verify if an address matches registry
- `verifyContractWithChecksum(projectId, address, checksum)` — Dual verification with checksum

### 2. contractValidation.ts

TypeScript module with validation functions and ABI definitions.

**Exports:**

- `projectRegistryAbi` — ABI for reading the registry contract
- `calculateAddressChecksum()` — Generate keccak256 checksum for addresses
- `getProjectIdHash()` — Hash project identifier for registry lookups
- `validateContractAddressFromRegistry()` — Verify address against registry
- `validateContractWithChecksumFromRegistry()` — Dual verification
- `getTicketContractFromRegistry()` — Fetch registered address

### 3. Security Flow

```
User clicks "Buy Ticket"
  ↓
Load contract address from JSON (potentially compromised)
  ↓
Calculate checksum of the address
  ↓
Query ProjectRegistry contract on-chain
  ↓
Does on-chain address match JSON address? ✓
Does on-chain checksum match local checksum? ✓
  ↓
✅ SAFE - Execute purchase
  ↓
❌ MISMATCH - Block transaction + show error
```

## Environment Setup

Add to `.env.local`:

```bash
NEXT_PUBLIC_PROJECT_REGISTRY_ADDRESS=0x...
```

## Usage in useOnchainTicketPortfolio

Before calling `executeBuyTicket()`, the validation automatically:

1. Resolves the contract address from project data
2. Queries the on-chain registry
3. Compares both the address and optional checksum
4. Blocks purchase if mismatch detected
5. Optionally falls back to registry if JSON is unavailable

## Security Properties

✅ **Prevents CDN compromise** — Malicious address injection detected on-chain  
✅ **Supply chain protection** — Registry is canonical source of truth  
✅ **Defense in depth** — Layer 1: checksum, Layer 2: registry verification  
✅ **No contract modifications needed** — Pure frontend validation layer  
✅ **Graceful degradation** — Works even if registry is temporarily unavailable

## Future Extensions

- Multi-sig ownership for registry contract
- Timelock for registry updates
- Contract address history/immutability
- Event monitoring for unauthorized changes
