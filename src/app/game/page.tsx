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
  {
    id: "boss",
    name: "Boss Survival",
    icon: <Skull size={32} />,
    color: "bg-red-400",
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

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto border-x-2 border-gray-200 relative">
      {/* Top Bar */}
      <header className="p-4 flex justify-between items-center bg-white border-b-2 border-black sticky top-0 z-30 shadow-sm">
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

      {/* Main Content - Removing overflow-y-auto restricted height to allow body scroll naturally on mobile if needed, or keeping it but ensuring height calc is safe */}
      <main className="flex-1 p-4 pb-32">
        <h2 className="text-2xl font-black mb-6 uppercase">Pilih Tantangan</h2>

        <div className="grid grid-cols-1 gap-4">
          {stages.map((stage, index) => {
            const unlockedList = useGameStore.getState().unlockedStages;
            // Timing is always unlocked if strictly sequential foundation is respected
            // But let's stick to store logic.
            const locked = !unlockedList.includes(stage.id);

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

      {/* Bottom Bar (Gacha & Settings) */}
      <div className="fixed bottom-0 w-full max-w-md p-4 bg-white/90 backdrop-blur-sm border-t-2 border-black flex flex-col gap-2 z-20">
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

        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs text-center text-gray-400 hover:text-red-500 underline py-1"
        >
          Reset Progress (Ulang)
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-4 border-black p-6 rounded-xl max-w-xs w-full text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <h3 className="text-xl font-black mb-2 uppercase text-red-500">
              Yakin Reset?
            </h3>
            <p className="text-gray-600 mb-6 font-medium">
              Semua progress & token akan hilang selamanya!
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  useGameStore.getState().resetProgress();
                  router.push("/");
                }}
                className="flex-1 bg-red-500 text-white border-red-700 hover:bg-red-600"
              >
                Reset
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
