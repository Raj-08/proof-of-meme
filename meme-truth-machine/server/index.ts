import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { PublicKey, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@project-serum/anchor';
import IDL from './idl/meme_program.json' assert { type: 'json' };
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const connection = new Connection(process.env.RPC_URL || 'https://api.testnet.solana.com');
const programId = new PublicKey('EWDGViEZrieLvQ544usdPVLazkaUdaVhBPAqoEG3HA7b');

const walletPath = process.env.SOLANA_WALLET || `${process.env.HOME}/.config/solana/id.json`;
if (!fs.existsSync(walletPath)) {
  throw new Error(`Wallet keypair file not found at ${walletPath}`);
}
const walletKeypair = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(walletPath, 'utf8')))
);
const wallet = new Wallet(walletKeypair);

const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
const program = new Program(IDL as any, programId, provider);

async function ensureWalletFunded() {
  const balance = await connection.getBalance(wallet.publicKey);
  if (balance < LAMPORTS_PER_SOL) {
    const sig = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sig);
  }
}

const MEME_SEED_PREFIX = 'meme';

function hashVector(vector: number[]): Buffer {
  return crypto.createHash('sha256').update(vector.join(',')).digest();
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/process-meme', async (req, res) => {
  try {
    const { text, imageVector, imageHash, pumpfunCa, metadataUri } = req.body;
    if (!text || !imageVector || !imageHash) return res.status(400).json({ error: 'Missing required fields' });

    await ensureWalletFunded();

    const embeddingResponse = await openai.embeddings.create({ input: text, model: 'text-embedding-3-small' });
    const textVector = embeddingResponse.data[0].embedding as number[];

    const normalizeVector = (vector: number[]) => {
      const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
      return vector.map(val => (magnitude ? val / magnitude : 0));
    };

    const normalizedImageVec = normalizeVector(imageVector);
    const normalizedTextVec = normalizeVector(textVector);
    const combinedVector = [...normalizedImageVec, ...normalizedTextVec];

    const textHash = hashVector(textVector).toString('hex');
    const combinedHash = hashVector(combinedVector).toString('hex');

    const memeHashBuffer = Buffer.from(combinedHash, 'hex');
    const [pda, bump] = await PublicKey.findProgramAddress(
      [Buffer.from(MEME_SEED_PREFIX), memeHashBuffer],
      program.programId
    );

    const imageHashBuffer = Buffer.from(imageHash, 'hex');
    const textHashBuffer = Buffer.from(textHash, 'hex');
    if (memeHashBuffer.length !== 32 || imageHashBuffer.length !== 32 || textHashBuffer.length !== 32) {
      throw new Error('Invalid hash length');
    }

    const verdict = 'pending';
    const canonScore = 0;

    const tx = await (program.methods as any)
      .registerMeme(
        Array.from(memeHashBuffer),
        Array.from(imageHashBuffer),
        Array.from(textHashBuffer),
        verdict,
        canonScore,
        pumpfunCa || '',
        metadataUri || ''
      )
      .accounts({ meme: pda, submitter: wallet.publicKey, systemProgram: SystemProgram.programId })
      .rpc();

    res.json({ textVector, combinedVector, textHash, combinedHash, pda: pda.toBase58(), bump, transaction: tx });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process meme', details: error?.message || String(error) });
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));


