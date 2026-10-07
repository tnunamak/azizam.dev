// Matches gateway/product_identity.json on gateway main; all site naming uses this constant.
export const PRODUCT_NAME = 'Azizam';
export const PUBLIC_SOURCE = false; // Flip when the gateway repository becomes public.
export const GITHUB_URL: string | null = PUBLIC_SOURCE ? 'https://github.com/tnunamak/azizam' : null;
export const DESCRIPTION = 'Keep your favorite frontend. Keep your favorite backend. Azizam connects your existing apps and agents to local AI engines and explicitly chosen remote providers.';
export const QUICKSTART = `git clone https://github.com/tnunamak/azizam.git
cd azizam
docker compose up -d

# Open http://127.0.0.1:5000/setup
# Claim the owner account and get your first app key.
# Connect your existing engine in Gateway → Engines.`;
