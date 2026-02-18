
import { Surah, FullSurahData, SurahDetail } from '../types';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

export const getAllSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/surah`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data.map((surah: any) => ({
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType,
    }));
  } catch (error) {
    console.error("Failed to fetch surahs:", error);
    return [];
  }
};

export const getSurahDetail = async (surahNumber: number): Promise<FullSurahData | null> => {
    try {
        const editions = 'quran-uthmani,en.transliteration,id.indonesian';
        const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/editions/${editions}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch surah ${surahNumber}`);
        }
        const data = await response.json();
        
        const arabicData: SurahDetail = data.data[0];
        const transliterationData = data.data[1];
        const translationData = data.data[2];

        return {
            number: arabicData.number,
            name: arabicData.name,
            englishName: arabicData.englishName,
            englishNameTranslation: arabicData.englishNameTranslation,
            revelationType: arabicData.revelationType,
            numberOfAyahs: arabicData.numberOfAyahs,
            arabicAyahs: arabicData.ayahs,
            transliterationAyahs: transliterationData.ayahs.map((ayah: any) => ({number: ayah.number, text: ayah.text})),
            translationAyahs: translationData.ayahs.map((ayah: any) => ({number: ayah.number, text: ayah.text})),
        };
    } catch (error) {
        console.error(`Error fetching details for surah ${surahNumber}:`, error);
        return null;
    }
};
