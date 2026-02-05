import React, { useRef, useEffect, useState } from 'react';
import type { MeterSettings, RatingRange, MeterSkin, NeedleType, CenterIcon, FontEffect } from '../types';


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

// Helper function to draw different needle types
const drawNeedle = (
    ctx: CanvasRenderingContext2D,
    needleType: NeedleType,
    needleLength: number,
    needleColor: string,
    isTransparent: boolean
) => {
    const shaftWidth = needleType === 'bold' ? 20 : needleType === 'thin' ? 6 : 14;
    const shaftLength = needleLength - 22;

    // Create gradient based on needle color
    const grad = ctx.createLinearGradient(0, 0, needleLength, 0);
    const baseColor = needleColor;
    grad.addColorStop(0, adjustColorBrightness(baseColor, 30));
    grad.addColorStop(0.5, baseColor);
    grad.addColorStop(1, adjustColorBrightness(baseColor, 50));

    ctx.beginPath();

    switch (needleType) {
        case 'arrow':
            // Arrow shape with pointed tip
            ctx.moveTo(0, -shaftWidth / 2);
            ctx.lineTo(shaftLength, -shaftWidth / 2);
            ctx.lineTo(shaftLength, -shaftWidth / 2 - 10);
            ctx.lineTo(needleLength, 0);
            ctx.lineTo(shaftLength, shaftWidth / 2 + 10);
            ctx.lineTo(shaftLength, shaftWidth / 2);
            ctx.lineTo(0, shaftWidth / 2);
            break;

        case 'classic':
            // Classic tapered needle
            ctx.moveTo(-15, 0);
            ctx.lineTo(0, -shaftWidth / 2);
            ctx.lineTo(needleLength - 10, -3);
            ctx.lineTo(needleLength, 0);
            ctx.lineTo(needleLength - 10, 3);
            ctx.lineTo(0, shaftWidth / 2);
            break;

        case 'modern':
            // Modern sleek needle with rounded edges
            ctx.moveTo(0, -shaftWidth / 3);
            ctx.quadraticCurveTo(needleLength * 0.3, -shaftWidth / 2, needleLength * 0.7, -4);
            ctx.lineTo(needleLength, 0);
            ctx.lineTo(needleLength * 0.7, 4);
            ctx.quadraticCurveTo(needleLength * 0.3, shaftWidth / 2, 0, shaftWidth / 3);
            break;

        case 'thin':
            // Thin elegant needle
            ctx.moveTo(-5, 0);
            ctx.lineTo(0, -shaftWidth / 2);
            ctx.lineTo(needleLength, -1);
            ctx.lineTo(needleLength + 5, 0);
            ctx.lineTo(needleLength, 1);
            ctx.lineTo(0, shaftWidth / 2);
            break;

        case 'bold':
            // Bold thick needle
            ctx.moveTo(-10, -shaftWidth / 3);
            ctx.lineTo(needleLength * 0.8, -shaftWidth / 2);
            ctx.lineTo(needleLength, 0);
            ctx.lineTo(needleLength * 0.8, shaftWidth / 2);
            ctx.lineTo(-10, shaftWidth / 3);
            break;
    }

    ctx.closePath();
    ctx.fillStyle = grad;

    if (!isTransparent) {
        ctx.shadowColor = needleColor;
        ctx.shadowBlur = 15;
    }
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = needleType === 'thin' ? 1.5 : 3;
    ctx.shadowBlur = 0;
    ctx.stroke();
};

// Helper function to draw center icon
const drawCenterIcon = (
    ctx: CanvasRenderingContext2D,
    centerIcon: CenterIcon,
    needleColor: string,
    isTransparent: boolean
) => {
    if (centerIcon === 'none') {
        // Just draw a simple circle
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        const simpleGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
        simpleGrad.addColorStop(0, '#ffffff');
        simpleGrad.addColorStop(1, '#888888');
        ctx.fillStyle = simpleGrad;
        ctx.fill();
        return;
    }

    // Draw base circle
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);

    const baseGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
    baseGrad.addColorStop(0, adjustColorBrightness(needleColor, 60));
    baseGrad.addColorStop(1, adjustColorBrightness(needleColor, 20));
    ctx.fillStyle = baseGrad;
    if (!isTransparent) {
        ctx.shadowColor = needleColor;
        ctx.shadowBlur = 10;
    }
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 0;
    ctx.stroke();

    // Draw icon
    ctx.fillStyle = adjustColorBrightness(needleColor, -30);
    ctx.font = 'bold 20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let iconChar = '';
    switch (centerIcon) {
        case 'heart':
            iconChar = '❤';
            break;
        case 'star':
            iconChar = '⭐';
            break;
        case 'circle':
            iconChar = '●';
            break;
        case 'diamond':
            iconChar = '◆';
            break;
    }

    ctx.fillText(iconChar, 0, centerIcon === 'heart' ? 2 : 0);
};

// Helper function to apply font effects
const applyFontEffect = (
    ctx: CanvasRenderingContext2D,
    effect: FontEffect,
    text: string,
    x: number,
    y: number,
    fillColor: string,
    isTransparent: boolean
) => {
    switch (effect) {
        case 'shadow':
            if (!isTransparent) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 4;
            }
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillStyle = fillColor;
            ctx.fillText(text, x, y);
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            break;

        case 'outline':
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.lineWidth = 4;
            ctx.strokeText(text, x, y);
            ctx.fillStyle = fillColor;
            ctx.fillText(text, x, y);
            break;

        case 'glow':
            if (!isTransparent) {
                ctx.shadowColor = fillColor;
                ctx.shadowBlur = 15;
            }
            ctx.fillStyle = fillColor;
            ctx.fillText(text, x, y);
            if (!isTransparent) {
                ctx.fillText(text, x, y); // Double for stronger glow
            }
            ctx.shadowBlur = 0;
            break;

        case 'emboss':
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText(text, x + 2, y + 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(text, x - 1, y - 1);
            ctx.fillStyle = fillColor;
            ctx.fillText(text, x, y);
            break;

        case 'none':
        default:
            ctx.fillStyle = fillColor;
            ctx.fillText(text, x, y);
            break;
    }
};

// Helper function to adjust color brightness
const adjustColorBrightness = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
};

interface RatingMeterProps {
    ranges: RatingRange[];
    settings: MeterSettings;
    onCanvasReady?: (canvas: HTMLCanvasElement) => void;
    onScoreUpdate?: (score: number) => void;
    exportMode?: boolean;
    animationDuration?: number; // in ms
}

export interface RatingMeterHandle {
    replayAnimation: () => void;
}

export const RatingMeter = React.forwardRef<RatingMeterHandle, RatingMeterProps>(({
    ranges,
    settings,
    onCanvasReady,
    onScoreUpdate,
    exportMode = false,
    animationDuration = 5000
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [animatedScore, setAnimatedScore] = useState(0);
    const animationStartRef = useRef<number>(0);
    const [resetTrigger, setResetTrigger] = useState(0);

    React.useImperativeHandle(ref, () => ({
        replayAnimation: () => {
            setAnimatedScore(0);
            setResetTrigger(prev => prev + 1);
        }
    }));

    // Animation loop - time-based for export mode
    useEffect(() => {
        let animationFrameId: number;
        const targetScore = settings.scoreValue;

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
            // Replay animation if resetTrigger changes
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
    }, [settings.scoreValue, exportMode, animationDuration, resetTrigger]);

    // Sync score to parent
    useEffect(() => {
        if (onScoreUpdate) onScoreUpdate(animatedScore);
    }, [animatedScore, onScoreUpdate]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (onCanvasReady) onCanvasReady(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;


        const scale = exportMode ? 2 : 1;
        const width = canvas.width / scale; // Logical width
        const logicalHeight = canvas.height / scale; // Logical height

        const centerX = width / 2;
        const centerY = settings.meterShape === 'tube' ? logicalHeight * 0.5 : logicalHeight * 0.65;
        const radius = Math.min(width, logicalHeight) * 0.4;

        ctx.save();
        ctx.scale(scale, scale);

        // Clear canvas
        if (settings.backgroundColor === 'transparent') {
            ctx.clearRect(0, 0, width, logicalHeight);
        } else {
            ctx.fillStyle = settings.backgroundColor;
            ctx.fillRect(0, 0, width, logicalHeight);
        }

        // Filter valid ranges
        const validRanges = ranges.filter(r => r.max > r.min);
        if (validRanges.length === 0) {
            ctx.restore();
            return;
        }

        const minVal = validRanges[0].min;
        const maxVal = validRanges[validRanges.length - 1].max;
        const totalRange = maxVal - minVal;
        const isTransparent = settings.backgroundColor === 'transparent';

        // Common settings and calculations
        const skinSettings = SKIN_PALETTES[settings.skin] || SKIN_PALETTES.pastel;
        const clampedScore = Math.max(minVal, Math.min(maxVal, animatedScore));
        const activeRange = validRanges.find(r => clampedScore >= r.min && clampedScore <= r.max);

        // Custom font style based on settings
        const customLabelStyle = `bold ${settings.fontSize}px "${settings.fontFamily}", sans-serif`;

        if (settings.meterShape === 'tube') {
            const tubeWidth = 60;
            const tubeHeight = 280;
            const startY = centerY + tubeHeight / 2; // Bottom

            // Draw ranges as vertical segments
            let currentY = startY;

            validRanges.forEach((range, index) => {
                const rangeHeight = (range.max - range.min) / totalRange * tubeHeight;
                const segmentY = currentY - rangeHeight;
                const segmentColor = range.color || skinSettings.colors[index % skinSettings.colors.length];

                // Draw segment background (dimmed)
                ctx.fillStyle = segmentColor;
                ctx.globalAlpha = 0.2;
                if (settings.backgroundColor === 'transparent') ctx.globalAlpha = 0.4; // More visible on transparent

                // Rounded corners for top/bottom segments
                const isBottom = index === 0;
                const isTop = index === validRanges.length - 1;
                const cornerRadius = 10;

                const drawSegmentShape = () => {
                    ctx.beginPath();
                    if (isBottom && isTop) {
                        ctx.roundRect(centerX - tubeWidth / 2, segmentY, tubeWidth, rangeHeight, cornerRadius);
                    } else if (isBottom) {
                        ctx.roundRect(centerX - tubeWidth / 2, segmentY, tubeWidth, rangeHeight, [0, 0, cornerRadius, cornerRadius]);
                    } else if (isTop) {
                        ctx.roundRect(centerX - tubeWidth / 2, segmentY, tubeWidth, rangeHeight, [cornerRadius, cornerRadius, 0, 0]);
                    } else {
                        ctx.rect(centerX - tubeWidth / 2, segmentY, tubeWidth, rangeHeight);
                    }
                };

                drawSegmentShape();
                ctx.fill();

                // Draw Active Level (Bright)
                ctx.globalAlpha = 1;
                const activeHeight = Math.max(0, Math.min(range.max, animatedScore) - range.min) / (range.max - range.min) * rangeHeight;

                if (activeHeight > 0) {
                    ctx.fillStyle = segmentColor;

                    // Add glow if explicit skin setting or if this is the currently active range
                    // DISABLE GLOW if transparent background (causes artifacts in GIF)
                    const isActive = activeRange?.id === range.id;
                    const isTransparent = settings.backgroundColor === 'transparent';

                    if (skinSettings.glow && !isTransparent) {
                        ctx.shadowColor = segmentColor;
                        ctx.shadowBlur = isActive ? skinSettings.glowIntensity * 1.5 : skinSettings.glowIntensity * 0.5;
                    }

                    const activeY = currentY - activeHeight;

                    ctx.save();
                    drawSegmentShape(); // Reuse shape for clipping
                    ctx.clip();

                    ctx.fillRect(centerX - tubeWidth / 2, activeY, tubeWidth, activeHeight);
                    ctx.restore();

                    ctx.shadowBlur = 0;
                }

                // Segment Borders
                ctx.strokeStyle = skinSettings.borderColor;
                ctx.lineWidth = 2;
                drawSegmentShape(); // Reuse shape for stroke
                ctx.stroke();

                // Range Labels (Left Side)
                const labelY = currentY - rangeHeight / 2;
                const isActiveRange = activeRange?.id === range.id;
                const labelX = isActiveRange ? centerX - tubeWidth / 2 - 20 : centerX - tubeWidth / 2 - 15;

                ctx.font = isActiveRange
                    ? `bold ${Math.round(settings.fontSize * 1.0)}px "${settings.fontFamily}", sans-serif`
                    : `bold ${Math.round(settings.fontSize * 0.8)}px "${settings.fontFamily}", sans-serif`;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                applyFontEffect(ctx, settings.fontEffect, range.label, labelX, labelY, '#ffffff', isTransparent);

                currentY -= rangeHeight;
            });

            // Needle/Indicator (Right Side)
            const scoreRatio = (clampedScore - minVal) / totalRange;
            const indicatorY = startY - scoreRatio * tubeHeight;

            ctx.save();
            ctx.translate(centerX + tubeWidth / 2 + 5, indicatorY);
            ctx.rotate(Math.PI); // Point left
            drawNeedle(ctx, settings.needleType, 50, settings.needleColor, isTransparent);
            ctx.restore();

            // Center Icon (Bottom)
            ctx.save();
            ctx.translate(centerX, startY + 30);
            drawCenterIcon(ctx, settings.centerIcon, settings.needleColor, isTransparent);
            ctx.restore();

            // Title
            if (settings.titleVisible !== false) {
                const titleFontSize = settings.titleFontSize || Math.round(settings.fontSize * 1.1);
                ctx.font = `bold ${titleFontSize}px "${settings.fontFamily}", sans-serif`;
                ctx.textAlign = 'center';
                const defaultTitleColor = settings.theme === 'dark' ? '#fff' : '#000';
                const titleColor = settings.titleColor || defaultTitleColor;
                // Position relative to center. If 0, it's at center.
                // Current top default is roughly -250 (calculated as -center + top_offset)
                const titleY = centerY + (settings.titlePositionY || 0);

                ctx.textBaseline = 'middle';
                applyFontEffect(ctx, settings.fontEffect, settings.title, centerX, titleY, titleColor, isTransparent);
            }

            // Score needs visible color fallback
            const scoreColor = settings.theme === 'dark' ? '#fff' : '#000';

            // Score Value (near indicator)
            ctx.font = `bold ${Math.round(settings.fontSize * 2.2)}px "${settings.fontFamily}", sans-serif`;
            ctx.textAlign = 'left';
            applyFontEffect(ctx, settings.fontEffect, Math.round(animatedScore).toString(), centerX + tubeWidth / 2 + 60, indicatorY, scoreColor, isTransparent);



        } else {
            // GAUGE LOGIC 
            // Arc configuration
            const startRad = Math.PI;
            const endRad = Math.PI * 2;
            const totalAngle = endRad - startRad;

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

                // Draw block segment with rounded corners
                const cornerRadius = 6;

                // Calculate points for the rounded segment
                const innerStartX = centerX + Math.cos(rangeStart) * innerRad;
                const innerStartY = centerY + Math.sin(rangeStart) * innerRad;
                const innerEndX = centerX + Math.cos(rangeEnd) * innerRad;
                const innerEndY = centerY + Math.sin(rangeEnd) * innerRad;
                const outerStartX = centerX + Math.cos(rangeStart) * outerRad;
                const outerStartY = centerY + Math.sin(rangeStart) * outerRad;
                const outerEndX = centerX + Math.cos(rangeEnd) * outerRad;
                const outerEndY = centerY + Math.sin(rangeEnd) * outerRad;

                ctx.beginPath();

                // Start from inner arc start point
                ctx.moveTo(innerStartX, innerStartY);

                // Draw inner arc
                ctx.arc(centerX, centerY, innerRad, rangeStart, rangeEnd, false);

                // Draw rounded corner at inner-end to outer-end transition
                const angle1 = Math.atan2(outerEndY - innerEndY, outerEndX - innerEndX);
                ctx.arcTo(
                    innerEndX + Math.cos(angle1) * cornerRadius,
                    innerEndY + Math.sin(angle1) * cornerRadius,
                    outerEndX,
                    outerEndY,
                    cornerRadius
                );

                // Draw outer arc (reversed)
                ctx.arc(centerX, centerY, outerRad, rangeEnd, rangeStart, true);

                // Draw rounded corner at outer-start to inner-start transition
                const angle2 = Math.atan2(innerStartY - outerStartY, innerStartX - outerStartX);
                ctx.arcTo(
                    outerStartX + Math.cos(angle2) * cornerRadius,
                    outerStartY + Math.sin(angle2) * cornerRadius,
                    innerStartX,
                    innerStartY,
                    cornerRadius
                );

                ctx.closePath();

                // Enhanced glow for active range
                const isTransparent = settings.backgroundColor === 'transparent';

                if (isActive) {
                    if (!isTransparent) {
                        ctx.shadowColor = segmentColor;
                        ctx.shadowBlur = skinSettings.glowIntensity * 2;
                    }
                    ctx.globalAlpha = 1;
                } else if (skinSettings.glow && !isTransparent) {
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
                ctx.globalAlpha = 0.5; // 50% border opacity
                ctx.stroke();
                ctx.globalAlpha = 1; // Reset opacity
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

                            if (!isTransparent) {
                                ctx.shadowColor = '#00ffff';
                                ctx.shadowBlur = 5;
                            }

                            ctx.fillRect(-2, -2, 4, 4);
                            ctx.restore();
                        } else if (settings.skin === 'neon') {
                            // Neon: bright dots with glow
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

                            if (!isTransparent) {
                                ctx.shadowColor = '#ffffff';
                                ctx.shadowBlur = 8;
                            }

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

                // Labels with custom font and effects - scale with segment
                const labelRadius = isActive ? radius + 5 : radius - 10;
                const labelX = centerX + Math.cos(midAngle) * labelRadius;
                const labelY = centerY + Math.sin(midAngle) * labelRadius;

                ctx.font = isActive
                    ? `bold ${Math.round(settings.fontSize * 1.25)}px "${settings.fontFamily}", sans-serif`
                    : customLabelStyle;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowBlur = 0; // Clear any residual shadow from segments

                // Apply font effect
                applyFontEffect(ctx, settings.fontEffect, range.label, labelX, labelY, '#ffffff', isTransparent);
            });

            // Title with custom font and effect
            if (settings.titleVisible !== false) {
                const titleFontSize = settings.titleFontSize || Math.round(settings.fontSize * 1.1);
                ctx.font = `bold ${titleFontSize}px "${settings.fontFamily}", sans-serif`;
                ctx.textAlign = 'center';
                const defaultTitleColor = settings.theme === 'dark' ? '#fff' : '#000';
                const titleColor = settings.titleColor || defaultTitleColor;
                // Base is -350 from center (top area). Slider adds positive value.
                const titleY = (centerY - 350) + (settings.titlePositionY || 0);

                ctx.textBaseline = 'middle';
                applyFontEffect(ctx, settings.fontEffect, settings.title, centerX, titleY, titleColor, isTransparent);
            }

            // Score with custom font and effect
            const scoreColor = settings.theme === 'dark' ? '#fff' : '#000';
            ctx.font = `bold ${Math.round(settings.fontSize * 2.2)}px "${settings.fontFamily}", sans-serif`;
            ctx.font = `bold ${Math.round(settings.fontSize * 2.2)}px "${settings.fontFamily}", sans-serif`;
            applyFontEffect(ctx, settings.fontEffect, Math.round(animatedScore).toString(), centerX, centerY + 65, scoreColor, isTransparent);


            // Needle
            const scoreRatio = (clampedScore - minVal) / totalRange;
            const needleAngle = startRad + scoreRatio * totalAngle;
            const needleLength = radius - 65;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(needleAngle);

            // Draw needle based on type
            drawNeedle(ctx, settings.needleType, needleLength, settings.needleColor, isTransparent);

            // Draw center icon
            drawCenterIcon(ctx, settings.centerIcon, settings.needleColor, isTransparent);

            ctx.restore();
        }

        ctx.restore(); // Restore scale
    }, [ranges, settings, animatedScore, exportMode, animationDuration]);

    const baseSize = 600;
    const scale = exportMode ? 2 : 1;

    return (
        <div className="flex justify-center items-center p-4">
            <canvas
                ref={canvasRef}
                width={baseSize * scale}
                height={baseSize * scale}
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ width: '100%', maxWidth: `${baseSize}px` }}
            />
        </div>
    );
});
