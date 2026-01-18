import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StageId = "boss" | "timing" | "memory" | "hold";

interface GameState {
  playerName: string;
  tokens: number;
  unlockedStages: StageId[];
  completedStages: StageId[];
  inventory: string[]; // Gacha rewards
  gachaRollCount: number;

  // Actions
  setPlayerName: (name: string) => void;
  addToken: (amount: number) => void;
  spendToken: () => boolean;
  completeStage: (stage: StageId) => void;
  addToInventory: (item: string) => void;
  incrementGachaRoll: () => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerName: "",
      tokens: 0,
      unlockedStages: ["timing"], // Only Timing unlocked initially
      completedStages: [],
      inventory: [],
      gachaRollCount: 0,

      setPlayerName: (name) => set({ playerName: name }),

      addToken: (amount) => set((state) => ({ tokens: state.tokens + amount })),

      spendToken: () => {
        const { tokens } = get();
        if (tokens > 0) {
          set({ tokens: tokens - 1 });
          return true;
        }
        return false;
      },

      completeStage: (stage) =>
        set((state) => {
          const newCompleted = state.completedStages.includes(stage)
            ? state.completedStages
            : [...state.completedStages, stage];

          let newUnlocked = [...state.unlockedStages];

          // Progression Logic
          if (stage === "timing" && !newUnlocked.includes("memory"))
            newUnlocked.push("memory");
          if (stage === "memory" && !newUnlocked.includes("hold"))
            newUnlocked.push("hold");
          if (stage === "hold" && !newUnlocked.includes("boss"))
            newUnlocked.push("boss");

          return {
            completedStages: newCompleted,
            unlockedStages: newUnlocked,
          };
        }),

      addToInventory: (item) =>
        set((state) => ({
          inventory: [...state.inventory, item],
        })),

      incrementGachaRoll: () =>
        set((state) => ({ gachaRollCount: state.gachaRollCount + 1 })),

      resetProgress: () =>
        set({
          playerName: "",
          tokens: 0,
          completedStages: [],
          inventory: [],
          gachaRollCount: 0,
          unlockedStages: ["timing"],
        }),
    }),
    {
      name: "miaw-game-storage",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1: Reset to default or handle mapping
          // For now, simpler to just discard old state to avoid crash
          return {
            playerName: "",
            tokens: 0,
            unlockedStages: ["timing"],
            completedStages: [],
            inventory: [],
            gachaRollCount: 0,
          };
        }
        return persistedState;
      },
    },
  ),
);
