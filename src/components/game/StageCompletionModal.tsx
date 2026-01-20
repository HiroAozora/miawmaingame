"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface StageCompletionModalProps {
  isOpen: boolean;
  title?: string;
  rewardText?: string;
  imageSrc?: string;
  onContinue?: () => void;
}

export default function StageCompletionModal({
  isOpen,
  title = "STAGE COMPLETE!",
  rewardText = "+1 Token",
  imageSrc,
  onContinue,
}: StageCompletionModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      router.push("/game");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden text-center p-8"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-black uppercase text-yellow-500 mb-2 drop-shadow-sm">
            {title}
          </h2>

          <div className="flex justify-center mb-6">
            {imageSrc ? (
              <div className="relative w-40 h-40">
                <Image
                  src={imageSrc}
                  alt="Prize"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="text-6xl">🏆</div>
            )}
          </div>

          <p className="text-xl font-bold text-gray-700 mb-8 bg-yellow-100 py-2 rounded-lg border-2 border-yellow-400 border-dashed">
            {rewardText}
          </p>
        </motion.div>

        <Button
          onClick={handleContinue}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-lg py-6 uppercase tracking-wider shadow-lg transform transition hover:-translate-y-1"
        >
          Lanjut (Continue)
        </Button>
      </motion.div>
    </div>
  );
}
