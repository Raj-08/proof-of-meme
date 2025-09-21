
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
          Proof of Meme
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          The truth layer for memecoins.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/submit-meme">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300">
              Submit a Meme <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="secondary" className="backdrop-blur-sm bg-white/10">
            Explore Canon Registry
          </Button>
        </div>
      </motion.div>
      
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-900 to-gray-900"></div>
    </section>
  );
};

export default Hero;
