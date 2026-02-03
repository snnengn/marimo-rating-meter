import { useState } from 'react';
import type { RatingRange, MeterSettings } from './types';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { RatingMeter } from './components/RatingMeter';
import { ExportControls } from './components/ExportControls';
import { cn } from './lib/utils';

function App() {
  console.log('Rendering App Component');
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
    backgroundColor: '#1a1a1a',
  });

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  return (
    <div className={cn("min-h-screen p-8 transition-colors",
      settings.theme === 'dark' ? "bg-black text-white" : "bg-gray-100 text-black"
    )}>
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Rating Meter Generator</h1>
        <p className="text-gray-500">Create, customize, and export your rating meter animations.</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Configuration */}
        <div className="space-y-6">
          <ConfigurationPanel
            ranges={ranges}
            settings={settings}
            setRanges={setRanges}
            setSettings={setSettings}
          />
        </div>

        {/* Right Column: Preview */}
        <div className="flex flex-col items-center">
          <div className="sticky top-8 bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 w-full text-center">Preview</h2>
            <RatingMeter
              ranges={ranges}
              settings={settings}
              onCanvasReady={setCanvas}
            />
            <div className="flex justify-center w-full">
              <ExportControls canvas={canvas} />
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center max-w-sm">
              Note: Recording captures the animation for 3 seconds.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
