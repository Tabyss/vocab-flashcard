import React from "react";
import { motion } from "framer-motion";
import { QuestionMetric, QuizStats } from "./QuizModeTypes";

interface QuizModeResultsProps {
  score: number;
  totalQuestions: number;
  stats: QuizStats | null;
  metrics: QuestionMetric[];
  onExit: () => void;
}

export const QuizModeResults: React.FC<QuizModeResultsProps> = ({
  score,
  totalQuestions,
  stats,
  metrics,
  onExit,
}) => {
  const incorrectAnswers = metrics.filter((m) => !m.isCorrect);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-950 w-full max-w-xl rounded-[2.5rem] p-6 md:p-8 text-center shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 text-left">
          <div className="text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
              Quiz Analysis
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Score</p>
              <p className="text-2xl font-black text-green-500">{score}/{totalQuestions}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg. Speed</p>
              <p className="text-2xl font-black text-blue-500">{stats?.avgTime}s</p>
            </div>
          </div>

          {/* Hardest Challenge */}
          {stats?.slowest && (
            <div className="w-full p-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-800/50 rounded-2xl mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">Hardest Challenge</p>
                  <h3 className="text-xl font-black dark:text-white">"{stats.slowest.word}"</h3>
                </div>
                <span className="text-[10px] font-bold text-white bg-orange-500 px-2 py-1 rounded-full uppercase">Took {stats.slowest.time.toFixed(1)}s</span>
              </div>
            </div>
          )}

          {/* Pembahasan Soal Salah */}
          {incorrectAnswers.length > 0 && (
            <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📝</span> Pembahasan Jawaban Salah
              </h3>
              <div className="space-y-4">
                {incorrectAnswers.map((item, idx) => (
                  <div key={idx} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                      <span className="text-red-500 font-bold">Q:</span> {item.sentenceContext ? `"${item.sentenceContext}"` : item.question}
                    </p>
                    <div className="text-xs space-y-1 mt-3 bg-white dark:bg-gray-900 p-3 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400">
                        Jawabanmu: <span className="text-red-500 line-through">{item.userAnswer}</span>
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Seharusnya: <span className="text-green-600 dark:text-green-400 font-bold">{item.correctAnswer}</span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 italic border-t border-gray-100 dark:border-gray-800 pt-2">
                        <span className="font-bold not-italic">{item.word}:</span> {item.correctDefinition}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {incorrectAnswers.length === 0 && (
            <div className="mt-6 p-6 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
              <h3 className="text-lg font-bold text-green-500 mb-2">Sempurna! 🎉</h3>
              <p className="text-sm text-gray-500">Kamu berhasil menjawab semua pertanyaan dengan benar.</p>
            </div>
          )}
        </div>

        <button
          onClick={onExit}
          className="mt-6 w-full py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-black text-lg active:scale-95 transition-all shadow-xl shrink-0"
        >
          Back to Library
        </button>
      </motion.div>
    </motion.div>
  );
};