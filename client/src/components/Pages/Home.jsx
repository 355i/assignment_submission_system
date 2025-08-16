import { motion } from "framer-motion";

// Utility function to join class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ElegantShape({ className, delay = 0, height = 100, rotate = 0, gradient = "from-gray-200" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      className={`absolute w-full ${className}`}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ height }}
        className="relative w-full"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border border-gray-300",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Home({ badge = "EduSphere", title1 = "Unlock Your", title2 = "Potential" }) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 + i * 0.2, ease: [0.25, 0.4, 0.25, 1] },
    }),
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 to-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.08] via-transparent to-green-400/[0.08] blur-3xl w-full" />

      <div className="absolute inset-0 overflow-hidden w-full">
        <ElegantShape delay={0.3} height={140} rotate={12} gradient="from-blue-400/[0.15]" className="top-[15%] md:top-[20%]" />
        <ElegantShape delay={0.5} height={120} rotate={-15} gradient="from-green-400/[0.15]" className="top-[70%] md:top-[75%]" />
        <ElegantShape delay={0.4} height={80} rotate={-8} gradient="from-yellow-400/[0.15]" className="bottom-[5%] md:bottom-[10%]" />
        <ElegantShape delay={0.6} height={60} rotate={20} gradient="from-purple-400/[0.15]" className="top-[10%] md:top-[15%]" />
        <ElegantShape delay={0.7} height={40} rotate={-25} gradient="from-red-400/[0.15]" className="top-[5%] md:top-[10%]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 w-full text-center">
        <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-800 to-gray-600">{title1}</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-gray-700 to-green-500">{title2}</span>
          </h1>
        </motion.div>

        <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
            Transform the way you learn with interactive courses, expert instructors, and a community that supports your journey.
          </p>
        </motion.div>
      </div>
    </div>
  );
}