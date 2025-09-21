import { PublicKey } from '@solana/web3.js';
import crypto from 'crypto';

export interface MemeVectorPDA {
  pda: PublicKey;
  bump: number;
}

export class SolanaService {
  private static PROGRAM_ID = new PublicKey('11111111111111111111111111111111');
  private static MEME_SEED_PREFIX = 'meme_vector';

  /**
   * Hashes a vector to create a fixed-length seed
   * @param vector - Array of numbers to hash
   * @returns Buffer - 32-byte hash
   */
  private static hashVector(vector: number[]): Buffer {
    return crypto
      .createHash('sha256')
      .update(vector.join(','))
      .digest();
  }

  /**
   * Generates a PDA for a meme vector with optional seed
   * @param vector - The vector to create PDA for
   * @param seed - Optional additional seed for PDA generation
   * @returns Promise<MemeVectorPDA> - The PDA and bump
   */
  static async generateMemePDA(
    vector: number[],
    seed?: string
  ): Promise<MemeVectorPDA> {
    // Hash the vector to get a fixed-length seed
    const vectorHash = this.hashVector(vector);
    
    const seeds = [
      Buffer.from(SolanaService.MEME_SEED_PREFIX),
      vectorHash
    ];

    // If seed is provided, hash it for consistent length
    if (seed) {
      const seedHash = crypto
        .createHash('sha256')
        .update(seed)
        .digest();
      seeds.push(seedHash);
    }

    const [pda, bump] = await PublicKey.findProgramAddress(
      seeds,
      SolanaService.PROGRAM_ID
    );

    return {
      pda,
      bump
    };
  }

  /**
   * Verifies if a PDA matches a given vector
   * @param pda - The PDA to verify
   * @param vector - The vector to verify against
   * @param seed - Optional seed used in PDA generation
   * @returns Promise<boolean> - Whether the PDA matches
   */
  static async verifyMemePDA(
    pda: PublicKey,
    vector: number[],
    seed?: string
  ): Promise<boolean> {
    const { pda: derivedPDA } = await this.generateMemePDA(vector, seed);
    return pda.equals(derivedPDA);
  }
} 