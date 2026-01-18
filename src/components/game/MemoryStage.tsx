"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Brain } from "lucide-react";

const GRID_SIZE = 9;
const WIN_ROUND = 4; // Complete 3 sequences to win

export default function MemoryStage() {
  const router = useRouter();
  const { addToken, completeStage } = useGameStore();

  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [gameState, setGameState] = useState<
    "intro" | "playing" | "failed" | "won"
  >("intro");
  const [message, setMessage] = useState("Hafalkan Polanya!");

  const startGame = () => {
    setGameState("playing");
    setRound(1);
    setSequence([]);
    setPlayerSequence([]);
    startRound(1);
  };

  const startRound = (currentRound: number) => {
    setIsPlayingSeq(true);
    setPlayerSequence([]);
    setMessage(`Ronde ${currentRound}`);

    // Generate new step
    const nextStep = Math.floor(Math.random() * GRID_SIZE);

    // In a real Simon game we keep the old sequence and add one,
    // but typically easier memory games generate a fresh sequence of length N
    // Let's do: add one to existing sequence
    setSequence((prev) => [...prev, nextStep]);
  };

  useEffect(() => {
    if (gameState === "playing" && sequence.length > 0) {
      playSequence();
    }
  }, [sequence]); // Trigger when sequence updates

  const playSequence = async () => {
    setIsPlayingSeq(true);
    setMessage("Perhatikan...");

    for (let i = 0; i < sequence.length; i++) {
      await new Promise((r) => setTimeout(r, 500)); // Gap before
      setActiveTile(sequence[i]);
      // playSound logic here
      await new Promise((r) => setTimeout(r, 600)); // Lit duration
      setActiveTile(null);
    }

    setIsPlayingSeq(false);
    setMessage("Ulangi!");
  };

  const handleTileClick = (index: number) => {
    if (gameState !== "playing" || isPlayingSeq) return;

    // Visual feedback instant (handled by active CSS :active)

    const expected = sequence[playerSequence.length];

    if (index === expected) {
      const newPlayerSeq = [...playerSequence, index];
      setPlayerSequence(newPlayerSeq);

      if (newPlayerSeq.length === sequence.length) {
        // Round Complete
        if (round >= WIN_ROUND) {
          setGameState("won");
          completeStage("memory");
          addToken(5);
        } else {
          setMessage("Bagus!");
          setTimeout(() => {
            setRound((r) => r + 1);
            startRound(round + 1);
          }, 1000);
        }
      }
    } else {
      // Wrong
      setGameState("failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
      <div className="absolute top-4 left-4">
        <Button onClick={() => router.back()} variant="ghost" size="sm">
          Back
        </Button>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black uppercase mb-2">Kisi Memori</h1>
        <div className="bg-white px-6 py-2 rounded-full border-2 border-black inline-flex items-center gap-2">
          <Brain className="text-blue-500" />
          <span className="font-bold">{message}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTileClick(i)}
            disabled={isPlayingSeq || gameState !== "playing"}
            className={clsx(
              "w-20 h-20 rounded-lg border-2 border-black transition-colors duration-100",
              activeTile === i
                ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] border-transparent"
                : "bg-gray-100 hover:bg-gray-200",
            )}
          />
        ))}
      </div>

      {gameState === "intro" && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-xl border-4 border-black text-center">
            <h2 className="text-2xl font-bold mb-4">Siap Mengingat?</h2>
            <Button onClick={startGame}>Mulai!</Button>
          </div>
        </div>
      )}

      {gameState === "failed" && (
        <div className="absolute inset-0 bg-red-500/90 flex items-center justify-center z-20 text-white text-center">
          <div>
            <h2 className="text-4xl font-black mb-4">Oopss!</h2>
            <p className="mb-6 text-xl">Salah kotak...</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/game")} variant="outline">
                Menu
              </Button>
              <Button
                onClick={startGame}
                className="bg-white text-black border-none"
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      )}

      {gameState === "won" && (
        <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center z-20 text-white text-center">
          <div>
            <h2 className="text-4xl font-black mb-4">HEBAT!</h2>
            <p className="mb-6 text-xl">+5 Token</p>
            <Button
              onClick={() => router.push("/game")}
              className="bg-white text-black border-none"
            >
              Lanjut
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
