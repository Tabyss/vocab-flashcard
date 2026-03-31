import React from "react";

interface QuizModeHeaderProps {
  score: number;
  currentIndex: number;
  totalQuestions: number;
  onExit: () => void;
}

export const QuizModeHeader: React.FC<QuizModeHeaderProps> = ({
  score,
  currentIndex,
  totalQuestions,
  onExit,
}) => {
  return (
    <header className="w-full max-w-2xl flex justify-between items-center mb-6 mt-4 shrink-0">
      <button
        onClick={onExit}
        className="text-gray-400 font-bold hover:text-red-500 transition px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
      >
        ✕ Quit
      </button>
      <div className="flex gap-4 items-center bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <span className="text-xs font-bold dark:text-white">Score: {score}</span>
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>
        <span className="text-xs font-bold dark:text-white">
          {currentIndex + 1}/{totalQuestions}
        </span>
      </div>
    </header>
  );
};