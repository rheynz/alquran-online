
import React, { useState, useEffect, useMemo } from 'react';
import { getAllSurahs } from '../services/quranApi';
import { Surah, LastRead } from '../types';
import { SurahCard } from './SurahCard';

interface HomePageProps {
  onSurahClick: (surahNumber: number, ayahNumber?: number) => void;
  lastRead: LastRead | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
            <div className="bg-gray-300 dark:bg-gray-700 h-10 w-10 rounded-md"></div>
            <div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            </div>
        </div>
        <div className="text-right">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        </div>
    </div>
);


export const HomePage: React.FC<HomePageProps> = ({ onSurahClick, lastRead }) => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ayahSearchResult, setAyahSearchResult] = useState<{ surah: Surah; ayah: number } | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      setLoading(true);
      const data = await getAllSurahs();
      setSurahs(data);
      setLoading(false);
    };
    fetchSurahs();
  }, []);
  
  useEffect(() => {
    const match = searchTerm.trim().match(/^(\d{1,3}):(\d{1,3})$/);
    if (match && surahs.length > 0) {
        const surahNumber = parseInt(match[1], 10);
        const ayahNumber = parseInt(match[2], 10);
        const targetSurah = surahs.find(s => s.number === surahNumber);

        if (targetSurah && ayahNumber > 0 && ayahNumber <= targetSurah.numberOfAyahs) {
            setAyahSearchResult({ surah: targetSurah, ayah: ayahNumber });
        } else {
            setAyahSearchResult(null);
        }
    } else {
        setAyahSearchResult(null);
    }
  }, [searchTerm, surahs]);

  const filteredSurahs = useMemo(() => {
    if (ayahSearchResult) return [];
    return surahs.filter(surah =>
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.number.toString().includes(searchTerm)
    );
  }, [surahs, searchTerm, ayahSearchResult]);

  const renderResults = () => {
    if (loading) {
      return Array.from({ length: 12 }).map((_, index) => <LoadingSkeleton key={index} />);
    }

    if (ayahSearchResult) {
      return (
        <div className="md:col-span-2 lg:col-span-3">
          <div
            onClick={() => onSurahClick(ayahSearchResult.surah.number, ayahSearchResult.ayah)}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-primary-500 dark:border-primary-400 flex items-center justify-between space-x-4"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-gray-700 text-primary-700 dark:text-primary-300 font-bold rounded-md">
                {ayahSearchResult.surah.number}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{ayahSearchResult.surah.englishName}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-300 font-medium">Buka Ayat {ayahSearchResult.ayah}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-amiri text-xl font-bold text-primary-700 dark:text-primary-400">{ayahSearchResult.surah.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ayahSearchResult.surah.numberOfAyahs} Ayat</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (filteredSurahs.length > 0) {
      return filteredSurahs.map(surah => (
        <SurahCard key={surah.number} surah={surah} onClick={() => onSurahClick(surah.number)} />
      ));
    }
    
    return (
       <p className="text-center text-gray-500 dark:text-gray-400 md:col-span-3">
         Hasil tidak ditemukan. Coba format "surah:ayat" seperti "2:255".
       </p>
    );
  };


  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary-800 dark:text-primary-400">Daftar Surah Al-Qur'an</h1>
        
        {lastRead && (
            <div className="bg-primary-50 dark:bg-gray-800 border-l-4 border-primary-500 text-primary-800 dark:text-primary-200 p-4 rounded-r-lg shadow-md" role="alert">
                <p className="font-bold">Terakhir Dibaca</p>
                <p>
                    Anda terakhir membaca Surah {lastRead.surahName} ayat {lastRead.ayah}.
                    <button onClick={() => onSurahClick(lastRead.surah, lastRead.ayah)} className="ml-2 font-semibold underline hover:text-primary-600 dark:hover:text-primary-300">
                        Lanjutkan Membaca
                    </button>
                </p>
            </div>
        )}

        <div className="sticky top-16 z-40 py-4 bg-cream/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <input
                type="text"
                placeholder="Cari surah atau surah:ayat (e.g., 2:255)"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderResults()}
      </div>
    </div>
  );
};
