
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSurahDetail } from '../services/quranApi';
import { FullSurahData, LastRead } from '../types';
import { AyahCard } from './AyahCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SurahDetailPageProps {
  surahNumber: number;
  onBack: () => void;
  setLastRead: (lastRead: LastRead | null) => void;
  scrollToAyah: number | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full text-right mt-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mt-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mt-2"></div>
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
    </div>
);

export const SurahDetailPage: React.FC<SurahDetailPageProps> = ({ surahNumber, onBack, setLastRead, scrollToAyah }) => {
  const [surahData, setSurahData] = useState<FullSurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>(`quran-bookmarks-${surahNumber}`, []);
  const [fontSize, setFontSize] = useLocalStorage<number>('quran-font-size', 16);
  const [autoplay, setAutoplay] = useLocalStorage('quran-autoplay', false);
  const onEndedCallbackRef = useRef<() => void>();

  const handlePlayPause = useCallback((ayahNumber: number, audioUrl: string) => {
    const audioPlayer = audioRef.current;
    if (!audioPlayer) return;

    if (playingAyah === ayahNumber) {
      audioPlayer.pause();
      setPlayingAyah(null);
    } else {
      audioPlayer.src = audioUrl;
      audioPlayer.play().catch(e => console.error("Audio play failed:", e));
      setPlayingAyah(ayahNumber);

      if (surahData) {
        setLastRead({
            surah: surahData.number,
            surahName: surahData.englishName,
            ayah: ayahNumber,
        });
      }
    }
  }, [playingAyah, surahData, setLastRead]);

  // Effect to update the 'ended' event callback with the latest state
  useEffect(() => {
    onEndedCallbackRef.current = () => {
      if (!autoplay) {
        setPlayingAyah(null);
        return;
      }
      
      const currentAyahIndex = surahData?.arabicAyahs.findIndex(
          (ayah) => ayah.numberInSurah === playingAyah
      );

      if (surahData && typeof currentAyahIndex === 'number' && currentAyahIndex > -1 && currentAyahIndex < surahData.arabicAyahs.length - 1) {
          const nextAyah = surahData.arabicAyahs[currentAyahIndex + 1];
          handlePlayPause(nextAyah.numberInSurah, nextAyah.audio);
      } else {
          setPlayingAyah(null);
      }
    };
  }, [autoplay, playingAyah, surahData, handlePlayPause]);

  // Effect to initialize the audio player and its listener ONCE
  useEffect(() => {
    audioRef.current = new Audio();
    const audioPlayer = audioRef.current;

    const handlePlaybackEnd = () => {
      onEndedCallbackRef.current?.();
    };
    audioPlayer.addEventListener('ended', handlePlaybackEnd);

    return () => {
      audioPlayer.pause();
      audioPlayer.removeEventListener('ended', handlePlaybackEnd);
    };
  }, []);

  // Effect to fetch surah data when the surahNumber changes.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingAyah(null);
    
    const fetchDetail = async () => {
      setLoading(true);
      const data = await getSurahDetail(surahNumber);
      setSurahData(data);
      setLoading(false);
    };
    fetchDetail();
  }, [surahNumber]);

  // Effect for scrolling to last read ayah
  useEffect(() => {
    if (scrollToAyah && !loading && surahData) {
        const element = document.getElementById(`ayah-${scrollToAyah}`);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100); 
        }
    }
  }, [scrollToAyah, loading, surahData]);

  // Effect for auto-scrolling to the currently playing ayah
  useEffect(() => {
    if (playingAyah && !loading) {
        const element = document.getElementById(`ayah-${playingAyah}`);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 50);
        }
    }
  }, [playingAyah, loading]);


  const toggleBookmark = (ayahNumber: number) => {
    const bookmarkId = `${surahNumber}:${ayahNumber}`;
    setBookmarks(prev => 
      prev.includes(bookmarkId) 
        ? prev.filter(b => b !== bookmarkId) 
        : [...prev, bookmarkId]
    );
  };
  
  const increaseFontSize = () => setFontSize(s => Math.min(s + 2, 40));
  const decreaseFontSize = () => setFontSize(s => Math.max(s - 2, 12));
  
  const fontStyles = {
    arabic: { fontSize: `${fontSize * 1.75}px`, lineHeight: `${fontSize * 3.2}px` },
    translation: { fontSize: `${fontSize}px` },
    transliteration: { fontSize: `${fontSize-2}px`}
  };

  const SurahHeader = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8 text-center space-y-4">
        <h1 className="text-4xl font-amiri font-bold text-primary-800 dark:text-primary-300 leading-relaxed">{surahData?.name}</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{surahData?.englishName}</h2>
        <p className="text-gray-500 dark:text-gray-400">{surahData?.englishNameTranslation}</p>
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{surahData?.revelationType}</span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            <span>{surahData?.numberOfAyahs} Ayat</span>
        </div>
    </div>
  );
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        <button onClick={onBack} className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-colors">
          &larr; Kembali ke Daftar Surah
        </button>
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <span className="text-sm">Font</span>
                <button onClick={decreaseFontSize} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-lg">-</button>
                <button onClick={increaseFontSize} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-lg">+</button>
            </div>
            <div className="flex items-center space-x-2">
                 <label htmlFor="autoplay-toggle" className="text-sm cursor-pointer select-none">Otomatis</label>
                 <button
                    id="autoplay-toggle"
                    onClick={() => setAutoplay(prev => !prev)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${autoplay ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    role="switch"
                    aria-checked={autoplay}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoplay ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                </button>
            </div>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4">
            <div className="animate-pulse bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-56"></div>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
        </div>
        ) : surahData ? (
        <>
          <SurahHeader />
          <div className="space-y-4">
            {surahData.arabicAyahs.map((ayah, index) => {
                const bookmarkId = `${surahData.number}:${ayah.numberInSurah}`;
                return (
                    <AyahCard 
                        key={ayah.number}
                        surahName={surahData.englishName}
                        ayahNumber={ayah.numberInSurah}
                        arabicText={ayah.text}
                        transliterationText={surahData.transliterationAyahs[index]?.text || ''}
                        translationText={surahData.translationAyahs[index]?.text || ''}
                        audioUrl={ayah.audio}
                        isPlaying={playingAyah === ayah.numberInSurah}
                        isBookmarked={bookmarks.includes(bookmarkId)}
                        onPlayPause={() => handlePlayPause(ayah.numberInSurah, ayah.audio)}
                        onBookmark={() => toggleBookmark(ayah.numberInSurah)}
                        fontStyles={fontStyles}
                    />
                );
            })}
          </div>
        </>
      ) : (
        <p>Gagal memuat data surah.</p>
      )}
    </div>
  );
};