import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddWordModal({ isOpen, onClose, onSave, initialData }) {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [sentence, setSentence] = useState("");

  const [repetitionCount, setRepetitionCount] = useState(0);
  const [practiceInput, setPracticeInput] = useState("");
  const [isLocked, setIsLocked] = useState(true);
  const [isError, setIsError] = useState(false);

  const practiceInputRef = useRef(null);

  // 1. Inisialisasi Data - Selalu Kunci di Awal
  useEffect(() => {
    if (isOpen) {
      setWord(initialData?.word || "");
      setDefinition(initialData?.definition || "");
      setSentence(initialData?.sentence || "");

      // Selalu mulai dari nol dan terkunci agar user wajib ketik 5x
      setRepetitionCount(0);
      setIsLocked(true);
      setPracticeInput("");
      setIsError(false);
    }
  }, [isOpen, initialData]);

  // 2. Handle Perubahan Kata Utama
  const handleWordChange = (e) => {
    setWord(e.target.value);
    // Jika kata diubah saat sedang latihan, reset hitungan
    setRepetitionCount(0);
    setIsLocked(true);
  };

  // 3. Anti-Paste
  const handlePreventPaste = (e) => {
    e.preventDefault();
  };

  // 4. Logika Validasi Ketik 5x
  const handlePracticeKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Gunakan trim() untuk menghindari error karena spasi di awal/akhir
      const target = word.trim().toLowerCase();
      const input = practiceInput.trim().toLowerCase();

      if (input === target && target !== "") {
        const nextCount = repetitionCount + 1;
        setRepetitionCount(nextCount);
        setPracticeInput("");
        setIsError(false);

        if (nextCount >= 5) {
          setIsLocked(false);
        }
      } else {
        setIsError(true);
        setPracticeInput("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;
    
    onSave({
      word: word.trim(),
      definition: definition.trim(),
      sentence: sentence.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-950 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
      >
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black dark:text-white">
              {initialData?.word ? "Edit Word" : "Add New Word"}
            </h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
          </div>

          <div className="space-y-6">
            {/* STEP 1: INPUT UTAMA */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Step 1: Focus Word</label>
              <input
                required
                onPaste={handlePreventPaste}
                placeholder="Type the word..."
                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:text-white outline-none font-bold transition-all"
                value={word}
                onChange={handleWordChange} 
              />
            </div>

            {/* STEP 2: MEMORY LOCK PANEL (Selalu muncul sampai 5x tercapai) */}
            <AnimatePresence>
              {word.trim().length > 0 && isLocked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-800"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      Repeat "{word.trim()}" {5 - repetitionCount}x to Unlock
                    </p>
                    <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">{repetitionCount}/5</span>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < repetitionCount ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"}`} />
                    ))}
                  </div>

                  <motion.input
                    ref={practiceInputRef}
                    autoFocus
                    onPaste={handlePreventPaste}
                    animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                    value={practiceInput}
                    onChange={(e) => setPracticeInput(e.target.value)}
                    onKeyDown={handlePracticeKeyDown}
                    placeholder="Type and press Enter..."
                    className={`w-full p-4 rounded-xl bg-white dark:bg-gray-900 border-2 outline-none text-center font-black tracking-widest transition-colors ${isError ? "border-red-500" : "border-blue-500"} dark:text-white`}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`space-y-4 transition-all duration-500 ${isLocked ? "opacity-20 pointer-events-none blur-sm grayscale" : "opacity-100 blur-0"}`}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Step 2: Meaning</label>
                <input
                  required={!isLocked}
                  placeholder="What does it mean?"
                  className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:text-white outline-none"
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Step 3: Usage</label>
                <textarea
                  required={!isLocked}
                  placeholder="Write an example sentence..."
                  className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:text-white outline-none h-24 resize-none"
                  value={sentence}
                  onChange={(e) => setSentence(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLocked || !definition.trim() || !sentence.trim()}
            className={`w-full mt-8 py-5 rounded-2xl font-black text-lg transition-all shadow-lg ${isLocked || !definition.trim() || !sentence.trim() ? "bg-gray-200 dark:bg-gray-800 text-gray-400" : "bg-blue-600 text-white shadow-blue-500/40 hover:scale-[1.02] active:scale-95"}`}
          >
            Save to Library
          </button>
        </form>
      </motion.div>
    </div>
  );
}