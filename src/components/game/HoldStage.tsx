"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Battery, Zap } from "lucide-react";
import StageCompletionModal from "./StageCompletionModal";

export default function HoldStage() {
  const router = useRouter();
  const { addToken, completeStage } = useGameStore();
  const controls = useAnimation();

  const [power, setPower] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [target, setTarget] = useState(75);
  const [gameState, setGameState] = useState<"idle" | "charging" | "result">(
    "idle",
  );
  const [result, setResult] = useState<"win" | "fail" | "explode" | null>(null);

  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    setTarget(Math.floor(Math.random() * 30) + 60);

    // Global release listener to catch drag-out releases
    const handleGlobalRelease = () => {
      if (isCharging) stopCharging();
    };

    window.addEventListener("mouseup", handleGlobalRelease);
    window.addEventListener("touchend", handleGlobalRelease);
    return () => {
      window.removeEventListener("mouseup", handleGlobalRelease);
      window.removeEventListener("touchend", handleGlobalRelease);
    };
  }, [isCharging]); // Re-bind when charging state changes to capture correct closure if needed, or use ref for state

  // Use Ref for isCharging to avoid dependency loop in event listeners if we want to be safe,
  // but simpler: just letting effect re-run is fine for now or use a ref-backed state.
  // Actually, allow me to refactor to use strict Refs for game loop stability (like TimingStage).
  const powerRef = useRef(0);
  const isChargingRef = useRef(false);

  const updateCharge = () => {
    powerRef.current += 0.4; // Nerfed speed (was 0.5)
    setPower(powerRef.current);

    if (powerRef.current >= 120) {
      handleRelease(powerRef.current);
    } else {
      requestRef.current = requestAnimationFrame(updateCharge);
    }
  };

  const startCharging = () => {
    if (gameState === "result") return;
    setIsCharging(true);
    isChargingRef.current = true;
    setGameState("charging");
    requestRef.current = requestAnimationFrame(updateCharge);
    controls.start({ scale: 0.95 });
  };

  const stopCharging = () => {
    if (!isChargingRef.current || gameState === "result") return;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    setIsCharging(false);
    isChargingRef.current = false;
    handleRelease(powerRef.current);
    controls.start({ scale: 1 });
  };

  const handleRelease = (finalPower: number) => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setGameState("result");
    const lower = target - 15;
    const upper = target + 15;

    if (finalPower > 100) {
      setResult("explode");
    } else if (finalPower >= lower && finalPower <= upper) {
      setResult("win");
      completeStage("hold");
      addToken(1);
    } else {
      setResult("fail");
    }
  };

  const resetGame = () => {
    setPower(0);
    powerRef.current = 0;
    setGameState("idle");
    setResult(null);
    setTarget(Math.floor(Math.random() * 30) + 60);
    isChargingRef.current = false;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white p-6 relative overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="bg-transparent border-white text-white"
        >
          Back
        </Button>
      </div>

      <h1 className="text-4xl font-black uppercase mb-12 text-green-400 z-10 relative">
        Tahan & Lepas
      </h1>

      {/* Target Indicator */}
      <div className="text-xl font-bold mb-4 flex items-center gap-2 z-10 relative">
        <Zap className="text-yellow-400" />
        Target:{" "}
        <span className="text-yellow-400">
          {target - 15}% - {target + 15}%
        </span>
      </div>

      {/* Power Bar */}
      <div className="w-full max-w-xs h-64 border-4 border-white rounded-xl relative bg-black/50 overflow-hidden mb-8 z-10">
        {/* Target Zone */}
        <div
          className="absolute w-full bg-yellow-500/30 border-y-2 border-yellow-400 z-10"
          style={{ bottom: `${target - 15}%`, height: `${30}%` }}
        >
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-yellow-400">
            TARGET
          </span>
        </div>

        {/* Fill */}
        <motion.div
          className={clsx(
            "absolute bottom-0 w-full transition-colors",
            power > 100
              ? "bg-red-500"
              : power > target
                ? "bg-orange-500"
                : "bg-green-500",
          )}
          style={{ height: `${Math.min(power, 100)}%` }}
        />

        {/* Value */}
        <div className="absolute inset-0 flex items-center justify-center font-black text-6xl drop-shadow-lg z-20">
          {Math.floor(power)}%{/* Overcharge Warning */}
          {power > 100 && (
            <span className="absolute text-sm text-red-500 font-bold -bottom-4 animate-pulse">
              BAHAYA!
            </span>
          )}
        </div>
      </div>

      <div className="h-24 w-full flex justify-center items-center z-10 relative">
        {gameState !== "result" ? (
          <motion.div animate={controls} className="w-full max-w-xs">
            <button
              onMouseDown={startCharging}
              // onMouseUp via global listener
              onTouchStart={startCharging}
              // onTouchEnd via global listener
              className="w-full h-20 bg-green-500 rounded-full border-4 border-white shadow-[0_10px_0_rgba(255,255,255,0.2)] font-black text-2xl uppercase active:shadow-none active:translate-y-2 transition-all select-none"
            >
              TAHAN (HOLD)
            </button>
          </motion.div>
        ) : (
          <div className="text-center animate-in zoom-in duration-300">
            {result === "explode" && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                {/* Explosion Particles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{
                      x: (Math.random() - 0.5) * 500,
                      y: (Math.random() - 0.5) * 500,
                      opacity: 0,
                      scale: Math.random() * 2,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute w-8 h-8 bg-red-500 rounded-full"
                  />
                ))}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 5, 0], opacity: [1, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-32 h-32 bg-yellow-400 rounded-full blur-xl"
                />
              </div>
            )}

            {result === "win" ? (
              <StageCompletionModal
                isOpen={true}
                title="SEMPURNA!"
                rewardText="+1 Token"
              />
            ) : result === "explode" ? (
              <div>
                <h2 className="text-4xl font-black text-red-500 mb-2">
                  MELEDAK! 💥
                </h2>
                <p className="mb-4 text-red-300">Ops, terlalu lama...</p>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="border-white text-white mt-4"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : (
              <div>
                <h2 className="text-4xl font-black text-white mb-2">MISSED!</h2>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="border-white text-white"
                >
                  Coba Lagi
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-8 opacity-50 text-sm">
        Lepaskan tombol saat tenaga di area kuning!
      </p>
    </div>
  );
}
