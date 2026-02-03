import React, { useRef, useEffect, useState } from 'react';
import type { MeterSettings, RatingRange, MeterSkin } from '../types';

interface RatingMeterProps {
    ranges: RatingRange[];
    settings: MeterSettings;
    onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

// Enhanced skin palettes with more detail
const SKIN_PALETTES: Record<MeterSkin, {
    colors: string[],
    glow: boolean,
    decorations: boolean,
    needleColor: string,
    borderColor: string,
    glowIntensity: number,
    labelStyle: string
}> = {
    pastel: {
        colors: ['#ffb3ba', '#bae1ff', '#baffc9', '#e0b3ff', '#ffe4b3'],
        glow: true,
        decorations: true,
        needleColor: '#ff6b8b',
        borderColor: '#ffffff',
        glowIntensity: 20,
        labelStyle: 'bold 20px "Comic Sans MS", cursive'
    },
    neon: {
        colors: ['#ff00ff', '#00ffff', '#00ff00', '#ffff00', '#ff1493'],
        glow: true,
        decorations: true,
        needleColor: '#00ffff',
        borderColor: '#ffffff',
        glowIntensity: 30,
        labelStyle: 'bold 20px "Courier New", monospace'
    },
    retro: {
        colors: ['#ff6b35', '#f7c59f', '#efa00b', '#d65108', '#c1502e'],
        glow: true,
        decorations: true,
        needleColor: '#ff6b35',
        borderColor: '#2d2d2d',
        glowIntensity: 15,
        labelStyle: 'bold 20px "Press Start 2P", "Courier New", monospace'
    },
    minimal: {
        colors: ['#e0e0e0', '#c0c0c0', '#a0a0a0', '#808080', '#606060'],
        glow: false,
        decorations: false,
        needleColor: '#333333',
        borderColor: '#666666',
        glowIntensity: 0,
        labelStyle: 'bold 20px "Helvetica Neue", Arial, sans-serif'
    },
    cyber: {
        colors: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0099'],
        glow: true,
        decorations: true,
        needleColor: '#00ffff',
        borderColor: '#000000',
        glowIntensity: 25,
        labelStyle: 'bold 20px "Orbitron", "Arial Black", sans-serif'
    }
};

interface RatingMeterProps {
    ranges: RatingRange[];
    settings: MeterSettings;
    onCanvasReady?: (canvas: HTMLCanvasElement) => void;
    exportMode?: boolean;
    animationDuration?: number; // in ms
}

export const RatingMeter: React.FC<RatingMeterProps> = ({
    ranges,
    settings,
    onCanvasReady,
    exportMode = false,
    animationDuration = 5000
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [animatedScore, setAnimatedScore] = useState(0);
    const animationStartRef = useRef<number>(0);

    // Animation loop - time-based for export mode
    useEffect(() => {
        let animationFrameId: number;
        const targetScore = settings.score;

        if (exportMode) {
            // Time-based animation for export (exactly fits duration)
            animationStartRef.current = performance.now();
            setAnimatedScore(0);

            const animate = (currentTime: number) => {
                const elapsed = currentTime - animationStartRef.current;
                const progress = Math.min(elapsed / animationDuration, 1);

                // Ease-out cubic for smooth animation
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const newScore = easeOut * targetScore;

                setAnimatedScore(newScore);

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            };

            animationFrameId = requestAnimationFrame(animate);
        } else {
            // Normal interactive animation
            const animate = () => {
                setAnimatedScore((prev) => {
                    const diff = targetScore - prev;
                    if (Math.abs(diff) < 0.1) return targetScore;
                    return prev + diff * 0.05;
                });
                animationFrameId = requestAnimationFrame(animate);
            };
            animate();
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [settings.score, exportMode, animationDuration]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (onCanvasReady) onCanvasReady(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height * 0.75;
        const radius = Math.min(width, height) * 0.55;

        // Clear canvas
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Filter valid ranges
        const validRanges = ranges.filter(r => r.max > r.min);
        if (validRanges.length === 0) return;

        const minVal = validRanges[0].min;
        const maxVal = validRanges[validRanges.length - 1].max;
        const totalRange = maxVal - minVal;

        // Arc configuration
        const startRad = Math.PI;
        const endRad = Math.PI * 2;
        const totalAngle = endRad - startRad;

        // Get skin settings
        const skinSettings = SKIN_PALETTES[settings.skin] || SKIN_PALETTES.pastel;

        // Calculate active range
        const clampedScore = Math.max(minVal, Math.min(maxVal, animatedScore));
        const activeRange = validRanges.find(r => clampedScore >= r.min && clampedScore <= r.max);

        // Draw each segment based on skin
        validRanges.forEach((range, index) => {
            const rangeStartRatio = (range.min - minVal) / totalRange;
            const rangeEndRatio = (range.max - minVal) / totalRange;

            const gap = 0.03;
            const rangeStart = startRad + rangeStartRatio * totalAngle + gap;
            const rangeEnd = startRad + rangeEndRatio * totalAngle - gap;
            const midAngle = (rangeStart + rangeEnd) / 2;

            // Active range scaling effect
            const isActive = activeRange?.id === range.id;
            const scale = isActive ? 1.05 : 1.0;

            // Inner and Outer radius for block segments
            const innerRad = (radius - 50) * scale;
            const outerRad = (radius + 30) * scale;

            // Use range color or fallback to skin palette
            const segmentColor = range.color || skinSettings.colors[index % skinSettings.colors.length];

            // Draw block segment
            ctx.beginPath();
            ctx.arc(centerX, centerY, innerRad, rangeStart, rangeEnd, false);
            ctx.arc(centerX, centerY, outerRad, rangeEnd, rangeStart, true);
            ctx.closePath();

            // Enhanced glow for active range
            if (isActive) {
                ctx.shadowColor = segmentColor;
                ctx.shadowBlur = skinSettings.glowIntensity * 2;
                ctx.globalAlpha = 1;
            } else if (skinSettings.glow) {
                ctx.shadowColor = segmentColor;
                ctx.shadowBlur = skinSettings.glowIntensity;
                ctx.globalAlpha = 0.85;
            } else {
                ctx.globalAlpha = 0.85;
            }

            ctx.fillStyle = segmentColor;
            ctx.fill();

            // Border
            ctx.strokeStyle = skinSettings.borderColor;
            ctx.lineWidth = isActive ? 4 : 3;
            ctx.shadowBlur = 0;
            ctx.stroke();

            ctx.globalAlpha = 1;

            // Enhanced decorations based on skin
            if (skinSettings.decorations) {
                const decorationCount = settings.skin === 'cyber' ? 8 : 5;

                for (let i = 1; i < decorationCount; i++) {
                    const ratio = i / decorationCount;
                    const decAngle = rangeStart + (rangeEnd - rangeStart) * ratio;
                    const deviation = Math.sin(i * 123) * 15;
                    const decRadius = innerRad + (outerRad - innerRad) * 0.5 + deviation;
                    const decX = centerX + Math.cos(decAngle) * decRadius;
                    const decY = centerY + Math.sin(decAngle) * decRadius;

                    // Different decoration styles per skin
                    if (settings.skin === 'cyber') {
                        // Cyber: small glowing squares
                        ctx.save();
                        ctx.translate(decX, decY);
                        ctx.rotate(Math.PI / 4);
                        ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
                        ctx.shadowColor = '#00ffff';
                        ctx.shadowBlur = 5;
                        ctx.fillRect(-2, -2, 4, 4);
                        ctx.restore();
                    } else if (settings.skin === 'neon') {
                        // Neon: bright dots with glow
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.shadowColor = '#ffffff';
                        ctx.shadowBlur = 8;
                        ctx.beginPath();
                        ctx.arc(decX, decY, 3, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        // Default: soft circles
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                        ctx.shadowBlur = 0;
                        ctx.beginPath();
                        ctx.arc(decX, decY, 3 + (i % 2) * 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            ctx.shadowBlur = 0;

            // Labels with better readability
            const labelRadius = radius - 10;
            const labelX = centerX + Math.cos(midAngle) * labelRadius;
            const labelY = centerY + Math.sin(midAngle) * labelRadius;

            // Text shadow for better readability
            ctx.font = skinSettings.labelStyle;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Outline for text readability
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.lineWidth = 4;
            ctx.strokeText(range.label, labelX, labelY);

            // Main text
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(range.label, labelX, labelY);
            ctx.shadowBlur = 0;
        });

        // Title
        ctx.fillStyle = settings.theme === 'dark' ? '#fff' : '#000';
        ctx.font = 'bold 22px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(settings.title, centerX, height * 0.05);

        // Score (moved below needle pivot)
        ctx.font = 'bold 44px Inter, sans-serif';
        ctx.fillText(Math.round(animatedScore).toString(), centerX, centerY + 60);

        // Needle
        const scoreRatio = (clampedScore - minVal) / totalRange;
        const needleAngle = startRad + scoreRatio * totalAngle;
        const needleLength = radius - 65;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(needleAngle);

        // Draw arrow shaft (bigger and thicker)
        const shaftWidth = 14;
        const shaftLength = needleLength - 22;

        ctx.beginPath();
        ctx.moveTo(0, -shaftWidth / 2);
        ctx.lineTo(shaftLength, -shaftWidth / 2);
        ctx.lineTo(shaftLength, -shaftWidth / 2 - 10);
        ctx.lineTo(needleLength, 0);
        ctx.lineTo(shaftLength, shaftWidth / 2 + 10);
        ctx.lineTo(shaftLength, shaftWidth / 2);
        ctx.lineTo(0, shaftWidth / 2);
        ctx.closePath();

        // Gradient
        const grad = ctx.createLinearGradient(0, 0, needleLength, 0);
        grad.addColorStop(0, '#ff9eb3');
        grad.addColorStop(0.5, '#ff8aa0');
        grad.addColorStop(1, '#ffb3c1');
        ctx.fillStyle = grad;

        ctx.shadowColor = '#ff6b8b';
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Heart base
        ctx.beginPath();
        ctx.arc(-10, 0, 18, 0, Math.PI * 2);

        const heartGrad = ctx.createRadialGradient(-10, 0, 0, -10, 0, 18);
        heartGrad.addColorStop(0, '#ffb3c1');
        heartGrad.addColorStop(1, '#ff8aa0');
        ctx.fillStyle = heartGrad;
        ctx.shadowColor = '#ff6b8b';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Heart icon
        ctx.fillStyle = '#ff4d6d';
        ctx.font = 'bold 20px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❤', -10, 0);

        ctx.restore();

    }, [ranges, settings, animatedScore]);

    return (
        <div className="flex justify-center items-center p-4">
            <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="max-w-full h-auto rounded-lg shadow-lg"
            />
        </div>
    );
};
