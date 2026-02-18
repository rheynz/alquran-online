
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  audio: string;
  text: string;
  numberInSurah: number;
}

export interface AyahTransliteration {
    number: number;
    text: string;
}

export interface AyahTranslation {
    number: number;
    text: string;
}

export interface Edition {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
    direction: string;
}

export interface SurahDetail {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: 'Meccan' | 'Medinan';
    numberOfAyahs: number;
    ayahs: Ayah[];
    edition: Edition;
}

export interface FullSurahData {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: 'Meccan' | 'Medinan';
    numberOfAyahs: number;
    arabicAyahs: Ayah[];
    transliterationAyahs: AyahTransliteration[];
    translationAyahs: AyahTranslation[];
}

export interface LastRead {
    surah: number;
    surahName: string;
    ayah: number;
}
