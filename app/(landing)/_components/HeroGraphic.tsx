"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroGraphic() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Chart path data - a smooth curve representing growth
  const chartPath =
    "M10,250 C80,230 120,280 180,200 S300,180 380,120 S500,100 580,60";

  // Area fill path (same curve but closed at bottom)
  const areaPath = `${chartPath} L580,300 L10,300 Z`;

  // Volume data simulation
  const volumeData = Array.from({ length: 20 }).map((_, i) => ({
    x: 20 + i * 30,
    height: Math.random() * 50 + 20,
    delay: i * 0.05,
  }));

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Animated Chart */}
      <div className="absolute inset-x-0 bottom-0 h-full">
        <svg
          viewBox="0 0 600 350"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[100, 200, 300].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="600"
              y2={y}
              stroke="white"
              strokeOpacity="0.05"
              strokeDasharray="4 4"
            />
          ))}

          {/* Volume Bars */}
          {volumeData.map((bar, i) => (
            <motion.rect
              key={i}
              x={bar.x}
              y={350 - bar.height}
              width="12"
              height={bar.height}
              fill="url(#volumeGradient)"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: bar.height, opacity: 1 }}
              transition={{
                delay: 0.5 + bar.delay,
                duration: 1,
                type: "spring",
              }}
              rx="2"
            />
          ))}

          {/* Target Line */}
          <motion.line
            x1="0"
            y1="80"
            x2="600"
            y2="80"
            stroke="#10B981"
            strokeWidth="1"
            strokeDasharray="6 6"
            opacity="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 1.5, delay: 1 }}
          />

          {/* Area Fill */}
          <motion.path
            d={areaPath}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Line Path */}
          <motion.path
            d={chartPath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            strokeLinecap="round"
            filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))"
          />

          {/* Data Points */}
          {[
            { cx: 180, cy: 200, delay: 0.8, label: "Entry" },
            { cx: 380, cy: 120, delay: 1.2, label: "Scale In" },
            { cx: 580, cy: 60, delay: 1.6, label: "Exit" },
          ].map((point, i) => (
            <g key={i}>
              <motion.circle
                cx={point.cx}
                cy={point.cy}
                r="6"
                fill="#0F172A"
                stroke="#F59E0B"
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: point.delay,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              />
              <motion.path
                d={`M${point.cx},${point.cy} L${point.cx},${350}`}
                stroke="#F59E0B"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: point.delay, duration: 0.5 }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Floating Cards (Simulated UI) */}
      <motion.div
        className="absolute top-10 right-10 bg-gray-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl w-48 z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">
              Profit Factor
            </div>
            <div className="text-xl font-bold text-white tracking-tight">
              2.45
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ delay: 1.2, duration: 1 }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-24 left-10 bg-gray-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl w-40 z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping opacity-20"></div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">Status</div>
            <div className="text-sm font-bold text-white">Live Trading</div>
          </div>
        </div>
      </motion.div>

      {/* New Floating Badge */}
      <motion.div
        className="absolute top-1/2 left-20 bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-xl z-0"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.8, type: "spring" }}
      >
        <div className="text-xs text-gray-400">Win Rate</div>
        <div className="text-lg font-bold text-green-400">68%</div>
      </motion.div>
    </div>
  );
}
