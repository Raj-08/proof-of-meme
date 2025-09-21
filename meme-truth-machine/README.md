# Welcome to your Lovable project
# Welcome to your Lovable project

<p align="center">
  <img src="./public/logo.png" alt="Meme Truth Machine logo" width="200" />
</p>

### 1 Meme = 1 Coin

A meme is more than a picture—it’s a unique fingerprint of pixels and meaning. We bind each meme’s semantic identity to a single on-chain account so the same meme maps to the same coin.

### What makes a meme a meme?

- **Pixels**: An image is just hundreds of thousands of pixels (numbers). To a computer, copies of the same meme look identical: the same numbers.
- **Problem**: Multiple copies produce confusion—what’s the “real” one?
- **Our fix**: We turn a meme into a stable, content-addressed identity using AI vector embeddings and cryptographic hashing.

### How it works (end-to-end)

1. **Submit**: Frontend sends image vector + meme text to the server (`POST /api/process-meme`).
2. **Vector embeddings**:
   - Image: client provides `imageVector`.
   - Text: server requests an embedding from OpenAI.
3. **Normalize + combine**: We L2-normalize both vectors and concatenate them to form a unified semantic vector.
4. **Hashing**:
   - `image_hash` = SHA-256(imageVector)
   - `text_hash` = SHA-256(textEmbedding)
   - `meme_hash` = SHA-256(combinedVector) ← the meme’s semantic fingerprint
5. **Deterministic PDA** (Solana): The meme account address is derived exactly as the program expects:
   - Seeds: `[b"meme", meme_hash]` (32 bytes)
   - PDA: `Pubkey::find_program_address([b"meme", meme_hash], program_id)`
   - Result: The same meme always maps to the same on-chain account.
6. **On-chain register**: We call the Anchor instruction `register_meme` with:
   - `meme_hash`, `image_hash`, `text_hash` (all `[u8; 32]`)
   - `verdict` (string), `canon_score` (u32), `pumpfun_ca` (string), `metadata_uri` (string)
7. **Verify later**: Anyone can recompute the hashes from the content and derive the same PDA to confirm originality/identity.

### Why this ensures “1 Meme = 1 Coin”

- **Same content → same vector → same hash → same PDA**. Duplicates collapse to the same on-chain account.
- **Immutable address**: The account address is derived from content, not from who submits it.

### Run it locally (testnet)

Prereqs: Node.js, Solana CLI, Anchor CLI, OpenAI API key.

1) Configure env in `server/.env`:

```
OPENAI_API_KEY=your_openai_key
RPC_URL=https://api.testnet.solana.com
SOLANA_WALLET=${HOME}/.config/solana/id.json
PORT=3001
```

2) Fund your test wallet and deploy:

```
solana-keygen new -o ${HOME}/.config/solana/id.json
solana airdrop 5 --url testnet
cd hashmeme
anchor build
anchor deploy --provider.cluster testnet
```

3) Start the server and app:

```
cd ../server
npm i
npm run dev

# in another terminal (project root)
npm i
npm run dev
```

Health check: `GET http://localhost:3001/api/health` → `{ "status": "ok" }`

### API (server)

- **POST** `/api/process-meme`
  - **body**: `{ text: string, imageVector: number[], imageHash: string, pumpfunCa?: string, metadataUri?: string }`
  - **returns**: `{ pda, bump, transaction, textHash, combinedHash, ... }`

This pipeline proves meme identity with AI + crypto and anchors it on-chain—so the meme’s coin is the meme.

## Project info

**URL**: https://lovable.dev/projects/a8250025-768d-42e0-9fcc-7be21e4b446b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a8250025-768d-42e0-9fcc-7be21e4b446b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a8250025-768d-42e0-9fcc-7be21e4b446b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
