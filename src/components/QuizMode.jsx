import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizMode({ cards, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const [totalTime, setTotalTime] = useState(0); 
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (cards.length < 4) {
      alert("Add at least 4 words to start a dynamic quiz!");
      onExit();
      return;
    }

    const generatedQuestions = cards.map((currentCard) => {
      const type = Math.floor(Math.random() * 3);
      const others = cards.filter(c => c.id !== currentCard.id)
                          .sort(() => Math.random() - 0.5)
                          .slice(0, 3);

      if (type === 0) {
        const options = [
          { text: currentCard.definition, isCorrect: true },
          ...others.map(o => ({ text: o.definition, isCorrect: false }))
        ].sort(() => Math.random() - 0.5);

        return { 
          type, 
          question: `What is the definition of "${currentCard.word}"?`, 
          options, 
          correctWord: currentCard.word,
          correctDefinition: currentCard.definition 
        };
      
      } else if (type === 1) { 
        const options = [
          { text: currentCard.word, isCorrect: true },
          ...others.map(o => ({ text: o.word, isCorrect: false }))
        ].sort(() => Math.random() - 0.5);

        return { 
          type, 
          question: `Which word means: "${currentCard.definition}"?`, 
          options, 
          correctWord: currentCard.word,
          correctDefinition: currentCard.definition 
        };
      
      } else {
        const isActuallyTrue = Math.random() > 0.5;
        const displayDef = isActuallyTrue ? currentCard.definition : others[0].definition;
        
        return { 
          type, 
          question: `Does "${currentCard.word}" mean: "${displayDef}"?`, 
          options: [
            { text: "True", isCorrect: isActuallyTrue },
            { text: "False", isCorrect: !isActuallyTrue }
          ],
          correctWord: currentCard.word,
          correctDefinition: currentCard.definition
        };
      }
    }).sort(() => Math.random() - 0.5);

    setQuizData(generatedQuestions);
    startTimeRef.current = Date.now();
  }, [cards]);

  const handleAnswer = (option) => {
    if (isAnswered) return;
    
    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    setTotalTime(prev => prev + timeTaken);

    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option.isCorrect) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      startTimeRef.current = Date.now();
    } else {
      const avgTime = (totalTime / quizData.length).toFixed(1);
      alert(`Quiz Finished!\nScore: ${score}/${quizData.length}\nAvg. Speed: ${avgTime}s per word`);
      onExit();
    }
  };

  if (quizData.length === 0) return null;
  const currentQ = quizData[currentIndex];

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-950 z-50 flex flex-col items-center p-6 overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8 mt-4">
        <button onClick={onExit} className="text-gray-400 font-bold hover:text-red-500 transition">✕ Quit</button>
        <div className="flex gap-4 items-center">
          <div className="text-right">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</p>
             <p className="text-sm font-bold dark:text-white">{score} / {quizData.length}</p>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800"></div>
          <div className="text-left">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Speed</p>
             <p className="text-sm font-bold dark:text-white">
               {currentIndex > 0 ? (totalTime / currentIndex).toFixed(1) : '0'}s
             </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mb-12 overflow-hidden">
        <motion.div 
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / quizData.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <main className="w-full max-w-2xl flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <div className="text-center mb-10">
              <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-4 block">
                {currentQ.type === 2 ? 'True or False' : 'Multiple Choice'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {currentQ.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={`p-5 rounded-2xl border-2 text-left transition-all font-medium text-lg flex justify-between items-center
                    ${!isAnswered ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:translate-x-1' : ''}
                    ${isAnswered && option.isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400' : ''}
                    ${isAnswered && selectedAnswer === option && !option.isCorrect ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400' : ''}
                    ${isAnswered && !option.isCorrect && selectedAnswer !== option ? 'opacity-40 border-transparent scale-95' : ''}
                  `}
                >
                  <span className="flex-1">{option.text}</span>
                  {isAnswered && option.isCorrect && <span className="ml-4">✅</span>}
                  {isAnswered && selectedAnswer === option && !option.isCorrect && <span className="ml-4">❌</span>}
                </button>
              ))}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50"
              >
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-lg">💡</span>
                   <p className="text-sm text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider">Learning Note</p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-black text-blue-600 dark:text-blue-400">{currentQ.correctWord}</span>: {currentQ.correctDefinition}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Button */}
      <footer className="w-full max-w-2xl py-8">
        <button 
          onClick={nextQuestion}
          disabled={!isAnswered}
          className={`w-full py-5 rounded-3xl font-black text-xl transition-all shadow-xl active:scale-95
            ${isAnswered ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}
          `}
        >
          {currentIndex === quizData.length - 1 ? 'See Final Results' : 'Next Question →'}
        </button>
      </footer>
    </div>
  );
}