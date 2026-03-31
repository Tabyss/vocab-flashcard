import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion, QuizOption } from "./QuizModeTypes";

interface QuizModeQuestionAreaProps {
  currentQ: QuizQuestion;
  currentIndex: number;
  isAnswered: boolean;
  selectedAnswer: QuizOption | null;
  handleAnswer: (option: QuizOption) => void;
}

export const QuizModeQuestionArea: React.FC<QuizModeQuestionAreaProps> = ({
  currentQ,
  currentIndex,
  isAnswered,
  selectedAnswer,
  handleAnswer,
}) => {
  return (
    <main className="w-full max-w-2xl flex-1 overflow-y-auto custom-scrollbar pb-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="text-center mb-8 px-4">
            <span className="inline-block text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest mb-4 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              {currentQ.type === 3 ? "Contextual Fill" : "Lexical Knowledge"}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {currentQ.question}
            </h2>
            {currentQ.type === 3 && (
              <div className="mt-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 shadow-inner">
                <p className="text-lg text-gray-600 dark:text-gray-300 italic">
                  "{currentQ.sentenceContext}"
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 w-full">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`p-4 rounded-xl border-2 text-left transition-all font-medium
                  ${!isAnswered ? "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-500" : ""}
                  ${isAnswered && option.isCorrect ? "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400" : ""}
                  ${isAnswered && selectedAnswer?.text === option.text && !option.isCorrect ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400" : ""}
                  ${isAnswered && !option.isCorrect && selectedAnswer?.text !== option.text ? "opacity-30 grayscale pointer-events-none" : ""}
                `}
              >
                {option.text}
              </button>
            ))}
          </div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/50"
            >
              <p className="text-sm dark:text-gray-300">
                <span className="font-bold text-blue-600">
                  {currentQ.correctWord}
                </span>
                : {currentQ.correctDefinition}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};