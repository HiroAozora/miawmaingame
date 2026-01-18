"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Heart, Timer, Swords } from "lucide-react";
import { clsx } from "clsx";
import StageCompletionModal from "./StageCompletionModal";

// Placeholder Lottie (replace with actual Boss asset later)
const BOSS_LOTTIE_URL =
  "https://lottie.host/8c8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d8d/placeholder.lottie";

const MAX_HP = 100;
const GAME_DURATION = 15; // seconds

export default function BossStage() {
  const router = useRouter();
  const { addToken, completeStage } = useGameStore();

  const [hp, setHp] = useState(MAX_HP);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<
    "intro" | "playing" | "won" | "lost"
  >("intro");
  const [combo, setCombo] = useState(0);

  // Audio refs (placeholder)
  // const playHit = useSound('/sounds/hit.mp3');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("lost");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const handleBossClick = () => {
    if (gameState !== "playing") return;

    const damage = 1 + Math.floor(combo / 10); // Simple combo mechanic
    const newHp = Math.max(0, hp - damage);

    setHp(newHp);
    setCombo((c) => c + 1);

    // Visual feedback logic here (e.g. particle spawn)

    if (newHp === 0) {
      setGameState("won");
      completeStage("boss");
      addToken(1); // Reward
    }
  };

  const startGame = () => {
    setHp(MAX_HP);
    setTimeLeft(GAME_DURATION);
    setCombo(0);
    setGameState("playing");
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-slate-900 text-white p-4 safe-area-inset-bottom">
      {/* Header Stats */}
      <div className="w-full flex justify-between items-center max-w-md mt-4">
        <div className="flex items-center gap-2 bg-red-900/50 px-4 py-2 rounded-full border-2 border-red-500">
          <Heart className="fill-red-500 text-red-500" />
          <span className="font-bold text-xl">
            {hp}/{MAX_HP}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-blue-900/50 px-4 py-2 rounded-full border-2 border-blue-500">
          <Timer className="text-blue-400" />
          <span className="font-mono text-xl">{timeLeft}s</span>
        </div>
      </div>

      {/* Main Boss Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        <AnimatePresence>
          {gameState === "playing" && (
            <motion.div
              className="relative cursor-pointer"
              whileTap={{ scale: 0.9 }}
              onClick={handleBossClick}
            >
              {/* Visual Boss Placeholder using Div if Lottie fails or loading */}
              <motion.div
                key={`boss-${hp}`} // Trigger animation on HP change
                initial={{ x: 0 }}
                animate={{ x: [0, -10, 10, -10, 10, 0] }} // Shake effect
                transition={{ duration: 0.1 }}
                className="w-64 h-64 bg-red-500 rounded-full flex items-center justify-center border-8 border-black shadow-[0_0_50px_rgba(239,68,68,0.5)] overflow-hidden"
              >
                <Swords size={64} className="text-black relative z-10" />

                {/* Damage Flash Overlay */}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-white z-0 pointer-events-none rounded-full"
                />

                {/* Eyes Expression (Simple) */}
                <div className="absolute top-20 flex gap-8 z-10">
                  <div className="w-4 h-4 bg-black rounded-full" />
                  <div className="w-4 h-4 bg-black rounded-full" />
                </div>
              </motion.div>

              {/* Floating Damage Text */}
              <AnimatePresence>
                <motion.div
                  key={`dmg-${hp}`}
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{ y: -50, opacity: 0, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-10 left-1/2 -translate-x-1/2 font-black text-4xl text-white stroke-black z-20 pointer-events-none"
                  style={{ textShadow: "2px 2px 0 #000" }}
                >
                  -{1 + Math.floor(combo / 10)}
                </motion.div>
              </AnimatePresence>

              {/* Combo Counter */}
              {combo > 5 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={`combo-${combo}`}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 font-black text-4xl stroke-black z-30 pointer-events-none"
                  style={{ textShadow: "2px 2px 0 #000" }}
                >
                  {combo}x!
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === "intro" && (
          <div className="text-center">
            <h1 className="text-5xl font-black mb-4 text-red-500 uppercase drop-shadow-lg">
              BOSS RUSH
            </h1>
            <p className="mb-8 text-gray-300">
              Tap secepat mungkin untuk mengalahkan Boss!
            </p>
            <Button
              onClick={startGame}
              className="bg-red-500 text-white border-white animate-pulse"
            >
              MULAI (START)
            </Button>
          </div>
        )}

        {gameState === "won" && (
          <StageCompletionModal
            isOpen={true}
            title="VICTORY!"
            rewardText="+1 Token"
          />
        )}

        {gameState === "lost" && (
          <div className="text-center bg-black/80 p-8 rounded-xl border-4 border-red-500">
            <h1 className="text-4xl font-bold text-red-500 mb-2">GAME OVER</h1>
            <p className="mb-6">Coba lagi!</p>
            <div className="flex gap-4">
              <Button onClick={() => router.push("/game")} variant="outline">
                Menu
              </Button>
              <Button onClick={startGame} className="bg-white text-black">
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer/Instructions */}
      <div className="text-center opacity-50 text-sm mb-4">
        Tip: Tap dengan dua jari untuk damage ganda!
      </div>
    </div>
  );
}
