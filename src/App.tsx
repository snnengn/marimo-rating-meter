import { useState, useCallback } from 'react';
import type { RatingRange, MeterSettings } from './types';
import { translations } from './types';
import { Navbar } from './components/Navbar';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { RatingMeter } from './components/RatingMeter';
import { ExportControls } from './components/ExportControls';
import { cn } from './lib/utils';

function App() {
  const [ranges, setRanges] = useState<RatingRange[]>([
    { id: '1', min: 0, max: 30, label: 'Low', color: '#ef4444' },
    { id: '2', min: 30, max: 70, label: 'Medium', color: '#eab308' },
    { id: '3', min: 70, max: 100, label: 'High', color: '#22c55e' },
  ]);

  const [settings, setSettings] = useState<MeterSettings>({
    title: 'Customer Satisfaction',
    score: 85,
    maxScore: 100,
    theme: 'dark',
    skin: 'pastel',
    backgroundColor: '#0f172a',
    language: 'en',
  });

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [exportMode, setExportMode] = useState(false);
  const [exportKey, setExportKey] = useState(0);

  const t = translations[settings.language].ui;

  const handleStartExport = useCallback(() => {
    setExportKey(prev => prev + 1);
    setExportMode(true);

    setTimeout(() => {
      setExportMode(false);
    }, 3500);
  }, []);

  const isLight = settings.theme === 'light';

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isLight
        ? "bg-gradient-to-br from-slate-100 via-white to-blue-50 text-gray-900"
        : "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white"
    )}>
      {/* Navbar */}
      <Navbar settings={settings} setSettings={setSettings} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <header className="mb-8 text-center">
          <h1 className={cn(
            "text-3xl sm:text-4xl font-bold tracking-tight mb-3",
            isLight ? "text-gray-900" : "text-white"
          )}>
            {t.title}
          </h1>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            isLight ? "text-gray-600" : "text-gray-400"
          )}>
            {t.subtitle}
          </p>
        </header>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Configuration */}
          <section aria-label="Configuration">
            <ConfigurationPanel
              ranges={ranges}
              settings={settings}
              setRanges={setRanges}
              setSettings={setSettings}
            />
          </section>

          {/* Right Column: Preview */}
          <section aria-label="Preview">
            <div className={cn(
              "sticky top-24 p-6 sm:p-8 rounded-xl border backdrop-blur-sm shadow-xl transition-colors duration-300",
              isLight
                ? "bg-white/80 border-gray-200"
                : "bg-white/5 border-white/10"
            )}>
              <h2 className={cn(
                "text-xl font-bold mb-4 w-full text-center",
                isLight ? "text-gray-900" : "text-white"
              )}>
                {t.preview}
              </h2>
              <RatingMeter
                key={exportKey}
                ranges={ranges}
                settings={settings}
                onCanvasReady={setCanvas}
                exportMode={exportMode}
                animationDuration={3000}
              />
              <div className="flex justify-center w-full">
                <ExportControls canvas={canvas} onStartExport={handleStartExport} />
              </div>
              <p className={cn(
                "text-xs mt-4 text-center max-w-sm mx-auto",
                isLight ? "text-gray-500" : "text-gray-400"
              )}>
                {t.exportInfo}
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer for SEO */}
      <footer className={cn(
        "mt-16 py-8 border-t text-center",
        isLight ? "border-gray-200 text-gray-500" : "border-white/10 text-gray-400"
      )}>
        <p className="text-sm">
          © 2024 Rating Meter Generator - Free Online Tool
        </p>
      </footer>
    </div>
  );
}

export default App;
