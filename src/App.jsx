import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Firebase config
import { db } from './firebase'; 
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  doc 
} from "firebase/firestore";

// Import Components
import Navbar from './components/Navbar';
import Flashcard from './components/Flashcard';
import AddWordModal from './components/AddWordModal';
import QuizMode from './components/QuizMode';

export default function App() {
  const [allCards, setAllCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null); // State baru untuk Edit
  const [view, setView] = useState('library');
  const inputRef = useRef(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [isDark]);

  useEffect(() => {
    const q = query(collection(db, "flashcards"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllCards(cardsData);
    }, (error) => {
      console.error("Firestore Error:", error);
    });
    return () => unsubscribe();
  }, []);

  const isWordExists = useMemo(() => {
    return allCards.some(c => c.word?.toLowerCase() === searchTerm.trim().toLowerCase());
  }, [searchTerm, allCards]);

  const filteredCards = useMemo(() => {
    if (!searchTerm.trim()) return allCards;
    return allCards.filter(c => 
      c.word?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [searchTerm, allCards]);

  // Fungsi buka modal untuk TAMBAH baru
  const openAddModal = () => {
    setEditingCard(null); 
    setIsModalOpen(true);
  };

  // Fungsi buka modal untuk EDIT
  const openEditModal = (card) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingCard) {
        // LOGIKA UPDATE (EDIT)
        const docRef = doc(db, "flashcards", editingCard.id);
        await updateDoc(docRef, {
          definition: data.definition,
          sentence: data.sentence
        });
      } else {
        // LOGIKA ADD NEW
        await addDoc(collection(db, "flashcards"), {
          ...data,
          createdAt: serverTimestamp()
        });
        setSearchTerm('');
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Error processing word: " + err.message);
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500 flex flex-col overflow-hidden">
      
      <AnimatePresence>
        {view === 'quiz' && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50"
          >
            <QuizMode cards={allCards} onExit={() => setView('library')} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-none z-30 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        
        <div className="max-w-6xl mx-auto px-6 pt-4 pb-8 w-full h-[60vh] flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Library</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{allCards.length} Words Mastered</p>
            </div>
            {allCards.length > 0 && (
              <button 
                onClick={() => setView('quiz')}
                className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center gap-2 active:scale-95"
              >
                🚀 Quiz
              </button>
            )}
          </div>

          <div className="w-full max-w-2xl relative">
            <div className="relative">
              <input 
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search or add a new word..."
                className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-gray-900 text-lg dark:text-white font-medium shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all pr-36"
              />
              <AnimatePresence>
                {searchTerm.trim() && !isWordExists && (
                  <motion.button
                    onClick={openAddModal}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-all"
                  >
                    + Add New
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            {searchTerm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-6 left-4">
                {isWordExists ? (
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">✓ In Library</span>
                ) : (
                  <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">✨ New Word</span>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto custom-scrollbar pt-10 pb-20">
        <div className=" mx-auto px-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 w-full">
            <AnimatePresence mode='popLayout'>
              {filteredCards.map((card) => (
                <motion.div 
                  key={card.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.8 }} 
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-full flex justify-center"
                >
                  {/* Tambahkan prop onEdit */}
                  <Flashcard card={card} onEdit={openEditModal} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-20 opacity-20">
              <p className="text-6xl mb-4">📚</p>
              <p className="text-xl font-bold">No results found.</p>
            </div>
          )}
        </div>
      </main>

      {/* Update props AddWordModal */}
      <AddWordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        isEditMode={!!editingCard}
        initialData={editingCard ? editingCard : { word: searchTerm.trim() }} 
      />
    </div>
  );
}