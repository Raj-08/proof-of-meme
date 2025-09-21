
import { motion } from "framer-motion";
import { Check, Search, Award, CircleCheck } from "lucide-react";

const features = [
  {
    icon: <Search className="w-6 h-6 text-cyan-400" />,
    title: "Meme Embedding Fingerprinting",
    description: "AI-powered analysis of image and narrative patterns",
  },
  {
    icon: <Check className="w-6 h-6 text-green-400" />,
    title: "Canonical Token Verification",
    description: "Identify and verify original meme tokens",
  },
  {
    icon: <Award className="w-6 h-6 text-cyan-400" />,
    title: "Public Meme Registry",
    description: "Transparent database of verified meme tokens",
  },
  {
    icon: <CircleCheck className="w-6 h-6 text-green-400" />,
    title: "Meme Badge System",
    description: "Canonical ✅ / Derivative ⚠️ / LARP ❌",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4" id="features">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          How It Works
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-white/5">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
