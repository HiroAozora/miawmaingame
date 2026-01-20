"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Gift, ArrowLeft, Loader2 } from "lucide-react";
import { clsx } from "clsx";

export default function GachaPage() {
  const router = useRouter();
  const {
    tokens,
    spendToken,
    gachaRollCount,
    incrementGachaRoll,
    addToInventory,
  } = useGameStore();
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState<{
    type: "zonk" | "secret" | "mythic";
    message: string;
    sub: string;
  } | null>(null);

  const handlePull = () => {
    if (tokens <= 0 || isOpening) return;

    if (spendToken()) {
      setIsOpening(true);
      incrementGachaRoll();

      const currentRoll = gachaRollCount + 1;

      setTimeout(() => {
        let result: {
          type: "zonk" | "secret" | "mythic";
          message: string;
          sub: string;
        };

        // Cyclic Logic: 1->2->3->4 (Reset to 1 on 5)
        // (count - 1) % 4 + 1 maps 1->1, 4->4, 5->1
        const cycleStep = ((currentRoll - 1) % 4) + 1;

        if (cycleStep === 1 || cycleStep === 2) {
          result = { type: "zonk", message: "ZONK!", sub: "Coba lagi ya..." };
        } else if (cycleStep === 3) {
          result = {
            type: "secret",
            message: "HADIAH RAHASIA!",
            sub: "Skin Kucing Emas",
          };
          addToInventory("Skin Kucing Emas");
        } else if (cycleStep === 4) {
          result = {
            type: "mythic",
            message: "MYTHIC GET!",
            sub: "Kamera buat Hiu Kecil",
          };
          addToInventory("Kamera buat Hiu Kecil");
        } else {
          // Fallback
          result = { type: "zonk", message: "HITUNGAN SALAH?", sub: "Bug..." };
        }

        setReward(result);
        setIsOpening(false);
      }, 2000);
    }
  };

  const closeReward = () => {
    setReward(null);
  };

  return (
    <div className="min-h-screen bg-purple-900 flex flex-col items-center justify-center p-6 text-white text-center overflow-hidden relative">
      <div className="absolute top-4 left-4 z-20">
        <Button
          size="sm"
          variant="ghost"
          className="text-white border-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2" /> Back
        </Button>
      </div>

      <h1 className="text-4xl font-black mb-8 text-yellow-400 uppercase tracking-widest drop-shadow-md z-10">
        Mysterious Box
      </h1>

      <div className="mb-8 z-10">
        <span className="bg-black/50 px-4 py-2 rounded-full border border-white/20">
          Tokens: {tokens}
        </span>
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!reward ? (
            <motion.div
              key="chest"
              animate={
                isOpening
                  ? {
                      scale: [1, 1.1, 0.9, 1.2],
                      rotate: [0, -5, 5, -10, 10, 0],
                    }
                  : {}
              }
              transition={{ duration: 0.5, repeat: isOpening ? Infinity : 0 }}
              className="cursor-pointer"
              onClick={handlePull}
            >
              <Gift
                size={128}
                className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
              />
            </motion.div>
          ) : (
            <motion.div
              key="reward"
              initial={{ scale: 0, opacity: 0, rotate: 180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className={clsx(
                "p-8 rounded-xl border-4 shadow-2xl max-w-sm w-full relative overflow-hidden",
                reward.type === "mythic"
                  ? "bg-emerald-900 border-emerald-400 text-white shadow-[0_0_60px_rgba(52,211,153,0.6)]"
                  : reward.type === "secret"
                    ? "bg-purple-900 border-purple-500 text-white"
                    : "bg-white border-black text-black",
              )}
            >
              {/* Visual Effects Background */}
              {reward.type === "mythic" && (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.5)_360deg)] opacity-40 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-900/50 pointer-events-none" />
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                  />
                </>
              )}
              {reward.type === "secret" && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-yellow-400 opacity-10 pointer-events-none rounded-full blur-3xl"
                />
              )}

              <h2
                className={clsx(
                  "text-4xl font-black mb-2 uppercase relative z-10",
                  reward.type === "zonk"
                    ? "text-gray-500"
                    : reward.type === "secret"
                      ? "text-yellow-300 drop-shadow-md"
                      : "text-emerald-400 drop-shadow-[0_2px_0_#fff]",
                )}
              >
                {reward.message}
              </h2>

              {reward.type === "mythic" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative w-48 h-48 mx-auto mb-4"
                >
                  <Image
                    src="/prizes/hadiah hiu kecil.png"
                    alt="Hadiah Hiu Kecil"
                    fill
                    className="object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                  />
                </motion.div>
              )}

              <p className="text-lg font-bold mb-6 relative z-10">
                {reward.sub}
              </p>
              <Button
                onClick={closeReward}
                className={clsx(
                  "w-full relative z-20",
                  reward.type === "mythic" &&
                    "bg-emerald-400 hover:bg-emerald-500 text-black font-bold",
                )}
              >
                {reward.type === "mythic" ? "Terima Hadiah" : "OK"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!reward && (
        <div className="mt-12 z-10">
          <Button
            onClick={handlePull}
            disabled={tokens <= 0 || isOpening}
            className="w-full max-w-xs bg-yellow-500 text-black border-white hover:bg-yellow-400 text-xl py-6"
          >
            {isOpening ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Buka (1 Token)"
            )}
          </Button>
          {tokens <= 0 && (
            <p className="text-red-300 mt-2 text-sm font-bold">
              Token tidak cukup!
            </p>
          )}
        </div>
      )}

      {/* Background Particles or Effects can be added here if needed */}
    </div>
  );
}
