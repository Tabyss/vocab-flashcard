import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddWordModal({ isOpen, onClose, onAdd }) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [sentence, setSentence] = useState('');
  
  const [repetitionCount, setRepetitionCount] = useState(0);
  const [practiceInput, setPracticeInput] = useState('');
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setWord('');
      setDefinition('');
      setSentence('');
      setRepetitionCount(0);
      setPracticeInput('');
      setIsLocked(true);
    }
  }, [isOpen]);

  const handlePracticeKeyUp = (e) => {
    if (e.key === 'Enter') {
      if (practiceInput.toLowerCase().trim() === word.toLowerCase().trim()) {
        const nextCount = repetitionCount + 1;
        setRepetitionCount(nextCount);
        setPracticeInput('');
        
        if (nextCount >= 5) {
          setIsLocked(false);
        }
      } else {
        setPracticeInput('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;
    onAdd({ word, definition, sentence });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-950 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
      >
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black dark:text-white">Add New Word</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500">✕</button>
          </div>

          <div className="space-y-4">
            {/* Input Utama */}
            <input
              required
              placeholder="The Word (e.g. Obsolete)"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 dark:text-white outline-none font-bold"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              disabled={repetitionCount > 0}
            />
            <input
              required
              placeholder="Meaning / Definition"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              disabled={repetitionCount > 0}
            />
            <textarea
              required
              placeholder="Example Sentence"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 dark:text-white outline-none h-24 resize-none"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              disabled={repetitionCount > 0}
            />

            {word && definition && sentence && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-800"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    Memory Lock: Type "{word}" 5 times
                  </p>
                  <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    {repetitionCount}/5
                  </span>
                </div>

                {/* Progress Dots */}
                <div className="flex gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < repetitionCount ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
                  ))}
                </div>

                {isLocked ? (
                  <input
                    value={practiceInput}
                    onChange={(e) => setPracticeInput(e.target.value)}
                    onKeyUp={handlePracticeKeyUp}
                    placeholder="Type here and press Enter..."
                    className="w-full p-4 rounded-xl bg-white dark:bg-gray-900 border-2 border-blue-500 dark:text-white outline-none text-center font-black tracking-widest"
                    autoFocus
                  />
                ) : (
                  <div className="text-center py-2 text-green-600 dark:text-green-400 font-bold flex items-center justify-center gap-2">
                    <span>✅ Word Encoded! You're ready to save.</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className={`w-full mt-8 py-5 rounded-2xl font-black text-lg transition-all shadow-lg
              ${isLocked 
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white shadow-blue-500/40 hover:scale-[1.02] active:scale-95'}
            `}
          >
            Save to Library
          </button>
        </form>
      </motion.div>
    </div>
  );
}