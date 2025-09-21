
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import WeeklyMemes from "@/components/WeeklyMemes";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-[Space_Grotesk]">
      <Hero />
      <Features />
      <WeeklyMemes />
    </div>
  );
};

export default Index;
