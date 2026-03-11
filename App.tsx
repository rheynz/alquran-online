
import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { SurahDetailPage } from './components/SurahDetailPage';
import { TajwidPage } from './components/TajwidPage';
import { Header } from './components/Header';
import { LastRead } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

type View = 'home' | 'surah' | 'tajwid';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useLocalStorage('quran-dark-mode', false);
  const [lastRead, setLastRead] = useLocalStorage<LastRead | null>('quran-last-read', null);
  const [scrollToAyah, setScrollToAyah] = useState<number | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navigateToSurah = (surahNumber: number, ayahNumber: number | null = null) => {
    setSelectedSurah(surahNumber);
    setView('surah');
    setScrollToAyah(ayahNumber);
    if (!ayahNumber) {
        window.scrollTo(0, 0);
    }
  };
  
  const navigateToHome = () => {
    setSelectedSurah(null);
    setScrollToAyah(null);
    setView('home');
  };

  const navigateToTajwid = () => {
    setView('tajwid');
  };

  const renderContent = () => {
    switch (view) {
      case 'surah':
        return selectedSurah ? <SurahDetailPage surahNumber={selectedSurah} onBack={navigateToHome} setLastRead={setLastRead} scrollToAyah={scrollToAyah} /> : <HomePage onSurahClick={navigateToSurah} lastRead={lastRead} />;
      case 'tajwid':
        return <TajwidPage />;
      case 'home':
      default:
        return <HomePage onSurahClick={navigateToSurah} lastRead={lastRead} />;
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header 
        currentView={view} 
        onHomeClick={navigateToHome} 
        onTajwidClick={navigateToTajwid} 
        isDarkMode={darkMode} 
        toggleDarkMode={() => setDarkMode(!darkMode)} 
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
