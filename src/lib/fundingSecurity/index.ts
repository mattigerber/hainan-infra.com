/**
 * FundingSecurity Module
 * 
 * Provides security features for ticket purchases:
 * - On-chain contract address verification (prevents supply chain attacks)
 * - Checksum validation (defense-in-depth against address tampering)
 * - Registry-based contract resolution
 * 
 * All addresses go through dual validation:
 * 1. Loaded from JSON (potentially compromised source)
 * 2. Verified against on-chain registry (authoritative source)
 * 3. Optional checksum verification for additional safety
 */

export {
  projectRegistryAbi,
  calculateAddressChecksum,
  getProjectIdHash,
  validateContractAddressFromRegistry,
  validateContractWithChecksumFromRegistry,
  getTicketContractFromRegistry,
} from "./contractValidation";
