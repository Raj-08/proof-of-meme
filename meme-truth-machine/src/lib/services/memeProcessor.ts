import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import CryptoJS from 'crypto-js';

const API_URL = 'http://localhost:3001';

interface MemeVector {
  imageVector: number[];
  textVector: number[];
  combinedVector: number[];
  imageHash: string;
  textHash: string;
  combinedHash: string;
}

export class MemeProcessor {
  private model: mobilenet.MobileNet | null = null;

  async initialize() {
    try {
      // Check if server is running
      const response = await fetch(`${API_URL}/api/health`);
      if (!response.ok) {
        throw new Error('Server is not running');
      }
      
      // Load MobileNet model for image processing
      this.model = await mobilenet.load();
    } catch (error) {
      throw new Error('Failed to initialize: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  private async processImage(imageElement: HTMLImageElement): Promise<number[]> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    // Convert image to tensor and get embeddings
    const tfImage = tf.browser.fromPixels(imageElement);
    const predictions = await this.model.infer(tfImage, true) as tf.Tensor;
    
    // Convert to array and normalize
    const imageVector = await predictions.data();
    tfImage.dispose();
    predictions.dispose();

    return Array.from(imageVector);
  }

  private normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / magnitude);
  }

  private hashVector(vector: number[]): string {
    const vectorString = vector.join(',');
    return CryptoJS.SHA256(vectorString).toString();
  }

  async processMeme(
    imageElement: HTMLImageElement,
    memeText: string
  ): Promise<Partial<MemeVector>> {
    // Process image locally
    const imageVector = await this.processImage(imageElement);
    const imageHash = this.hashVector(imageVector);

    // Send text to server for processing
    try {
      const response = await fetch(`${API_URL}/api/process-meme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: memeText,
          imageVector: imageVector,
          imageHash: imageHash
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process meme text on server');
      }

      const result = await response.json();
      return {
        ...result,
        imageVector,
        imageHash
      };
    } catch (error) {
      console.error('Server processing failed:', error);
      throw new Error('Failed to process meme text on server');
    }
  }
} 