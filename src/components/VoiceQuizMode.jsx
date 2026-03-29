import { useState } from "react";
import { motion } from "framer-motion";

export default function ListeningQuiz({ cards, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [listenCount, setListenCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

  const currentCard = cards[currentIndex];

  const playVoice = () => {
    if (listenCount >= 3 || isAnswered) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentCard.word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
    setListenCount((prev) => prev + 1);
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const correct =
      userInput.toLowerCase().trim() === currentCard.word.toLowerCase().trim();
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((c) => c + 1);
      setUserInput("");
      setListenCount(0);
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      alert(`Quiz Selesai! Skor: ${score}/${cards.length}`);
      onExit();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-[60] flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md text-center">
        <header className="mb-8">
          <p className="text-xs font-black text-blue-400 uppercase tracking-widest">
            Listening Challenge
          </p>
          <h2 className="text-xl font-bold">
            Question {currentIndex + 1} / {cards.length}
          </h2>
        </header>

        <div className="bg-gray-800 rounded-[2rem] p-8 shadow-2xl border border-gray-700">
          <div className="mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={playVoice}
              disabled={listenCount >= 3 || isAnswered}
              className={`w-24 h-24 rounded-full text-4xl shadow-lg transition-all
                ${listenCount >= 3 ? "bg-gray-700 text-gray-500" : "bg-blue-600 text-white shadow-blue-500/20"}
              `}
            >
              🔊
            </motion.button>
            <p className="mt-4 text-sm font-medium text-gray-400">
              Listen limit:{" "}
              <span
                className={listenCount >= 3 ? "text-red-500" : "text-blue-400"}
              >
                {listenCount}/3
              </span>
            </p>
          </div>

          <form onSubmit={checkAnswer} className="space-y-4">
            <input
              autoFocus
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isAnswered}
              placeholder="Type what you hear..."
              className={`w-full px-6 py-4 rounded-xl bg-gray-900 border-2 transition-all outline-none text-center text-lg
                ${isAnswered && isCorrect ? "border-green-500 text-green-400" : ""}
                ${isAnswered && !isCorrect ? "border-red-500 text-red-400" : "border-gray-700 focus:border-blue-500"}
              `}
            />

            {!isAnswered ? (
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg"
              >
                Check Answer
              </button>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="mb-4 text-sm">
                  Answer:{" "}
                  <span className="font-bold text-green-400">
                    {currentCard.word}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="w-full py-4 bg-gray-100 text-black rounded-xl font-bold hover:bg-white transition-all"
                >
                  Next Question →
                </button>
              </motion.div>
            )}
          </form>
        </div>

        <button
          onClick={onExit}
          className="mt-8 text-gray-500 hover:text-white font-medium transition"
        >
          ✕ Quit Quiz
        </button>
      </div>
    </div>
  );
}
