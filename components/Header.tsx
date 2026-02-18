
import React from 'react';
import { SunIcon, MoonIcon, BookOpenIcon } from './icons';

interface HeaderProps {
  currentView: 'home' | 'surah' | 'tajwid';
  onHomeClick: () => void;
  onTajwidClick: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onHomeClick, onTajwidClick, isDarkMode, toggleDarkMode }) => {
  const getLinkClass = (view: 'home' | 'tajwid') => {
    const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const isActive = (currentView === view || (currentView === 'surah' && view === 'home'));
    return `${baseClass} ${isActive ? 'bg-primary-700 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700'}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={onHomeClick} className="flex-shrink-0 flex items-center gap-2 text-primary-700 dark:text-primary-400">
              <BookOpenIcon className="w-8 h-8"/>
              <span className="font-bold text-xl">Quran Digital</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={onHomeClick} className={getLinkClass('home')}>
              Daftar Surah
            </button>
            <button onClick={onTajwidClick} className={getLinkClass('tajwid')}>
              Belajar Tajwid
            </button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors">
              {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
