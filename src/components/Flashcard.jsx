import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const speak = (text) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

export default function Flashcard({ card, onEdit }) {
  const [isFlipped, setIsFlipped] = useState(false);
  useEffect(() => setIsFlipped(false), [card.id]);

  return (
    <div
      className="w-full max-w-sm h-56 cursor-pointer perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d shadow-xl rounded-3xl"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 25,
        }}
      >
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 flex flex-col justify-center items-center p-6 rounded-3xl  text-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-all opacity-0 group-hover:opacity-100"
            title="Edit card"
          >
            ✏️
          </button>

          <h1 className="text-4xl capitalize font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            {card.word}
          </h1>
          <button
            onClick={(e) => {
              e.stopPropagation();
              speak(card.word);
            }}
            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:scale-110 transition active:scale-95 text-xl"
          >
            🔊
          </button>
        </div>

        <div className="absolute inset-0 backface-hidden bg-gray-50 dark:bg-gray-900 rotate-y-180 flex flex-col justify-center p-6 rounded-3xl">
          <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">
            Definition
          </h2>
          <p className="text-lg font-medium dark:text-gray-100 leading-tight mb-4">
            {card.definition}
          </p>
          <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
            Example
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            "{card.sentence}"
          </p>
        </div>
      </motion.div>
    </div>
  );
}
