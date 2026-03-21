import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizMode({ cards, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [questionMetrics, setQuestionMetrics] = useState([]);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (cards.length < 4) {
      alert("Add at least 4 words to start a dynamic quiz!");
      onExit();
      return;
    }

    const generatedQuestions = cards
      .map((currentCard) => {
        const type = Math.floor(Math.random() * 4);
        const others = cards
          .filter((c) => c.id !== currentCard.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const baseData = {
          correctWord: currentCard.word,
          correctDefinition: currentCard.definition,
          originalCard: currentCard,
        };

        if (type === 0) {
          return {
            ...baseData,
            type,
            question: `What is the definition of "${currentCard.word}"?`,
            options: [
              { text: currentCard.definition, isCorrect: true },
              ...others.map((o) => ({ text: o.definition, isCorrect: false })),
            ].sort(() => Math.random() - 0.5),
          };
        } else if (type === 1) {
          return {
            ...baseData,
            type,
            question: `Which word means: "${currentCard.definition}"?`,
            options: [
              { text: currentCard.word, isCorrect: true },
              ...others.map((o) => ({ text: o.word, isCorrect: false })),
            ].sort(() => Math.random() - 0.5),
          };
        } else if (type === 2) {
          const isTrue = Math.random() > 0.5;
          const displayDef = isTrue
            ? currentCard.definition
            : others[0].definition;
          return {
            ...baseData,
            type,
            question: `Does "${currentCard.word}" mean: "${displayDef}"?`,
            options: [
              { text: "True", isCorrect: isTrue },
              { text: "False", isCorrect: !isTrue },
            ],
          };
        } else {
          const regex = new RegExp(currentCard.word, "gi");
          return {
            ...baseData,
            type,
            question: "Complete the sentence:",
            sentenceContext: currentCard.sentence.replace(regex, "__________"),
            options: [
              { text: currentCard.word, isCorrect: true },
              ...others.map((o) => ({ text: o.word, isCorrect: false })),
            ].sort(() => Math.random() - 0.5),
          };
        }
      })
      .sort(() => Math.random() - 0.5);

    setQuizData(generatedQuestions);
    startTimeRef.current = Date.now();
  }, [cards, onExit]);

  const handleAnswer = (option) => {
    if (isAnswered) return;
    const timeTaken = (Date.now() - startTimeRef.current) / 1000;

    setQuestionMetrics((prev) => [
      ...prev,
      {
        question: quizData[currentIndex].question,
        sentenceContext: quizData[currentIndex].sentenceContext || null,
        correctAnswer:
          quizData[currentIndex].type === 2
            ? quizData[currentIndex].options.find((o) => o.isCorrect).text
            : quizData[currentIndex].correctDefinition ||
              quizData[currentIndex].correctWord,
        word: quizData[currentIndex].correctWord,
        time: timeTaken,
        isCorrect: option.isCorrect,
      },
    ]);

    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option.isCorrect) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex((c) => c + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      startTimeRef.current = Date.now();
    } else {
      setShowResult(true);
    }
  };

  const stats = useMemo(() => {
    if (questionMetrics.length === 0) return null;
    const totalTime = questionMetrics.reduce((acc, m) => acc + m.time, 0);
    const slowest = [...questionMetrics].sort((a, b) => b.time - a.time)[0];
    return {
      avgTime: (totalTime / questionMetrics.length).toFixed(1),
      slowest: slowest,
    };
  }, [questionMetrics]);

  if (quizData.length === 0) return null;
  const currentQ = quizData[currentIndex];
  const progress = ((currentIndex + 1) / quizData.length) * 100;

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-950 z-50 flex flex-col items-center p-6 overflow-hidden">
      <header className="w-full max-w-2xl flex justify-between items-center mb-6 mt-4 shrink-0">
        <button
          onClick={onExit}
          className="text-gray-400 font-bold hover:text-red-500 transition px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
        >
          ✕ Quit
        </button>
        <div className="flex gap-4 items-center bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <span className="text-xs font-bold dark:text-white">
            Score: {score}
          </span>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>
          <span className="text-xs font-bold dark:text-white">
            {currentIndex + 1}/{quizData.length}
          </span>
        </div>
      </header>

      <div className="w-full max-w-2xl mb-8 shrink-0">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-2xl mb-6 shrink-0">
        <AnimatePresence mode="wait">
          {isAnswered ? (
            <motion.button
              key="next"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={nextQuestion}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
            >
              {currentIndex === quizData.length - 1
                ? "See Results 🏁"
                : "Next Question →"}
            </motion.button>
          ) : (
            <div className="w-full py-4 bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center text-gray-400 font-bold text-sm">
              Answer the question below
            </div>
          )}
        </AnimatePresence>
      </div>

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
                    ${isAnswered && selectedAnswer === option && !option.isCorrect ? "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400" : ""}
                    ${isAnswered && !option.isCorrect && selectedAnswer !== option ? "opacity-30 grayscale pointer-events-none" : ""}
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

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-gray-950 w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="overflow-y-auto custom-scrollbar pr-2">
                <div className="text-5xl mb-4">📊</div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                  Quiz Analysis
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Final Score
                    </p>
                    <p className="text-2xl font-black text-green-500">
                      {score}/{quizData.length}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Avg. Speed
                    </p>
                    <p className="text-2xl font-black text-blue-500">
                      {stats?.avgTime}s
                    </p>
                  </div>
                </div>

                <div className="w-full p-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-800/50 rounded-2xl mb-8 text-left">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                        Hardest Challenge
                      </p>
                      <h3 className="text-xl font-black dark:text-white">
                        "{stats?.slowest?.word}"
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-white bg-orange-500 px-2 py-1 rounded-full uppercase">
                      Took {stats?.slowest?.time.toFixed(1)}s
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-orange-200 dark:border-orange-800/50">
                    <div>
                      <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">
                        The Question
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {stats?.slowest?.sentenceContext
                          ? `"${stats?.slowest?.sentenceContext}"`
                          : stats?.slowest?.question}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onExit}
                className="mt-6 w-full py-5 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-black text-lg active:scale-95 transition-all shadow-xl shrink-0"
              >
                Back to Library
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
