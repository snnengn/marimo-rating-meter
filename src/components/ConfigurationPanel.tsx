import React from 'react';
import type { RatingRange, MeterSettings } from '../types';
import { translations } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ConfigurationPanelProps {
    ranges: RatingRange[];
    settings: MeterSettings;
    setRanges: (ranges: RatingRange[]) => void;
    setSettings: (settings: MeterSettings) => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
    ranges,
    settings,
    setRanges,
    setSettings,
}) => {
    const t = translations[settings.language].ui;

    const addRange = () => {
        const lastMax = ranges.length > 0 ? ranges[ranges.length - 1].max : 0;
        const newRange: RatingRange = {
            id: crypto.randomUUID(),
            min: lastMax,
            max: lastMax + 20,
            label: 'New Range',
            color: '#3b82f6',
        };
        setRanges([...ranges, newRange]);
    };

    const updateRange = (id: string, updates: Partial<RatingRange>) => {
        setRanges(
            ranges.map((range) => (range.id === id ? { ...range, ...updates } : range))
        );
    };

    const removeRange = (id: string) => {
        setRanges(ranges.filter((range) => range.id !== id));
    };


    // Theme-aware classes
    const isLight = settings.theme === 'light';
    const panelBg = isLight ? 'bg-white border-gray-200 shadow-lg' : 'bg-white/5 border-white/10';
    const textColor = isLight ? 'text-gray-900' : 'text-white';
    const labelColor = isLight ? 'text-gray-600' : 'text-gray-400';
    const inputBg = isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-black/20 border-white/10 text-white';

    return (
        <div className={cn("space-y-6 p-6 rounded-xl border", panelBg)}>
            <h2 className={cn("text-xl font-bold mb-4", textColor)}>Configuration</h2>

            {/* Global Settings */}
            <div className="space-y-4">
                <div>
                    <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                        {t.meterTitle}
                    </label>
                    <input
                        type="text"
                        value={settings.title}
                        onChange={(e) =>
                            setSettings({ ...settings, title: e.target.value })
                        }
                        className={cn("w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border", inputBg)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                            {t.scoreValue}
                        </label>
                        <input
                            type="number"
                            value={settings.score}
                            onChange={(e) =>
                                setSettings({ ...settings, score: Number(e.target.value) })
                            }
                            className={cn("w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border", inputBg)}
                        />
                    </div>
                    <div>
                        <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                            {t.maxScore}
                        </label>
                        <input
                            type="number"
                            value={settings.maxScore}
                            onChange={(e) =>
                                setSettings({ ...settings, maxScore: Number(e.target.value) })
                            }
                            className={cn("w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border", inputBg)}
                        />
                    </div>
                </div>

                <div>
                    <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                        {t.meterSkin}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSettings({ ...settings, skin: 'pastel' })}
                            className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.skin === 'pastel' ? "bg-gradient-to-r from-pink-300 to-purple-300 text-white border-pink-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                        >
                            🎀 Pastel
                        </button>
                        <button
                            onClick={() => setSettings({ ...settings, skin: 'neon' })}
                            className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.skin === 'neon' ? "bg-gradient-to-r from-green-400 to-cyan-400 text-black border-green-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                        >
                            💡 Neon
                        </button>
                        <button
                            onClick={() => setSettings({ ...settings, skin: 'retro' })}
                            className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.skin === 'retro' ? "bg-gradient-to-r from-orange-400 to-red-400 text-white border-orange-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                        >
                            🕹️ Retro
                        </button>
                        <button
                            onClick={() => setSettings({ ...settings, skin: 'minimal' })}
                            className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.skin === 'minimal' ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                        >
                            ⬜ Minimal
                        </button>
                        <button
                            onClick={() => setSettings({ ...settings, skin: 'cyber' })}
                            className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.skin === 'cyber' ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-cyan-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                        >
                            🤖 Cyber
                        </button>
                    </div>
                </div>
            </div>

            <hr className={isLight ? "border-gray-200" : "border-white/10"} />

            {/* Ranges Config */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label className={cn("text-sm font-medium", labelColor)}>
                        {t.ratingRanges}
                    </label>
                    <button
                        onClick={addRange}
                        className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-transparent border-none p-0"
                    >
                        <Plus size={16} /> {t.addRange}
                    </button>
                </div>

                <div className="space-y-3">
                    {ranges.map((range) => (
                        <div
                            key={range.id}
                            className={cn("p-4 rounded-lg border", isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10")}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <input
                                    type="color"
                                    value={range.color}
                                    onChange={(e) =>
                                        updateRange(range.id, { color: e.target.value })
                                    }
                                    className="w-10 h-10 rounded cursor-pointer border-0"
                                />
                                <input
                                    type="text"
                                    value={range.label}
                                    onChange={(e) =>
                                        updateRange(range.id, { label: e.target.value })
                                    }
                                    placeholder="Label"
                                    className={cn("flex-1 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border", inputBg)}
                                />
                                <button
                                    onClick={() => removeRange(range.id)}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={cn("block text-xs mb-1", labelColor)}>Min</label>
                                    <input
                                        type="number"
                                        value={range.min}
                                        onChange={(e) =>
                                            updateRange(range.id, { min: Number(e.target.value) })
                                        }
                                        className={cn("w-full rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border", inputBg)}
                                    />
                                </div>
                                <div>
                                    <label className={cn("block text-xs mb-1", labelColor)}>Max</label>
                                    <input
                                        type="number"
                                        value={range.max}
                                        onChange={(e) =>
                                            updateRange(range.id, { max: Number(e.target.value) })
                                        }
                                        className={cn("w-full rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border", inputBg)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
