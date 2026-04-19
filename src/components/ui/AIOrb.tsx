import { motion } from 'framer-motion';

const AIOrb = () => {
  return (
    <div className="relative mx-auto mb-4 w-[52px] h-[52px]">
      <div className="absolute inset-0 bg-[#00A896] rounded-full blur-3xl opacity-20 animate-pulse" />
      
      {/* Editorial Liquid Orb */}
      <motion.div
        animate={{
          scale: [1, 1.1, 0.95, 1],
          rotate: [0, 90, 180, 360],
          borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "50% 50% 20% 80% / 25% 80% 20% 75%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-full h-full bg-gradient-to-br from-[#00A896] via-[#007A6E] to-[#1C1C1E] shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]" />
      </motion.div>

      {/* Surface Highlight */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default AIOrb;
