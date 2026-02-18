
import React from 'react';
import { Surah } from '../types';

interface SurahCardProps {
  surah: Surah;
  onClick: () => void;
}

export const SurahCard: React.FC<SurahCardProps> = ({ surah, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 flex items-center justify-between space-x-4"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-gray-700 text-primary-700 dark:text-primary-300 font-bold rounded-md">
          {surah.number}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{surah.englishName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{surah.englishNameTranslation}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-amiri text-xl font-bold text-primary-700 dark:text-primary-400">{surah.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{surah.numberOfAyahs} Ayat</p>
      </div>
    </div>
  );
};
