import React, { useState } from 'react';
import type { RatingRange, MeterSettings, NeedleType, CenterIcon, FontFamily, FontEffect } from '../types';
import { translations } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
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
    const [showAdvanced, setShowAdvanced] = useState(false);

    const addRange = () => {
        const newRange: RatingRange = {
            id: Date.now().toString(),
            min: ranges.length > 0 ? ranges[ranges.length - 1].max : 0,
            max: ranges.length > 0 ? ranges[ranges.length - 1].max + 20 : 100,
            label: t.label + ' ' + (ranges.length + 1),
            color: '#3b82f6'
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

    // Needle type options
    const needleTypes: { value: NeedleType; label: string; icon: string }[] = [
        { value: 'arrow', label: 'Arrow', icon: '➤' },
        { value: 'classic', label: 'Classic', icon: '▶' },
        { value: 'modern', label: 'Modern', icon: '◆' },
        { value: 'thin', label: 'Thin', icon: '│' },
        { value: 'bold', label: 'Bold', icon: '█' },
    ];

    // Center icon options
    const centerIcons: { value: CenterIcon; label: string; icon: string }[] = [
        { value: 'heart', label: 'Heart', icon: '❤' },
        { value: 'star', label: 'Star', icon: '⭐' },
        { value: 'circle', label: 'Circle', icon: '●' },
        { value: 'diamond', label: 'Diamond', icon: '◆' },
        { value: 'none', label: 'None', icon: '○' },
    ];

    // Font family options
    const fontFamilies: { value: FontFamily; label: string }[] = [
        { value: 'Roboto', label: 'Roboto' },
        { value: 'Poppins', label: 'Poppins' },
        { value: 'Open Sans', label: 'Open Sans' },
        { value: 'Lato', label: 'Lato' },
        { value: 'Montserrat', label: 'Montserrat' },
        { value: 'Oswald', label: 'Oswald' },
        { value: 'Source Sans 3', label: 'Source Sans 3' },
        { value: 'Raleway', label: 'Raleway' },
        { value: 'PT Sans', label: 'PT Sans' },
        { value: 'Merriweather', label: 'Merriweather' },
        { value: 'Nunito', label: 'Nunito' },
        { value: 'Playfair Display', label: 'Playfair Display' },
        { value: 'Ubuntu', label: 'Ubuntu' },
        { value: 'Mukta', label: 'Mukta' },
        { value: 'Quicksand', label: 'Quicksand' },
        { value: 'Kanit', label: 'Kanit' },
        { value: 'Noto Sans', label: 'Noto Sans' },
        { value: 'Rubik', label: 'Rubik' },
        { value: 'Bebas Neue', label: 'Bebas Neue' },
        { value: 'Anton', label: 'Anton' },
        { value: 'Josefin Sans', label: 'Josefin Sans' },
        { value: 'Pacifico', label: 'Pacifico' },
        { value: 'Shadows Into Light', label: 'Shadows Into Light' },
        { value: 'Comic Sans MS', label: 'Comic Sans' },
    ];

    // Font effect options
    const fontEffects: { value: FontEffect; label: string }[] = [
        { value: 'none', label: 'None' },
        { value: 'shadow', label: 'Shadow' },
        { value: 'outline', label: 'Outline' },
        { value: 'glow', label: 'Glow' },
        { value: 'emboss', label: 'Emboss' },
    ];

    // Skin default colors mapping
    const getSkinDefaults = (skin: string, theme: 'light' | 'dark') => {
        const isLight = theme === 'light';

        const defaults: Record<string, {
            needleColor: string;
            backgroundColor: string;
            rangeColors: string[];
        }> = {
            pastel: {
                needleColor: '#ff6b8b',
                backgroundColor: isLight ? '#fff1f2' : '#0a0a0a',
                rangeColors: ['#ffb3ba', '#bae1ff', '#baffc9', '#e0b3ff', '#ffe4b3']
            },
            neon: {
                needleColor: isLight ? '#06b6d4' : '#00ffff',
                backgroundColor: isLight ? '#f0fdfa' : '#0a0a0a',
                rangeColors: ['#ff00ff', '#00ffff', '#00ff00', '#ffff00', '#ff1493']
            },
            retro: {
                needleColor: '#ff6b35',
                backgroundColor: isLight ? '#fff7ed' : '#2d2d2d',
                rangeColors: ['#ff6b35', '#f7c59f', '#efa00b', '#d65108', '#c1502e']
            },
            minimal: {
                needleColor: '#333333',
                backgroundColor: isLight ? '#ffffff' : '#f5f5f5',
                rangeColors: ['#e0e0e0', '#c0c0c0', '#a0a0a0', '#808080', '#606060']
            },
            cyber: {
                needleColor: '#00ffff',
                backgroundColor: isLight ? '#e0f2fe' : '#000000',
                rangeColors: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0099']
            },
        };

        return defaults[skin];
    };

    // Handle skin change and apply default colors
    const handleSkinChange = (skin: string) => {
        const defaults = getSkinDefaults(skin, settings.theme);
        if (defaults) {
            // Update settings with new skin and colors
            setSettings({
                ...settings,
                skin: skin as any,
                needleColor: defaults.needleColor,
                backgroundColor: defaults.backgroundColor,
            });

            // Update rating ranges with skin-specific colors
            const updatedRanges = ranges.map((range, index) => ({
                ...range,
                color: defaults.rangeColors[index % defaults.rangeColors.length]
            }));
            setRanges(updatedRanges);
        }
    };

    // Theme-aware classes
    const isLight = settings.theme === 'light';
    const panelBg = isLight ? 'bg-white border-gray-200 shadow-lg' : 'bg-white/5 border-white/10';
    const textColor = isLight ? 'text-gray-900' : 'text-white';
    const labelColor = isLight ? 'text-gray-600' : 'text-gray-400';
    const inputBg = isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : 'bg-black/20 border-white/10 text-white';

    return (
        <div className={cn("flex flex-col h-full bg-slate-800 text-white overflow-hidden border rounded-xl border-slate-800", panelBg)}>
            <div className="p-4 border-slate-800 flex items-center justify-between">
                <h2 className={cn("text-xl font-bold", textColor)}>{t.configuration}</h2>
            </div>

            <div className={cn("space-y-6 p-6", panelBg)}>
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


                    <div>
                        <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                            {t.meterSkin}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleSkinChange('pastel')}
                                className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.skin === 'pastel' ? "bg-gradient-to-r from-pink-300 to-purple-300 text-white border-pink-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                            >
                                🎀 Pastel
                            </button>
                            <button
                                onClick={() => handleSkinChange('neon')}
                                className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.skin === 'neon' ? "bg-gradient-to-r from-green-400 to-cyan-400 text-black border-green-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                            >
                                💡 Neon
                            </button>
                            <button
                                onClick={() => handleSkinChange('retro')}
                                className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.skin === 'retro' ? "bg-gradient-to-r from-orange-400 to-red-400 text-white border-orange-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                            >
                                🕹️ Retro
                            </button>
                            <button
                                onClick={() => handleSkinChange('minimal')}
                                className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.skin === 'minimal' ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                            >
                                ⬜ Minimal
                            </button>
                            <button
                                onClick={() => handleSkinChange('cyber')}
                                className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.skin === 'cyber' ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-cyan-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                            >
                                🤖 Cyber
                            </button>
                        </div>
                    </div>

                    {/* Meter Shape */}
                    <div>
                        <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                            {t.meterShape}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSettings({ ...settings, meterShape: 'gauge' })}
                                className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.meterShape === 'gauge' ? "bg-gradient-to-r from-blue-400 to-indigo-400 text-white border-blue-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                            >
                                🎯 Gauge
                            </button>
                            <button
                                onClick={() => setSettings({ ...settings, meterShape: 'tube' })}
                                className={cn("px-3 py-2 rounded-lg border text-sm transition-all", settings.meterShape === 'tube' ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white border-emerald-400 shadow-md" : isLight ? "bg-gray-100 text-gray-600 border-gray-300" : "bg-transparent text-gray-400 border-gray-600")}
                            >
                                📊 Tube
                            </button>
                        </div>
                    </div>
                </div>

                <hr className={isLight ? "border-gray-200" : "border-white/10"} />

                {/* Advanced Settings Section */}
                <div>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                            isLight ? "bg-gray-50 border-gray-200 hover:bg-gray-100" : "bg-white/5 border-white/10 hover:bg-white/10"
                        )}
                    >
                        <span className={cn("text-sm font-medium", textColor)}>
                            {t.advancedSettings}
                        </span>
                        {showAdvanced ? (
                            <ChevronUp size={18} className={labelColor} />
                        ) : (
                            <ChevronDown size={18} className={labelColor} />
                        )}
                    </button>

                    {showAdvanced && (
                        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Background Color */}
                            <div>
                                <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                                    {t.backgroundColor}
                                </label>
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        id="transparentBg"
                                        checked={settings.backgroundColor === 'transparent'}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                backgroundColor: e.target.checked ? 'transparent' : '#0f172a'
                                            })
                                        }
                                        className="w-4 h-4 accent-pink-500 cursor-pointer"
                                    />
                                    <label htmlFor="transparentBg" className={cn("text-sm cursor-pointer", labelColor)}>
                                        {t.transparent}
                                    </label>
                                </div>
                                {settings.backgroundColor !== 'transparent' && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={settings.backgroundColor}
                                            onChange={(e) =>
                                                setSettings({ ...settings, backgroundColor: e.target.value })
                                            }
                                            className="w-10 h-10 rounded cursor-pointer border-0"
                                        />
                                        <input
                                            type="text"
                                            value={settings.backgroundColor}
                                            onChange={(e) =>
                                                setSettings({ ...settings, backgroundColor: e.target.value })
                                            }
                                            className={cn("flex-1 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border", inputBg)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Needle Type */}
                            <div>
                                <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                                    {t.needleType}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {needleTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => setSettings({ ...settings, needleType: type.value })}
                                            className={cn(
                                                "px-3 py-2 rounded-lg border text-sm transition-all",
                                                settings.needleType === type.value
                                                    ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white border-pink-400 shadow-md"
                                                    : isLight
                                                        ? "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                                                        : "bg-transparent text-gray-400 border-gray-600 hover:bg-white/10"
                                            )}
                                        >
                                            {type.icon} {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Needle Color */}
                            <div>
                                <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                                    {t.needleColor}
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={settings.needleColor}
                                        onChange={(e) =>
                                            setSettings({ ...settings, needleColor: e.target.value })
                                        }
                                        className="w-10 h-10 rounded cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={settings.needleColor}
                                        onChange={(e) =>
                                            setSettings({ ...settings, needleColor: e.target.value })
                                        }
                                        className={cn("flex-1 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border", inputBg)}
                                    />
                                </div>
                            </div>

                            {/* Center Icon */}
                            <div>
                                <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                                    {t.centerIcon}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {centerIcons.map((icon) => (
                                        <button
                                            key={icon.value}
                                            onClick={() => setSettings({ ...settings, centerIcon: icon.value })}
                                            className={cn(
                                                "px-3 py-2 rounded-lg border text-sm transition-all",
                                                settings.centerIcon === icon.value
                                                    ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-400 shadow-md"
                                                    : isLight
                                                        ? "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                                                        : "bg-transparent text-gray-400 border-gray-600 hover:bg-white/10"
                                            )}
                                        >
                                            {icon.icon} {icon.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Font Family */}
                            <div>
                                <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                                    {t.fontFamily}
                                </label>
                                <select
                                    value={settings.fontFamily}
                                    onChange={(e) =>
                                        setSettings({ ...settings, fontFamily: e.target.value as FontFamily })
                                    }
                                    className={cn("w-full rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border", inputBg)}
                                >
                                    {fontFamilies.map((font) => (
                                        <option
                                            key={font.value}
                                            value={font.value}
                                            style={{ fontFamily: font.value }}
                                            className={isLight ? "bg-white text-gray-900" : "bg-slate-800 text-white"}
                                        >
                                            {font.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Font Size */}
                            <div>
                                <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                                    {t.fontSize}: {settings.fontSize}px
                                </label>
                                <input
                                    type="range"
                                    min="12"
                                    max="32"
                                    value={settings.fontSize}
                                    onChange={(e) =>
                                        setSettings({ ...settings, fontSize: Number(e.target.value) })
                                    }
                                    className="w-full accent-pink-500"
                                />
                            </div>

                            {/* Font Effect */}
                            <div>
                                <label className={cn("block text-sm font-medium mb-1", labelColor)}>
                                    {t.fontEffect}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {fontEffects.map((effect) => (
                                        <button
                                            key={effect.value}
                                            onClick={() => setSettings({ ...settings, fontEffect: effect.value })}
                                            className={cn(
                                                "px-3 py-2 rounded-lg border text-sm transition-all",
                                                settings.fontEffect === effect.value
                                                    ? "bg-gradient-to-r from-violet-400 to-purple-400 text-white border-violet-400 shadow-md"
                                                    : isLight
                                                        ? "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                                                        : "bg-transparent text-gray-400 border-gray-600 hover:bg-white/10"
                                            )}
                                        >
                                            {effect.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <hr className={isLight ? "border-gray-200" : "border-white/10"} />

                {/* Ranges Config */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{t.ratingRanges}</h3>
                        <button
                            onClick={addRange}
                            className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-md transition-colors text-xs font-medium border border-blue-500/20"
                        >
                            <Plus size={16} />
                            {t.addRange}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {ranges.map((range) => (
                            <div
                                key={range.id}
                                className={cn("p-4 rounded-[2px] border", isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10")}
                            >
                                <div className="flex items-end gap-3 mb-3">
                                    <div className="space-y-1">
                                        <div className="h-4" /> {/* Label spacer */}
                                        <input
                                            type="color"
                                            value={range.color}
                                            onChange={(e) =>
                                                updateRange(range.id, { color: e.target.value })
                                            }
                                            className="w-10 h-8 rounded cursor-pointer border-0 p-0 bg-transparent block"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-slate-500 uppercase">{t.label}</label>
                                        <input
                                            value={range.label}
                                            onChange={(e) => updateRange(range.id, { label: e.target.value })}
                                            className={cn("w-full rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 h-8 border", inputBg)}
                                        />
                                    </div>
                                    <div className="w-16 space-y-1">
                                        <label className="text-xs text-slate-500 uppercase">{t.min}</label>
                                        <input
                                            value={range.min}
                                            onChange={(e) => updateRange(range.id, { min: Number(e.target.value) })}
                                            className={cn("w-full rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 h-8 border", inputBg)}
                                        />
                                    </div>
                                    <div className="w-16 space-y-1">
                                        <label className="text-xs text-slate-500 uppercase">{t.max}</label>
                                        <input
                                            value={range.max}
                                            onChange={(e) => updateRange(range.id, { max: Number(e.target.value) })}
                                            className={cn("w-full rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 h-8 border", inputBg)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-4" /> {/* Label spacer */}
                                        <button
                                            onClick={() => removeRange(range.id)}
                                            className="p-1 px-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors h-8 flex items-center justify-center border border-transparent hover:border-red-500/20"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
