import { useState, useEffect } from 'react';
import { MemeProcessor } from '../services/memeProcessor';

export const useMemeProcessor = () => {
  const [processor, setProcessor] = useState<MemeProcessor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeProcessor = async () => {
      try {
        console.log('Initializing meme processor...');
        const memeProcessor = new MemeProcessor();
        await memeProcessor.initialize();
        console.log('Processor initialized successfully');
        
        setProcessor(memeProcessor);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize meme processor';
        console.error('Processor initialization failed:', errorMessage);
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    initializeProcessor();
  }, []);

  const processMeme = async (image: HTMLImageElement, text: string) => {
    if (!processor) {
      console.error('Processor state:', { processor, isLoading, error });
      throw new Error(`Processor not initialized. Current state: ${error || 'Unknown error'}`);
    }

    try {
      console.log('Processing meme with text:', text.slice(0, 50) + '...');
      const result = await processor.processMeme(image, text);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process meme';
      console.error('Meme processing failed:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    processMeme,
    isLoading,
    error
  };
}; 