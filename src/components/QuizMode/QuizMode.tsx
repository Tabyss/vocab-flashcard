import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, QuizQuestion, QuestionMetric, QuizOption, QuizStats } from "./QuizModeTypes";
import { QuizModeHeader } from "./QuizModeHeader";
import { QuizModeProgressBar } from "./QuizModeProgressBar";
import { QuizModeQuestionArea } from "./QuizModeQuestionArea";
import { QuizModeResults } from "./QuizModeResults";

interface QuizModeProps {
  cards: Card[];
  onExit: () => void;
}

export default function QuizMode({ cards, onExit }: QuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizOption | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [questionMetrics, setQuestionMetrics] = useState<QuestionMetric[]>([]);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (cards.length < 4) {
      alert("Add at least 4 words to start a dynamic quiz!");
      onExit();
      return;
    }

    const generatedQuestions: QuizQuestion[] = cards
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
          const displayDef = isTrue ? currentCard.definition : others[0].definition;
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
          const regex = new RegExp(`\\b${currentCard.word}[a-z]*\\b`, "gi");
          return {
            ...baseData,
            type,
            question: "Complete the sentence:",
            sentenceContext: (currentCard.sentence || "").replace(regex, "__________"),
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

  const handleAnswer = (option: QuizOption) => {
    if (isAnswered || !startTimeRef.current) return;
    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    const currentQ = quizData[currentIndex];

    // Simpan metrik lengkap, termasuk jawaban asli dan jawaban user untuk bahan pembahasan
    setQuestionMetrics((prev) => [
      ...prev,
      {
        question: currentQ.question,
        sentenceContext: currentQ.sentenceContext || null,
        correctAnswer: currentQ.type === 2
            ? currentQ.options.find((o) => o.isCorrect)?.text || ""
            : currentQ.correctDefinition || currentQ.correctWord,
        word: currentQ.correctWord,
        time: timeTaken,
        isCorrect: option.isCorrect,
        userAnswer: option.text,
        correctDefinition: currentQ.correctDefinition,
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

  const stats: QuizStats | null = useMemo(() => {
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
      <QuizModeHeader 
        score={score} 
        currentIndex={currentIndex} 
        totalQuestions={quizData.length} 
        onExit={onExit} 
      />

      <QuizModeProgressBar progress={progress} />

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
              {currentIndex === quizData.length - 1 ? "See Results 🏁" : "Next Question →"}
            </motion.button>
          ) : (
            <div className="w-full py-4 bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center text-gray-400 font-bold text-sm">
              Answer the question below
            </div>
          )}
        </AnimatePresence>
      </div>

      <QuizModeQuestionArea 
        currentQ={currentQ}
        currentIndex={currentIndex}
        isAnswered={isAnswered}
        selectedAnswer={selectedAnswer}
        handleAnswer={handleAnswer}
      />

      <AnimatePresence>
        {showResult && (
          <QuizModeResults 
            score={score}
            totalQuestions={quizData.length}
            stats={stats}
            metrics={questionMetrics}
            onExit={onExit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}