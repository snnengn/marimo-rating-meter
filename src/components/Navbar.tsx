import React, { useState } from 'react';
import type { MeterSettings, Language } from '../types';
import { translations } from '../types';
import { cn } from '../lib/utils';
import { Globe, Sun, Moon, ChevronDown } from 'lucide-react';

interface NavbarProps {
    settings: MeterSettings;
    setSettings: (settings: MeterSettings) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, setSettings }) => {
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const t = translations[settings.language].ui;
    const isLight = settings.theme === 'light';

    const languages: Language[] = [
        'en', 'zh', 'hi', 'es', 'ar', 'bn', 'pt', 'ru', 'ja', 'tr',
        'fr', 'de', 'ko', 'vi', 'it', 'fa', 'pl', 'uk', 'nl', 'th'
    ];

    return (
        <nav className={cn(
            "sticky top-0 z-50 border-b backdrop-blur-md transition-colors",
            isLight
                ? "bg-white/90 border-gray-200"
                : "bg-slate-900/90 border-white/10"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <h1 className={cn(
                            "text-lg font-bold hidden sm:block",
                            isLight ? "text-gray-900" : "text-white"
                        )}>
                            {t.title}
                        </h1>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setSettings({
                                ...settings,
                                theme: settings.theme === 'light' ? 'dark' : 'light',
                                backgroundColor: settings.theme === 'light' ? '#0f172a' : '#f8fafc'
                            })}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                isLight
                                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    : "bg-white/10 hover:bg-white/20 text-white"
                            )}
                            title={isLight ? t.dark : t.light}
                            aria-label={isLight ? t.dark : t.light}
                        >
                            {isLight ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {/* Language Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                                    isLight
                                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                        : "bg-white/10 hover:bg-white/20 text-white"
                                )}
                                aria-label={t.language}
                                aria-expanded={langDropdownOpen}
                            >
                                <Globe size={18} />
                                <img
                                    src={`https://flagcdn.com/w40/${translations[settings.language].code}.png`}
                                    alt={translations[settings.language].flag}
                                    className="w-5 h-3.5 object-contain rounded-sm"
                                />
                                <ChevronDown size={16} className={cn("transition-transform", langDropdownOpen && "rotate-180")} />
                            </button>

                            {langDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setLangDropdownOpen(false)}
                                    />
                                    <div className={cn(
                                        "absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-lg border shadow-xl z-20",
                                        isLight
                                            ? "bg-white border-gray-200"
                                            : "bg-slate-800 border-white/10"
                                    )}>
                                        <div className="grid grid-cols-2 gap-1 p-2">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => {
                                                        setSettings({ ...settings, language: lang });
                                                        setLangDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left",
                                                        settings.language === lang
                                                            ? "bg-blue-600 text-white"
                                                            : isLight
                                                                ? "hover:bg-gray-100 text-gray-700"
                                                                : "hover:bg-white/10 text-gray-300"
                                                    )}
                                                >
                                                    <img
                                                        src={`https://flagcdn.com/w40/${translations[lang].code}.png`}
                                                        alt={translations[lang].flag}
                                                        className="w-5 h-3.5 object-contain rounded-sm"
                                                    />
                                                    <span className="truncate">{translations[lang].name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
