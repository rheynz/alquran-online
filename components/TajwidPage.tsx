
import React from 'react';

const TajwidCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-primary-700 dark:text-primary-400 mb-4">{title}</h3>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">{children}</div>
    </div>
);

export const TajwidPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-primary-800 dark:text-primary-300">Belajar Membaca Al-Qur'an</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Panduan dasar Tajwid untuk pemula.</p>
            </div>

            <TajwidCard title="Huruf Hijaiyah">
                <p>Huruf Hijaiyah adalah alfabet dalam bahasa Arab, yang menjadi dasar membaca Al-Qur'an. Terdapat 28 huruf utama.</p>
                <div dir="rtl" className="font-amiri text-3xl tracking-wider text-center bg-primary-50 dark:bg-gray-700 p-4 rounded-md">
                    <p className="leading-loose">
                        ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن و ه ء ي
                    </p>
                </div>
                <p>Penting untuk mempelajari cara pengucapan (makhraj) dan sifat setiap huruf dengan benar.</p>
            </TajwidCard>

            <TajwidCard title="Hukum Nun Sukun (نْ) dan Tanwin (ـًـــٍـــٌ)">
                <p>Ini adalah salah satu hukum tajwid paling dasar yang mengatur bagaimana Nun Sukun atau Tanwin dibaca ketika bertemu dengan huruf-huruf tertentu.</p>
                
                <div className="mt-4 space-y-4">
                    <div>
                        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">1. Idzhar (إظهار) - Jelas</h4>
                        <p>Dibaca jelas tanpa dengung. Terjadi jika Nun Sukun/Tanwin bertemu dengan salah satu dari 6 huruf halq (tenggorokan): <span dir="rtl" className="font-amiri font-bold">ء هـ ع ح غ خ</span>.</p>
                        <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md font-amiri text-xl leading-relaxed" dir="rtl">Contoh: مِنْ خَيْرٍ</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">2. Idgham (إدغام) - Melebur</h4>
                        <p>Meleburkan suara Nun Sukun/Tanwin ke huruf berikutnya. Terbagi dua:</p>
                        <ul className="list-disc list-inside ml-4">
                            <li><strong>Idgham Bi Ghunnah (dengan dengung):</strong> bertemu huruf <span dir="rtl" className="font-amiri font-bold">ي ن م و</span>. Contoh: <span dir="rtl" className="font-amiri p-1 rounded bg-gray-100 dark:bg-gray-700">مَنْ يَعْمَلْ</span></li>
                            <li><strong>Idgham Bila Ghunnah (tanpa dengung):</strong> bertemu huruf <span dir="rtl" className="font-amiri font-bold">ل ر</span>. Contoh: <span dir="rtl" className="font-amiri p-1 rounded bg-gray-100 dark:bg-gray-700">مِنْ رَبِّهِمْ</span></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">3. Iqlab (إقلاب) - Mengganti</h4>
                        <p>Mengganti suara Nun Sukun/Tanwin menjadi suara Mim (م) disertai dengung. Terjadi jika bertemu huruf <span dir="rtl" className="font-amiri font-bold">ب</span>.</p>
                        <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md font-amiri text-xl leading-relaxed" dir="rtl">Contoh: مِنْ بَعْدِ</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">4. Ikhfa' (إخفاء) - Samar</h4>
                        <p>Menyamarkan suara Nun Sukun/Tanwin dengan dengung. Terjadi jika bertemu dengan 15 huruf sisa selain huruf-huruf di atas.</p>
                         <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-md font-amiri text-xl leading-relaxed" dir="rtl">Contoh: إِنْسَانٌ</p>
                    </div>
                </div>
            </TajwidCard>
        </div>
    );
};