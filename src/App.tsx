import { useState, useCallback, useRef } from 'react';
import type { RatingRange, MeterSettings } from './types';
import { translations } from './types';
import { Navbar } from './components/Navbar';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { RatingMeter, type RatingMeterHandle } from './components/RatingMeter';
import { ExportControls } from './components/ExportControls';
import { cn } from './lib/utils';
import { Play } from 'lucide-react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [ranges, setRanges] = useState<RatingRange[]>([
    { id: '1', min: 0, max: 30, label: 'Low', color: '#ef4444' },
    { id: '2', min: 30, max: 70, label: 'Medium', color: '#eab308' },
    { id: '3', min: 70, max: 100, label: 'High', color: '#22c55e' },
  ]);

  const [settings, setSettings] = useState<MeterSettings>({
    title: 'Customer Satisfaction',
    scoreValue: 75,
    maxScore: 100,
    theme: 'dark',
    skin: 'pastel',
    backgroundColor: '#0f172a',
    language: 'en',
    // Advanced customization defaults
    needleType: 'arrow',
    centerIcon: 'none',
    fontFamily: 'Inter',
    fontSize: 20,
    fontEffect: 'shadow',
    needleColor: '#bd0f0f',
    meterShape: 'gauge',
    // Title defaults
    titleFontSize: 24,
    titleVisible: true,
    titleColor: '#ffffff',
    titlePositionY: 0,
  });

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [exportMode, setExportMode] = useState(false);
  const meterRef = useRef<RatingMeterHandle>(null);

  const t = translations[settings.language].ui;

  const handleStartExport = useCallback(() => {
    setExportMode(true);
    setTimeout(() => {
      setExportMode(false);
    }, 3500);
  }, []);

  const handlePreview = () => {
    if (meterRef.current) {
      meterRef.current.replayAnimation();
    }
  };

  const isLight = settings.theme === 'light';


  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isLight
        ? "bg-gradient-to-br from-slate-100 via-white to-blue-50 text-gray-900"
        : "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white"
    )}>
      <Navbar settings={settings} setSettings={setSettings} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section aria-label="Configuration">
            <ConfigurationPanel
              ranges={ranges}
              settings={settings}
              setRanges={setRanges}
              setSettings={setSettings}
            />
          </section>

          <section aria-label="Preview">
            <div className={cn(
              "sticky top-24 p-6 sm:p-8 rounded-xl border backdrop-blur-sm shadow-xl transition-colors duration-300 flex flex-col items-center",
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

              <div className="relative group">
                <RatingMeter
                  ref={meterRef}
                  ranges={ranges}
                  settings={settings}
                  onCanvasReady={setCanvas}
                  exportMode={exportMode}
                  animationDuration={3000}
                />
              </div>

              {/* Controls Section: Score Inputs and Preview Button */}
              <div className="flex flex-col items-center mt-6 gap-4 w-full max-w-sm">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                      <label className={cn("block text-[10px] uppercase tracking-wider font-bold mb-1 opacity-50", isLight ? "text-gray-900" : "text-white")}>
                        {t.scoreValue}
                      </label>
                      <input
                        type="number"
                        value={settings.scoreValue}
                        onChange={(e) => setSettings({ ...settings, scoreValue: Number(e.target.value) })}
                        className={cn(
                          "w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border transition-all text-sm font-bold",
                          isLight ? "bg-gray-100 border-gray-200 text-gray-900" : "bg-white/10 border-white/10 text-white"
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <label className={cn("block text-[10px] uppercase tracking-wider font-bold mb-1 opacity-50", isLight ? "text-gray-900" : "text-white")}>
                        {t.maxScore}
                      </label>
                      <input
                        type="number"
                        value={settings.maxScore}
                        onChange={(e) => setSettings({ ...settings, maxScore: Number(e.target.value) })}
                        className={cn(
                          "w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border transition-all text-sm font-bold",
                          isLight ? "bg-gray-100 border-gray-200 text-gray-900" : "bg-white/10 border-white/10 text-white"
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      onClick={handlePreview}
                      className="p-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-lg active:scale-95 transition-all flex items-center justify-center translate-y-[1px]"
                      title={t.replayAnimation}
                    >
                      <Play className="fill-current" size={20} />
                    </button>
                  </div>
                </div>

                <p className={cn(
                  "text-sm font-medium opacity-60 text-center",
                  isLight ? "text-gray-600" : "text-gray-400"
                )}>
                  {settings.title}
                </p>
              </div>

              <div className="flex justify-center w-full mt-4">
                <ExportControls canvas={canvas} onStartExport={handleStartExport} settings={settings} />
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

      <footer className={cn(
        "mt-16 py-8 border-t text-center",
        isLight ? "border-gray-200 text-gray-500" : "border-white/10 text-gray-400"
      )}>
        <p className="text-sm">
          © 2026 Marimo Rating Meter Generator - Free Online Tool
        </p>
      </footer>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
