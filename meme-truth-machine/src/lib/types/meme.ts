export interface MemeVector {
  textVector: number[];
  combinedVector: number[];
  textHash: string;
  combinedHash: string;
  analysis: string;
  pda: string;
  bump: number;
  solanaAccount: string;
  transaction: string;
  registrationData: {
    combinedHash: string;
    imageHash: string;
    textHash: string;
    verdict: string;
    canonScore: number;
    pumpfunCa?: string;
    metadataUri?: string;
  };
} 