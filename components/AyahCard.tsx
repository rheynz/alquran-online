
import React, { useState } from 'react';
import { PlayIcon, PauseIcon, BookmarkIcon, BookmarkFilledIcon, CopyIcon, ShareIcon } from './icons';

interface AyahCardProps {
  ayahNumber: number;
  arabicText: string;
  transliterationText: string;
  translationText: string;
  audioUrl: string;
  isPlaying: boolean;
  isBookmarked: boolean;
  onPlayPause: () => void;
  onBookmark: () => void;
  fontStyles: {
    arabic: React.CSSProperties;
    translation: React.CSSProperties;
    transliteration: React.CSSProperties;
  };
}

export const AyahCard: React.FC<AyahCardProps> = ({
  ayahNumber,
  arabicText,
  transliterationText,
  translationText,
  isPlaying,
  isBookmarked,
  onPlayPause,
  onBookmark,
  fontStyles,
}) => {
  const [copyStatus, setCopyStatus] = useState('Salin');

  const handleCopy = () => {
    const textToCopy = `QS. [${ayahNumber}] \n${arabicText}\n\nTerjemahan: \n${translationText}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus('Tersalin!');
      setTimeout(() => setCopyStatus('Salin'), 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
      setCopyStatus('Gagal');
      setTimeout(() => setCopyStatus('Salin'), 2000);
    });
  };

  const handleShare = () => {
    const shareData = {
      title: `Quran Ayat`,
      text: `QS. [${ayahNumber}] \n${arabicText}\n\nTerjemahan: \n${translationText}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(err => console.error('Error sharing:', err));
    } else {
      alert('Web Share API tidak didukung di browser ini. Coba salin ayatnya.');
    }
  };

  return (
    <div id={`ayah-${ayahNumber}`} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <span className="text-lg font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-gray-700 px-3 py-1 rounded-md">
          {ayahNumber}
        </span>
      </div>
      
      <p dir="rtl" className="font-amiri text-right text-gray-900 dark:text-gray-100 mb-4" style={fontStyles.arabic}>
        {arabicText}
      </p>

      <p className="text-gray-500 dark:text-gray-400 italic mb-4" style={fontStyles.transliteration}>
        {transliterationText}
      </p>

      <p className="text-gray-700 dark:text-gray-300" style={fontStyles.translation}>
        {translationText}
      </p>

      <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4 flex items-center space-x-2">
        <button onClick={onPlayPause} title={isPlaying ? 'Jeda' : 'Putar Audio'} className="p-2 rounded-full hover:bg-primary-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 transition-colors">
          {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
        </button>
        <button onClick={onBookmark} title={isBookmarked ? 'Hapus Penanda' : 'Tandai Ayat'} className="p-2 rounded-full hover:bg-primary-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 transition-colors">
          {isBookmarked ? <BookmarkFilledIcon className="w-5 h-5"/> : <BookmarkIcon className="w-5 h-5" />}
        </button>
        <button onClick={handleCopy} title="Salin Ayat" className="p-2 rounded-full hover:bg-primary-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 transition-colors">
          <CopyIcon className="w-5 h-5" />
        </button>
        {navigator.share && (
            <button onClick={handleShare} title="Bagikan Ayat" className="p-2 rounded-full hover:bg-primary-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 transition-colors">
                <ShareIcon className="w-5 h-5" />
            </button>
        )}
      </div>
    </div>
  );
};
