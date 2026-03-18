import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddWordModal({ isOpen, onClose, onSave, initialData, isEditMode }) {
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    sentence: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        word: initialData?.word || '',
        definition: initialData?.definition || '',
        sentence: initialData?.sentence || ''
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.definition || !formData.sentence) return alert('Please fill all fields');
    
    onSave(isEditMode ? { ...formData, id: initialData.id } : formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800"
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-black mb-8 text-gray-900 dark:text-white tracking-tight">
              {isEditMode ? 'Edit Vocabulary' : 'Add New Vocabulary'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Word</label>
                <input 
                  type="text" 
                  value={formData.word} 
                  readOnly 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 font-bold dark:text-white outline-none border border-gray-100 dark:border-gray-800 opacity-60" 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Definition</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.definition} 
                  onChange={e => setFormData({...formData, definition: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none" 
                  placeholder="Meaning in English..."
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Example Sentence</label>
                <input 
                  required
                  type="text" 
                  value={formData.sentence} 
                  onChange={e => setFormData({...formData, sentence: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" 
                  placeholder="How is it used?"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white transition">Cancel</button>
                <button type="submit" className="flex-1 py-4 font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-500 shadow-xl shadow-blue-500/30 transition-all active:scale-95">
                  {isEditMode ? 'Update Word' : 'Save to Cloud'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}