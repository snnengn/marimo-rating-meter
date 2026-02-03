import React, { useState } from 'react';
import { Download, Film, Image, Video } from 'lucide-react';

interface ExportControlsProps {
    canvas: HTMLCanvasElement | null;
    onStartExport: (format: 'webm' | 'mp4' | 'gif') => void;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ canvas, onStartExport }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'webm' | 'mp4' | 'gif'>('webm');

    const handleExport = async () => {
        if (!canvas || isExporting) return;

        setIsExporting(true);

        // Notify parent to start export mode
        onStartExport(exportFormat);

        // Wait for animation to start
        await new Promise(r => setTimeout(r, 200));

        try {
            const stream = canvas.captureStream(30);
            const mimeType = 'video/webm; codecs=vp9';
            const recorder = new MediaRecorder(stream, { mimeType });

            const chunks: Blob[] = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);

            await new Promise<void>((resolve) => {
                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;

                    // File extension based on format
                    const ext = exportFormat === 'gif' ? 'webm' : exportFormat;
                    a.download = `rating-meter-${Date.now()}.${ext}`;
                    a.click();
                    URL.revokeObjectURL(url);
                    resolve();
                };

                recorder.start();
                // Record for 3.3 seconds to capture full animation
                setTimeout(() => {
                    recorder.stop();
                }, 3300);
            });

            if (exportFormat === 'mp4') {
                alert('MP4 dönüştürme için ffmpeg.wasm gerekli. WebM olarak indirildi, online converter ile MP4\'e çevirebilirsiniz.');
            }
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex gap-2 flex-wrap justify-center">
                <button
                    onClick={() => setExportFormat('webm')}
                    className={`px-3 py-2 rounded border text-sm flex items-center gap-1 ${exportFormat === 'webm' ? 'bg-purple-600 text-white border-purple-500' : 'bg-transparent text-gray-400 border-gray-600'}`}
                >
                    <Film size={14} /> WebM
                </button>
                <button
                    onClick={() => setExportFormat('mp4')}
                    className={`px-3 py-2 rounded border text-sm flex items-center gap-1 ${exportFormat === 'mp4' ? 'bg-blue-600 text-white border-blue-500' : 'bg-transparent text-gray-400 border-gray-600'}`}
                >
                    <Video size={14} /> MP4
                </button>
                <button
                    onClick={() => setExportFormat('gif')}
                    className={`px-3 py-2 rounded border text-sm flex items-center gap-1 ${exportFormat === 'gif' ? 'bg-pink-600 text-white border-pink-500' : 'bg-transparent text-gray-400 border-gray-600'}`}
                >
                    <Image size={14} /> GIF
                </button>
            </div>
            <button
                onClick={handleExport}
                disabled={isExporting || !canvas}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
                <Download size={20} />
                {isExporting ? 'Oluşturuluyor... (3 sn)' : `Export ${exportFormat.toUpperCase()}`}
            </button>
        </div>
    );
};
