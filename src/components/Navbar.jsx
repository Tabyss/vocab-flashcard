import React from 'react';

export default function Navbar({ isDark, setIsDark }) {
  return (
    <nav className="w-full p-6 flex justify-between items-center">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
        Thabys<span className="text-blue-500">VOCAB.</span>
      </h1>
      <button 
        onClick={() => setIsDark(!isDark)} 
        className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-xl"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}