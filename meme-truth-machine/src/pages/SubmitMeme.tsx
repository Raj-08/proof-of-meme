import { useState, useRef, useEffect } from "react";
import { Image as LucideImage, FileText, Link, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMemeProcessor } from "@/lib/hooks/useMemeProcessor";
import { toast } from "sonner";

const SubmitMeme = () => {
  const [image, setImage] = useState<File | null>(null);
  const [narrative, setNarrative] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [solanaAccount, setSolanaAccount] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<string | null>(null);
  
  const { processMeme, isLoading: isProcessorLoading, error: processorError } = useMemeProcessor();

  // Add effect to show processor initialization error
  useEffect(() => {
    if (processorError) {
      toast.error(`Failed to initialize meme processor: ${processorError}`);
    }
  }, [processorError]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          const img = document.createElement('img');
          imageRef.current = img;
          imageRef.current.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isProcessorLoading) {
      toast.error("Meme processor is still initializing. Please wait...");
      return;
    }

    if (processorError) {
      toast.error(`Cannot process meme: ${processorError}`);
      return;
    }

    if (!image || !narrative || !imageRef.current) {
      toast.error("Please provide both an image and narrative");
      return;
    }

    setIsProcessing(true);
    try {
      // Ensure image is loaded
      if (!imageRef.current.complete) {
        await new Promise((resolve) => {
          imageRef.current!.onload = resolve;
        });
      }

      const result = await processMeme(imageRef.current, narrative);
      console.log("Meme processed successfully:", result);
      
      // Set the Solana account address and transaction
      if (result.solanaAccount) {
        setSolanaAccount(result.solanaAccount);
      }
      if (result.transaction) {
        setTransaction(result.transaction);
      }
      
      // Reset form
      setImage(null);
      setNarrative("");
      setProjectUrl("");
      setContractAddress("");
      
      toast.success("Meme processed and registered on-chain successfully!");
    } catch (error) {
      console.error("Failed to process meme:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process meme. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-[Space_Grotesk] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
          Submit Your Meme
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <LucideImage className="w-4 h-4" />
              Upload Meme Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-white/10 border-white/20"
              disabled={isProcessing}
            />
            {image && (
              <div className="mt-2">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  className="max-h-48 rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Meme Narrative
            </label>
            <Textarea 
              placeholder="Tell us the story behind your meme..."
              className="bg-white/10 border-white/20 min-h-[120px]"
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Link className="w-4 h-4" />
              Project URL
            </label>
            <Input
              type="url"
              placeholder="https://..."
              className="bg-white/10 border-white/20"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Pump Fun CA (Contract Address)
            </label>
            <Input
              type="text"
              placeholder="0x..."
              className="bg-white/10 border-white/20"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300"
            disabled={isProcessing || isProcessorLoading}
          >
            {isProcessing ? "Processing..." : "Submit for Verification"}
          </Button>
        </form>

        {(solanaAccount || transaction) && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Meme Registered on Solana</h2>
            
            {solanaAccount && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Account Address</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono break-all">{solanaAccount}</span>
                  <a
                    href={`https://explorer.solana.com/address/${solanaAccount}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {transaction && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Transaction</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono break-all">{transaction}</span>
                  <a
                    href={`https://explorer.solana.com/tx/${transaction}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-400 mt-4">
              Click the link icons to view your meme on Solana Explorer
            </p>
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-900 to-gray-900"></div>
    </div>
  );
};

export default SubmitMeme;
