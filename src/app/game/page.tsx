"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGameStore, StageId } from "@/store/useGameStore";
import { Button } from "@/components/ui/Button";
import { Skull, Zap, Brain, Hand, Coins, Gift } from "lucide-react";
import { clsx } from "clsx";

const stages: {
  id: StageId;
  name: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "boss",
    name: "Boss Survival",
    icon: <Skull size={32} />,
    color: "bg-red-400",
  },
  {
    id: "timing",
    name: "Ketuk Tepat",
    icon: <Zap size={32} />,
    color: "bg-yellow-400",
  },
  {
    id: "memory",
    name: "Kisi Memori",
    icon: <Brain size={32} />,
    color: "bg-blue-400",
  },
  {
    id: "hold",
    name: "Tahan & Lepas",
    icon: <Hand size={32} />,
    color: "bg-green-400",
  },
];

export default function GameHub() {
  const router = useRouter();
  const { playerName, tokens, unlockedStages } = useGameStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!playerName) {
      router.push("/");
    }
  }, [playerName, router]);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto border-x-2 border-gray-200">
      {/* Top Bar */}
      <header className="p-4 flex justify-between items-center bg-white border-b-2 border-black sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-bold uppercase">
            Player
          </span>
          <span className="text-lg font-black truncate max-w-[150px]">
            {playerName}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full border-2 border-black">
          <Coins size={20} className="text-yellow-600 fill-yellow-600" />
          <span className="font-bold">{tokens}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto pb-24">
        <h2 className="text-2xl font-black mb-6 uppercase">Pilih Tantangan</h2>

        <div className="grid grid-cols-1 gap-4">
          {stages.map((stage, index) => {
            const isUnlocked =
              unlockedStages.includes(stage.id) ||
              unlockedStages.includes("boss"); // Fallback logic check
            // Actually, best to just check includes directly.
            // Warning: The unlockedStages array in store is what matters.

            // Correct logic accessing state directly in component render
            const locked = !useGameStore
              .getState()
              .unlockedStages.includes(stage.id);

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: locked ? 0.5 : 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  disabled={locked}
                  onClick={() => router.push(`/game/${stage.id}`)}
                  className={clsx(
                    "w-full p-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-6 transition-transform text-left",
                    locked
                      ? "bg-gray-300 cursor-not-allowed shadow-none border-gray-500"
                      : `${stage.color} hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95`,
                  )}
                >
                  <div
                    className={clsx(
                      "p-3 rounded-full border-2 border-black/10",
                      locked ? "bg-gray-400" : "bg-white/30",
                    )}
                  >
                    {locked ? (
                      <div className="w-8 h-8 flex items-center justify-center">
                        🔒
                      </div>
                    ) : (
                      stage.icon
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase">
                      {stage.name}
                    </h3>
                    <p className="text-sm font-medium opacity-80">
                      {locked ? "Terkunci" : "Tap to play"}
                    </p>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Bottom Bar (Gacha) */}
      <div className="fixed bottom-0 w-full max-w-md p-4 bg-white/90 backdrop-blur-sm border-t-2 border-black">
        {useGameStore.getState().completedStages.includes("boss") ? (
          <Button
            className="w-full flex gap-2 items-center justify-center bg-purple-500 text-white animate-pulse"
            onClick={() => router.push("/game/gacha")}
          >
            <Gift size={24} />
            <span className="uppercase tracking-widest">Buka Gacha</span>
          </Button>
        ) : (
          <Button
            disabled
            className="w-full flex gap-2 items-center justify-center bg-gray-400 text-gray-700 cursor-not-allowed"
          >
            <Gift size={24} />
            <span className="uppercase tracking-widest">
              Terkunci (Kalahkan Boss)
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
