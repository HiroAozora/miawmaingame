"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { Zap, Target } from "lucide-react";
import { clsx } from "clsx";
import StageCompletionModal from "./StageCompletionModal";

export default function TimingStage() {
  const router = useRouter();
  const { addToken, completeStage } = useGameStore();

  const [score, setScore] = useState(0);
  const [targetWidth, setTargetWidth] = useState(30); // Percentage
  const [targetLeft, setTargetLeft] = useState(35); // Percentage
  const [isPlaying, setIsPlaying] = useState(false);
  const [indicatorPos, setIndicatorPos] = useState(0);
  // Use Refs for physics to avoid re-renders restarting the loop
  const directionRef = useRef(1);
  const speedRef = useRef(0.8); // Slower initial speed

  const [feedback, setFeedback] = useState<
    "hit" | "miss" | "STAGE COMPLETE!" | null
  >(null);

  const requestRef = useRef<number | null>(null);

  const update = () => {
    setIndicatorPos((prev) => {
      let next = prev + speedRef.current * directionRef.current;
      if (next >= 100 || next <= 0) {
        directionRef.current *= -1;
        next = Math.max(0, Math.min(100, next));
      }
      return next;
    });
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (isPlaying) {
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(update);
      }
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  const handleTap = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      return;
    }

    // Check hit with slight tolerance (+/- 2%)
    const hitTolerance = 2;
    if (
      indicatorPos >= targetLeft - hitTolerance &&
      indicatorPos <= targetLeft + targetWidth + hitTolerance
    ) {
      // Hit!
      setFeedback("hit");
      const newScore = score + 1;
      setScore(newScore);

      // Increase difficulty (Gentler scaling)
      speedRef.current += 0.1; // Reduced from 0.2
      setTargetWidth((w) => Math.max(15, w - 1)); // Decrement reduced from 2, min increased to 15
      setTargetLeft(Math.random() * (90 - targetWidth));

      if (newScore >= 5) {
        setIsPlaying(false);
        setFeedback("STAGE COMPLETE!");
        completeStage("timing");
        addToken(1);
        // Modal handles navigation now
      } else {
        setTimeout(() => {
          // Only clear if we haven't won yet (race condition fix)
          if (newScore < 5) setFeedback(null);
        }, 500);
      }
    } else {
      // Miss
      setFeedback("miss");
      setScore(0);
      speedRef.current = 0.8;
      setTargetWidth(30);
      setIsPlaying(false);
      setTimeout(() => setFeedback(null), 500);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-yellow-400 p-4 relative overflow-hidden"
      onClick={handleTap}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 2px, transparent 2.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <h1 className="text-4xl font-black mb-8 uppercase relative z-10">
        Ketuk Tepat!
      </h1>

      <div className="text-8xl font-black mb-12 relative z-10">
        {score}
        {feedback === "hit" && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            className="absolute -top-10 left-10 text-green-600 text-4xl"
          >
            GOOD!
          </motion.span>
        )}
        {feedback === "miss" && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            className="absolute -top-10 left-10 text-red-600 text-4xl"
          >
            MISS!
          </motion.span>
        )}
      </div>

      {/* Bar Container */}
      <div className="w-full max-w-sm h-16 bg-black rounded-full relative overflow-hidden border-4 border-white shadow-xl z-10">
        {/* Target Zone */}
        <div
          className="absolute h-full bg-green-500"
          style={{ left: `${targetLeft}%`, width: `${targetWidth}%` }}
        />

        {/* Indicator */}
        <div
          className="absolute h-full w-2 bg-white border-x-2 border-black"
          style={{ left: `${indicatorPos}%`, transform: "translateX(-50%)" }}
        />
      </div>

      <p className="mt-8 font-bold text-xl opacity-70 relative z-10">
        {isPlaying ? "TAP saat di area hijau!" : "Tap layar untuk mulai"}
      </p>

      {/* Legacy Overlay fallback (optional, but removing to avoid dupes) 
          Actually let's remove the old overlay block at consistent line numbers
          The replacement above handles the completion feedback inline
      */}

      <div className="absolute top-4 left-4 z-20">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.back();
          }}
          variant="ghost"
          size="sm"
        >
          Back
        </Button>
      </div>
      <StageCompletionModal
        isOpen={feedback === "STAGE COMPLETE!"}
        title="HEBAT!"
        rewardText="+1 Token"
      />
    </div>
  );
}
