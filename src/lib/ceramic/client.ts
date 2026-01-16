import { CeramicClient } from "@ceramicnetwork/http-client";
import { ComposeClient } from "@composedb/client";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

// Ceramic network configuration
const CERAMIC_URL = process.env.NEXT_PUBLIC_CERAMIC_URL || "https://ceramic-temp.hirenodes.io";

// Singleton instances
let ceramicClient: CeramicClient | null = null;
let composeClient: ComposeClient | null = null;

/**
 * Initialize and get the Ceramic client
 */
export function getCeramicClient(): CeramicClient {
  if (!ceramicClient) {
    ceramicClient = new CeramicClient(CERAMIC_URL);
  }
  return ceramicClient;
}

/**
 * Initialize and get the ComposeDB client
 * This requires the runtime composite definition
 */
export function getComposeClient(): ComposeClient {
  if (!composeClient) {
    getCeramicClient();

    // Try to load the runtime composite if it exists
    // The definition will be generated after running `npm run ceramic:setup`
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const { definition } = require("./__generated__/definition.json");
      composeClient = new ComposeClient({
        ceramic: CERAMIC_URL,
        definition,
      });
    } catch {
      // Composite not generated yet, create a placeholder
      // This will fail at runtime until you run the setup script
      console.warn("Ceramic composite not found. Run 'npm run ceramic:setup' to initialize.");
      composeClient = new ComposeClient({
        ceramic: CERAMIC_URL,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        definition: {} as any,
      });
    }
  }
  return composeClient;
}

/**
 * Authenticate a user with Ceramic using their Ethereum wallet
 * This creates a DID (Decentralized Identifier) for the user
 */
export async function authenticateWithCeramic(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereumProvider: any
): Promise<DID> {
  const ceramic = getCeramicClient();

  // Get accounts from the provider
  const accounts = await ethereumProvider.request({
    method: "eth_requestAccounts",
  });

  if (!accounts || accounts.length === 0) {
    throw new Error("No Ethereum accounts available");
  }

  // Create a DID for the user
  // In production, you would use did-session for proper auth
  // This is a simplified version for development

  // For now, we'll use a temporary seed for the DID
  // In production, use proper wallet-based authentication
  const seed = new Uint8Array(32);
  const provider = new Ed25519Provider(seed);
  const did = new DID({
    provider,
    resolver: getKeyResolver(),
  });

  await did.authenticate();
  ceramic.did = did;

  return did;
}

/**
 * Authenticate with a seed (for development/testing)
 */
export async function authenticateWithSeed(seedString?: string): Promise<DID> {
  const ceramic = getCeramicClient();

  // Use provided seed or generate a default one
  const seed = seedString
    ? fromString(seedString, "base16")
    : new Uint8Array(32);

  const provider = new Ed25519Provider(seed);
  const did = new DID({
    provider,
    resolver: getKeyResolver(),
  });

  await did.authenticate();
  ceramic.did = did;

  return did;
}

/**
 * Check if the user is authenticated with Ceramic
 */
export function isAuthenticated(): boolean {
  const ceramic = getCeramicClient();
  return !!ceramic.did?.authenticated;
}

/**
 * Get the current user's DID
 */
export function getCurrentDID(): string | null {
  const ceramic = getCeramicClient();
  return ceramic.did?.id || null;
}
