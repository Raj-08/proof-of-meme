
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const weeklyMemes = [
  {
    name: "PEPE",
    score: "98",
    status: "Canonical",
    trend: "+12.4%",
  },
  {
    name: "WIF",
    score: "95",
    status: "Canonical",
    trend: "+8.2%",
  },
  {
    name: "BONK",
    score: "92",
    status: "Canonical",
    trend: "+5.7%",
  },
];

const WeeklyMemes = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-cyan-950/10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Verified Memes of the Week
          </h2>
          <p className="text-gray-400">
            Top canonically approved meme coins
          </p>
        </motion.div>

        <div className="grid gap-6">
          {weeklyMemes.map((meme, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Star className="w-6 h-6 text-yellow-400" />
                <div>
                  <h3 className="text-xl font-semibold">{meme.name}</h3>
                  <p className="text-gray-400">Canon Score™: {meme.score}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-green-400">{meme.trend}</span>
                <p className="text-sm text-gray-400">{meme.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeeklyMemes;
