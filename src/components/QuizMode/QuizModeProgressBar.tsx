import React from "react";
import { motion } from "framer-motion";

interface QuizModeProgressBarProps {
  progress: number;
}

export const QuizModeProgressBar: React.FC<QuizModeProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full max-w-2xl mb-8 shrink-0">
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          animate={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};