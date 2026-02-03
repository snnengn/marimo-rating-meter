import React, { useState } from 'react';
import { Download, Film, Image, Video } from 'lucide-react';
import * as Mp4Muxer from 'mp4-muxer';
import { encode } from 'modern-gif';
import { translations } from '../types';
import type { MeterSettings } from '../types';

interface ExportControlsProps {
    canvas: HTMLCanvasElement | null;
    onStartExport: (format: 'webm' | 'mp4' | 'gif') => void;
    settings: MeterSettings;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ canvas, onStartExport, settings }) => {
    const t = translations[settings.language].ui;
    const [isExporting, setIsExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'webm' | 'mp4' | 'gif'>('webm');
    const [progress, setProgress] = useState(0);

    const handleExport = async () => {
        if (!canvas || isExporting) return;

        // Check for transparent MP4 export
        if (settings.backgroundColor === 'transparent' && exportFormat === 'mp4') {
            alert("MP4 format does not support transparent backgrounds. Please use WebM or choose a background color.");
            return;
        }

        setIsExporting(true);
        setProgress(0);

        // Notify parent to start export mode
        onStartExport(exportFormat);

        // Wait a bit for animation reset
        await new Promise(r => setTimeout(r, 200));

        try {
            const width = canvas.width;
            const height = canvas.height;
            const duration = 3000; // 3 seconds matching animation
            const fps = 60;
            const totalFrames = (duration / 1000) * fps;

            if (exportFormat === 'mp4') {
                const muxer = new Mp4Muxer.Muxer({
                    target: new Mp4Muxer.ArrayBufferTarget(),
                    video: {
                        codec: 'avc',
                        width,
                        height
                    },
                    fastStart: 'in-memory'
                });

                const videoEncoder = new VideoEncoder({
                    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
                    error: (e) => console.error(e)
                });

                videoEncoder.configure({
                    codec: 'avc1.640034', // High Profile Level 5.2
                    width,
                    height,
                    bitrate: 8_000_000 // 8 Mbps
                });

                const stream = canvas.captureStream(fps);
                const track = stream.getVideoTracks()[0];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const processor = new (window as any).MediaStreamTrackProcessor({ track });
                const reader = processor.readable.getReader();

                const safeRead = async () => {
                    const timeoutPromise = new Promise<{ value?: any; done: boolean }>((resolve) => {
                        setTimeout(() => resolve({ done: true }), 500); // 500ms timeout
                    });
                    const readPromise = reader.read();
                    return Promise.race([readPromise, timeoutPromise]);
                };

                let frameCount = 0;

                while (frameCount < totalFrames) {
                    const result = await safeRead();
                    if (result.done) break;

                    const frame = result.value;
                    // timestamp in microseconds
                    const timestamp = frameCount * (1000000 / fps);

                    const videoFrame = new VideoFrame(frame, { timestamp });
                    videoEncoder.encode(videoFrame, { keyFrame: frameCount % 30 === 0 });
                    videoFrame.close();
                    frame.close();

                    frameCount++;
                    setProgress(Math.round((frameCount / totalFrames) * 100));
                }

                await videoEncoder.flush();
                muxer.finalize();
                const { buffer } = muxer.target;
                downloadBlob(new Blob([buffer], { type: 'video/mp4' }), 'mp4');

                reader.cancel();
                track.stop();

            } else if (exportFormat === 'gif') {
                const frames: ImageBitmap[] = [];
                const stream = canvas.captureStream(fps);
                const track = stream.getVideoTracks()[0];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const processor = new (window as any).MediaStreamTrackProcessor({ track });
                const reader = processor.readable.getReader();

                const safeRead = async () => {
                    const timeoutPromise = new Promise<{ value?: any; done: boolean }>((resolve) => {
                        setTimeout(() => resolve({ done: true }), 500); // 500ms timeout
                    });
                    const readPromise = reader.read();
                    return Promise.race([readPromise, timeoutPromise]);
                };

                let frameCount = 0;

                while (frameCount < totalFrames) {
                    const result = await safeRead();
                    if (result.done) break;

                    const frame = result.value;
                    const bitmap = await createImageBitmap(frame);
                    frames.push(bitmap);
                    frame.close();

                    frameCount++;
                    setProgress(Math.round((frameCount / totalFrames) * 100));
                }

                reader.cancel();
                track.stop();

                const buffer = await encode({
                    width,
                    height,
                    frames: frames.map(f => ({ data: f, delay: 1000 / fps })),
                });

                downloadBlob(new Blob([buffer], { type: 'image/gif' }), 'gif');

                // Cleanup bitmaps
                frames.forEach(f => f.close());

            } else {
                // FALLBACK for WebM
                const stream = canvas.captureStream(fps);
                const recorder = new MediaRecorder(stream, {
                    mimeType: 'video/webm; codecs=vp9',
                    videoBitsPerSecond: 8_000_000 // 8 Mbps
                });
                const chunks: Blob[] = [];

                recorder.ondataavailable = e => chunks.push(e.data);
                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    downloadBlob(blob, 'webm');
                };

                recorder.start();
                setTimeout(() => recorder.stop(), duration + 100);
            }

        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. See console for details.');
        } finally {
            setIsExporting(false);
            setProgress(0);
        }
    };

    const downloadBlob = (blob: Blob, ext: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rating-meter-${Date.now()}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
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
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl w-full"
            >
                <Download size={20} />
                {isExporting ? `${t.processing} ${progress}%` : `${t.exportButton} ${exportFormat.toUpperCase()}`}
            </button>
        </div>
    );
};
