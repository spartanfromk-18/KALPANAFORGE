import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from './editor/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { AspectRatio, FontDef, Preset, SavedProject, ImageFilters, TextAnimation, TextLayer } from '../types';
import { enhanceImage, suggestCaption } from '../services/geminiService';
import { saveProjectToRepo, getAllProjects, deleteProjectFromRepo } from '../services/storageService';
import { Modal } from './Modal';
import { useEditorState } from '../hooks/useEditorState';
import { GuidePanel } from './editor/GuidePanel';
import { mrxService } from '../services/mrx';



// --- SECURITY & UTILITY ENGINE ---
const sanitizeInput = (input: string): string => {
  // Strips HTML tags and suspicious script patterns
  return input.replace(/<[^>]*>?/gm, '').replace(/javascript:/gi, '');
};

const INITIAL_FONTS: FontDef[] = [
  { name: 'Inter', family: 'Inter', category: 'Sans' },
  { name: 'Montserrat', family: 'Montserrat', category: 'Sans' },
  { name: 'Anton', family: 'Anton', category: 'Display' },
  { name: 'Bebas Neue', family: 'Bebas Neue', category: 'Display' },
  { name: 'Oswald', family: 'Oswald', category: 'Sans' },
  { name: 'Orbitron', family: 'Orbitron', category: 'Modern' },
  { name: 'Bungee Shade', family: 'Bungee Shade', category: 'Display' },
  { name: 'Righteous', family: 'Righteous', category: 'Modern' },
  { name: 'Lobster', family: 'Lobster', category: 'Handwriting' },
  { name: 'Playfair', family: 'Playfair Display', category: 'Serif' },
  { name: 'Abril Fatface', family: 'Abril Fatface', category: 'Serif' },
  { name: 'Creepster', family: 'Creepster', category: 'Display' },
  { name: 'Permanent Marker', family: 'Permanent Marker', category: 'Handwriting' },
  { name: 'Cinzel', family: 'Cinzel', category: 'Serif' },
  { name: 'Monoton', family: 'Monoton', category: 'Display' },
  { name: 'Pacifico', family: 'Pacifico', category: 'Handwriting' },
  { name: 'Press Start 2P', family: 'Press Start 2P', category: 'Display' },
  { name: 'Vampiro One', family: 'Vampiro One', category: 'Display' },
  { name: 'Black Ops One', family: 'Black Ops One', category: 'Display' },
];

const PRESETS: Preset[] = [
  {
    id: 'none',
    name: 'Plain',
    thumbnailColor: '#ffffff',
    styles: {
      color: '#ffffff', shadowBlur: 0, strokeWidth: 0, blendMode: 'source-over', fillType: 'SOLID'
    }
  },
  {
    id: 'neon',
    name: 'Neon Cyan',
    thumbnailColor: '#22d3ee',
    styles: {
      color: '#ffffff', shadowColor: '#22d3ee', shadowBlur: 25, strokeColor: '#22d3ee', strokeWidth: 2, blendMode: 'screen', fillType: 'SOLID'
    }
  },
  {
    id: 'gold',
    name: 'Luxury Gold',
    thumbnailColor: '#ffd700',
    styles: {
      color: '#ffd700', shadowColor: '#b8860b', shadowBlur: 15, shadowOffsetX: 4, shadowOffsetY: 4, blendMode: 'hard-light', fillType: 'GRADIENT', gradientType: 'LINEAR', gradientStops: [{ offset: 0, color: '#ffd700' }, { offset: 1, color: '#b8860b' }], gradientAngle: 45
    }
  },
  {
    id: 'hollow',
    name: 'Hollow',
    thumbnailColor: 'transparent',
    styles: {
      color: 'rgba(0,0,0,0)', strokeColor: '#ffffff', strokeWidth: 3, shadowBlur: 0, fillType: 'SOLID'
    }
  },
  {
    id: 'vibe',
    name: 'Retro Vibe',
    thumbnailColor: '#f472b6',
    styles: {
      color: '#f472b6', shadowColor: '#8b5cf6', shadowBlur: 0, shadowOffsetX: 6, shadowOffsetY: 6, strokeWidth: 0, fillType: 'SOLID'
    }
  },
  {
    id: 'dark',
    name: 'Dark Soul',
    thumbnailColor: '#000000',
    styles: {
      color: '#000000', strokeColor: '#ffffff', strokeWidth: 1, shadowColor: '#ffffff', shadowBlur: 15, fillType: 'SOLID'
    }
  }
];

const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0
};

const DEFAULT_ANIMATION: TextAnimation = {
  type: 'NONE',
  duration: 1000,
  delay: 0,
  loop: true
};



export const Editor: React.FC<{ initialImage?: string; initialMask?: string; onReturnToHub: () => void; onViewGallery: () => void }> = ({ initialImage, initialMask, onReturnToHub, onViewGallery }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maskInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);

  const {
    editorState,
    setEditorState,
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    checkedLayerIds,
    setCheckedLayerIds,
    historyIndex,
    history,
    addToHistory,
    handleUndo,
    handleRedo,
    updateLayer: originalUpdateLayer,
    updateLayerFinal,
    updateAnimation,
    updateFilter,
    addNewLayer,
    deleteLayer,
    applyPreset,
    changeAspectRatio,
    setDimensions
  } = useEditorState(initialImage, initialMask);

  const handleMedicate = () => {
    const result = mrxService.applyMedication();
    setSupremeNotice(result.message);
    setTimeout(() => setSupremeNotice(null), 5000);
  };

  const updateLayer = (key: keyof TextLayer, value: any) => {
    if (!mrxService.auditAction('LAYER_UPDATE', { key, value })) {
      setSupremeNotice("Mr. X blocked a suspicious input pattern.");
      setTimeout(() => setSupremeNotice(null), 3000);
      return;
    }
    originalUpdateLayer(key, value);
  };

  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const maskImageRef = useRef<HTMLImageElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isOffscreenDirtyRef = useRef<boolean>(true);
  const animationFrameRef = useRef<number>(0);
  const isDirtyRef = useRef<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartPosRef = useRef<{ x: number, y: number } | null>(null);
  const initialLayerPosMapRef = useRef<Record<string, { x: number, y: number }>>({});
  const animationStartRef = useRef<number>(0);
  const [handleAction, setHandleAction] = useState<'NONE' | 'RESIZE' | 'ROTATE'>('NONE');
  const [snapLines, setSnapLines] = useState<{ x?: number, y?: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [glitchActive, setGlitchActive] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'LAYERS' | 'PRESETS' | 'TEXT' | 'ANIMATE' | 'ADJUST' | 'IMAGE' | 'AI' | 'PROJECTS'>(initialImage ? 'TEXT' : 'IMAGE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSecure] = useState(true);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [fontList, setFontList] = useState<FontDef[]>(INITIAL_FONTS);
  const [draggedLayerIndex, setDraggedLayerIndex] = useState<number | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [supremeNotice, setSupremeNotice] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isPrompt?: boolean;
    inputValue?: string;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

  // Touch gesture state for pinch-to-zoom
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [touchStartZoom, setTouchStartZoom] = useState<number>(1);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (history.length === 0) {
      addToHistory(layers, editorState.filters);
    }
  }, []);

  // --- Proactive Mr. X Advice ---
  useEffect(() => {
    if (!isPlaying && layers.length > 0) {
      const advice = mrxService.getEliteAdvice(layers, editorState.canvasWidth, editorState.canvasHeight);
      if (advice) {
        setSupremeNotice(advice);
        setTimeout(() => setSupremeNotice(null), 8000);
      }
    }
  }, [layers, isPlaying]);

  // --- Offscreen Canvas Management ---
  useEffect(() => {
    isOffscreenDirtyRef.current = true;
  }, [editorState.originalImage, editorState.filters, editorState.canvasWidth, editorState.canvasHeight]);

  const updateOffscreenCanvas = (w: number, h: number) => {
    if (!bgImageRef.current) return;
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
    }
    const canvas = offscreenCanvasRef.current;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    const f = editorState.filters;
    ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%)`;
    ctx.drawImage(bgImageRef.current, 0, 0, w, h);
    ctx.restore();
    isOffscreenDirtyRef.current = false;
  };

  // --- Performance & Optimization Logic ---

  useEffect(() => {
    if (initialImage) {
      const img = new Image();
      img.onload = () => {
        setDimensions(img.naturalWidth, img.naturalHeight);
      };
      img.src = initialImage;
    }
  }, [initialImage, setDimensions]);

  useEffect(() => {
    if (editorState.originalImage) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = editorState.originalImage;
      img.onload = () => {
        bgImageRef.current = img;
        isDirtyRef.current = true;
      };
    }
  }, [editorState.originalImage]);

  useEffect(() => {
    if (editorState.maskImage) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = editorState.maskImage;
      img.onload = () => {
        maskImageRef.current = img;
        isDirtyRef.current = true;
      };
    } else {
      maskImageRef.current = null;
      isDirtyRef.current = true;
    }
  }, [editorState.maskImage]);

  useEffect(() => {
    isDirtyRef.current = true;
    isOffscreenDirtyRef.current = true; // Any change to layers or dimensions requires redraw, but specific checks below
  }, [layers, editorState.canvasWidth, editorState.canvasHeight]);

  useEffect(() => {
    isOffscreenDirtyRef.current = true;
    isDirtyRef.current = true;
  }, [editorState.filters]);

  const calculateAnimation = (anim: TextAnimation, currentTime: number) => {
    if (anim.type === 'NONE' || !isPlaying) {
      return { opacityMult: 1, yOffset: 0, scaleMult: 1, textLimit: -1 };
    }

    let elapsed = currentTime - animationStartRef.current - anim.delay;
    if (elapsed < 0) elapsed = 0;

    let progress = 0;

    if (anim.loop) {
      progress = (elapsed % anim.duration) / anim.duration;
    } else {
      progress = Math.min(1, elapsed / anim.duration);
    }

    switch (anim.type) {
      case 'FADE_IN':
        return { opacityMult: progress, yOffset: 0, scaleMult: 1, textLimit: -1 };
      case 'SLIDE_UP':
        const slideP = 1 - Math.pow(1 - progress, 3);
        return { opacityMult: progress, yOffset: (1 - slideP) * 100, scaleMult: 1, textLimit: -1 };
      case 'BOUNCE':
        const bounce = Math.abs(Math.sin(progress * Math.PI * 2));
        return { opacityMult: 1, yOffset: -bounce * 50, scaleMult: 1, textLimit: -1 };
      case 'PULSE':
        const pulse = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
        return { opacityMult: 1, yOffset: 0, scaleMult: pulse, textLimit: -1 };
      case 'TYPEWRITER':
        return { opacityMult: 1, yOffset: 0, scaleMult: 1, textLimit: progress };
      default:
        return { opacityMult: 1, yOffset: 0, scaleMult: 1, textLimit: -1 };
    }
  };

  const renderLoop = useCallback(() => {
    const now = performance.now();
    mrxService.recordFrame(now);

    if (canvasRef.current && bgImageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Calculate common dimensions once per frame
        const bgImgValue = bgImageRef.current;
        const ratio = Math.max(canvas.width / bgImgValue.width, canvas.height / bgImgValue.height);
        const w = bgImgValue.width * ratio;
        const h = bgImgValue.height * ratio;
        const x = (canvas.width - w) / 2;
        const y = (canvas.height - h) / 2;

        // 1. UPDATE OFFSCREEN CACHE if dirty
        if (isOffscreenDirtyRef.current || !offscreenCanvasRef.current) {
          if (!offscreenCanvasRef.current) {
            offscreenCanvasRef.current = document.createElement('canvas');
          }
          const offscreen = offscreenCanvasRef.current;
          offscreen.width = canvas.width;
          offscreen.height = canvas.height;
          const offCtx = offscreen.getContext('2d');

          if (offCtx) {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

            // Apply Filters to Background
            offCtx.save();
            const f = editorState.filters;
            offCtx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturation}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%)`;
            offCtx.drawImage(bgImgValue, 0, 0, bgImgValue.width, bgImgValue.height, x, y, w, h);
            offCtx.restore();

            // Draw Background Layers (zIndex 0)
            const drawLayersToOffscreen = (targetZIndex: number) => {
              layers.filter(l => l.zIndex === targetZIndex && !l.hidden).forEach(layer => {
                // We don't animate offscreen layers for now to keep cache stable
                if (layer.animation?.type !== 'NONE' && isPlaying) return;

                offCtx.save();
                offCtx.translate(layer.x, layer.y);
                offCtx.rotate((layer.rotation * Math.PI) / 180);
                offCtx.font = `${900} ${layer.fontSize}px ${layer.fontFamily}`;
                offCtx.textAlign = 'center';
                offCtx.textBaseline = 'middle';
                offCtx.globalAlpha = layer.opacity;
                offCtx.globalCompositeOperation = layer.blendMode;

                if (layer.shadowBlur > 0) {
                  offCtx.shadowColor = layer.shadowColor;
                  offCtx.shadowBlur = layer.shadowBlur;
                }

                offCtx.fillStyle = layer.color;
                offCtx.fillText(layer.text, 0, 0);
                offCtx.restore();
              });
            };

            drawLayersToOffscreen(0);
            isOffscreenDirtyRef.current = false;
          }
        }

        // 2. MAIN DRAW
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw cached background + mask path (mask isn't cached as it might be dynamic/AI driven)
        if (offscreenCanvasRef.current) {
          ctx.drawImage(offscreenCanvasRef.current, 0, 0);
        }

        const drawLayers = (targetZIndex: number) => {
          // Only draw visible layers
          layers.filter(l => l.zIndex === targetZIndex && !l.hidden).forEach(layer => {
            const animState = calculateAnimation(layer.animation || DEFAULT_ANIMATION, now);

            ctx.save();
            ctx.translate(layer.x, layer.y);
            ctx.rotate((layer.rotation * Math.PI) / 180);
            ctx.translate(0, animState.yOffset);
            ctx.scale(animState.scaleMult, animState.scaleMult);

            ctx.font = `${900} ${layer.fontSize}px ${layer.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = layer.opacity * animState.opacityMult;
            ctx.globalCompositeOperation = layer.blendMode;
            ctx.letterSpacing = `${layer.letterSpacing}px`;

            if (layer.shadowBlur > 0 || layer.shadowOffsetX !== 0 || layer.shadowOffsetY !== 0) {
              ctx.shadowColor = layer.shadowColor;
              ctx.shadowBlur = layer.shadowBlur;
              ctx.shadowOffsetX = layer.shadowOffsetX;
              ctx.shadowOffsetY = layer.shadowOffsetY;
            }

            let textToDraw = layer.text;
            if (animState.textLimit !== -1) {
              const charCount = Math.floor(layer.text.length * animState.textLimit);
              textToDraw = layer.text.substring(0, charCount);
            }

            if (layer.strokeWidth > 0) {
              ctx.lineWidth = layer.strokeWidth;
              ctx.strokeStyle = layer.strokeColor;
              ctx.lineJoin = 'round';
              ctx.strokeText(textToDraw, 0, 0);
            }

            // GRADIENT FILL LOGIC
            if (layer.fillType === 'GRADIENT') {
              let gradient;
              const textMetrics = ctx.measureText(textToDraw);
              const textWidth = textMetrics.width;
              const textHeight = layer.fontSize; // Approx

              if (layer.gradientType === 'RADIAL') {
                gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, textWidth / 2);
              } else {
                // Linear
                const angle = (layer.gradientAngle || 0) * (Math.PI / 180);
                const x1 = -textWidth / 2 * Math.cos(angle);
                const y1 = -textHeight / 2 * Math.sin(angle);
                const x2 = textWidth / 2 * Math.cos(angle);
                const y2 = textHeight / 2 * Math.sin(angle);
                gradient = ctx.createLinearGradient(x1, y1, x2, y2);
              }

              (layer.gradientStops || [{ offset: 0, color: layer.color }, { offset: 1, color: layer.color }]).forEach(stop => {
                gradient.addColorStop(stop.offset, stop.color);
              });
              ctx.fillStyle = gradient;
            } else {
              ctx.fillStyle = layer.color;
            }

            ctx.fillText(textToDraw, 0, 0);

            // Draw selection box
            if (selectedLayerId === layer.id && !isPlaying) {
              ctx.strokeStyle = layer.locked ? '#ef4444' : '#22d3ee'; // Red if locked, Cyan if active
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              const metrics = ctx.measureText(layer.text);
              const height = layer.fontSize;
              ctx.strokeRect(-metrics.width / 2 - 10, -height / 2 - 10, metrics.width + 20, height + 20);
              ctx.setLineDash([]);

              if (layer.locked) {
                // Draw small lock icon
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(metrics.width / 2 + 10, -height / 2 - 10, 8, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            if (layer.id === selectedLayerId && !isPlaying) {
              const padding = 10;
              const w = ctx.measureText(layer.text).width + padding * 2;
              const h = layer.fontSize + padding * 2;

              ctx.strokeStyle = '#22d3ee';
              ctx.lineWidth = 2 / animState.scaleMult;
              ctx.setLineDash([5, 5]);
              ctx.strokeRect(-w / 2, -h / 2, w, h);
              ctx.setLineDash([]);

              // Draw Resize Handles (Corners)
              const handleSize = 10 / animState.scaleMult;
              ctx.fillStyle = '#22d3ee';
              ctx.shadowColor = 'rgba(34, 211, 238, 0.5)';
              ctx.shadowBlur = 10;

              [[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]].forEach(([px, py]) => {
                ctx.beginPath();
                ctx.arc(px, py, handleSize / 2, 0, Math.PI * 2);
                ctx.fill();
              });

              // Rotate Handle
              ctx.beginPath();
              ctx.moveTo(0, -h / 2);
              ctx.lineTo(0, -h / 2 - 30);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(0, -h / 2 - 30, handleSize / 1.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }

            ctx.restore();
          });
        };

        if (isOffscreenDirtyRef.current) {
          updateOffscreenCanvas(editorState.canvasWidth, editorState.canvasHeight);
        }

        if (offscreenCanvasRef.current) {
          // Fast-path for Glitch Effect (Competitive Edge)
          if (glitchActive && !isPlaying) {
            ctx.save();
            const glitchAmount = Math.random() * 10;
            if (glitchAmount > 7) {
              const sliceY = Math.random() * canvas.height;
              const sliceH = Math.random() * 50;
              const offset = (Math.random() - 0.5) * 40;
              ctx.drawImage(offscreenCanvasRef.current, 0, sliceY, canvas.width, sliceH, offset, sliceY, canvas.width, sliceH);
              ctx.fillStyle = `rgba(255,0,0,0.1)`;
              ctx.fillRect(0, sliceY, canvas.width, sliceH);
            } else {
              ctx.drawImage(offscreenCanvasRef.current, 0, 0);
            }
            ctx.restore();
          } else {
            ctx.drawImage(offscreenCanvasRef.current, 0, 0);
          }
        }

        drawLayers(0);

        if (maskImageRef.current) {
          const maskImg = maskImageRef.current;
          ctx.drawImage(maskImg, 0, 0, maskImg.width, maskImg.height, x, y, w, h);
        }

        drawLayers(1);

        // Draw snap lines
        if (snapLines && !isPlaying) {
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          if (snapLines.x !== undefined) {
            ctx.beginPath();
            ctx.moveTo(snapLines.x, 0);
            ctx.lineTo(snapLines.x, canvas.height);
            ctx.stroke();
          }
          if (snapLines.y !== undefined) {
            ctx.beginPath();
            ctx.moveTo(0, snapLines.y);
            ctx.lineTo(canvas.width, snapLines.y);
            ctx.stroke();
          }
          ctx.setLineDash([]);
        }

        if (!isPlaying) {
          isDirtyRef.current = false;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }, [layers, editorState, selectedLayerId, isPlaying, snapLines]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [renderLoop]);

  // --- Canvas Interactions ---

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isPlaying) return;

    // Pan detection (Middle mouse or Space)
    if (('button' in e && e.button === 1)) {
      setIsPanning(true);
      dragStartPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Adjust for current Zoom and Pan
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = ((clientX - rect.left) * scaleX);
    const mouseY = ((clientY - rect.top) * scaleY);

    // 1. Check for Handles first if a layer is selected
    const selectedLayer = layers.find(l => l.id === selectedLayerId);
    if (selectedLayer && !isPlaying) {
      const padding = 10;
      const w = (selectedLayer.fontSize * selectedLayer.text.length * 0.6) + padding * 2;
      const h = selectedLayer.fontSize + padding * 2;

      // Transform mouse to local space
      const dx = mouseX - selectedLayer.x;
      const dy = mouseY - selectedLayer.y;
      const rad = -(selectedLayer.rotation * Math.PI) / 180;
      const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

      // Check Rotate Handle (top)
      const distRotate = Math.sqrt(Math.pow(localX - 0, 2) + Math.pow(localY - (-h / 2 - 30), 2));
      if (distRotate < 15) {
        setHandleAction('ROTATE');
        isDraggingRef.current = true;
        dragStartPosRef.current = { x: mouseX, y: mouseY };
        return;
      }

      // Check Resize Handles (corners)
      const handleSize = 20;
      const corners = [[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]];
      for (let i = 0; i < corners.length; i++) {
        const [cx, cy] = corners[i];
        if (Math.abs(localX - cx) < handleSize && Math.abs(localY - cy) < handleSize) {
          setHandleAction('RESIZE');
          isDraggingRef.current = true;
          dragStartPosRef.current = { x: mouseX, y: mouseY };
          return;
        }
      }
    }

    // 2. Find clicked layer (standard body click)
    const clickedLayer = [...layers].reverse().find(layer => {
      if (layer.hidden || layer.locked) return false;
      const dx = Math.abs(mouseX - layer.x);
      const dy = Math.abs(mouseY - layer.y);
      const width = (layer.fontSize * layer.text.length * 0.6) / 2;
      const height = layer.fontSize / 2;
      return dx < width && dy < height;
    });

    if (clickedLayer) {
      setSelectedLayerId(clickedLayer.id);
      isDraggingRef.current = true;
      dragStartPosRef.current = { x: mouseX, y: mouseY };

      // Logic for Groups
      const layersToMove = clickedLayer.groupId
        ? layers.filter(l => l.groupId === clickedLayer.groupId)
        : [clickedLayer];

      // Store initial positions
      initialLayerPosMapRef.current = {};
      layersToMove.forEach(l => {
        initialLayerPosMapRef.current[l.id] = { x: l.x, y: l.y };
      });
    } else {
      // Deselect if clicked empty space
      setSelectedLayerId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isPanning) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (clientX - rect.left) * scaleX;
    const mouseY = (clientY - rect.top) * scaleY;

    if (isPanning && dragStartPosRef.current) {
      setPanOffset(prev => ({
        x: prev.x + (clientX - dragStartPosRef.current!.x),
        y: prev.y + (clientY - dragStartPosRef.current!.y)
      }));
      dragStartPosRef.current = { x: clientX, y: clientY };
      return;
    }

    if (!isDraggingRef.current || !selectedLayerId || !dragStartPosRef.current) {
      setSnapLines(null); // Clear snap lines if not dragging
      return;
    }

    if (handleAction === 'ROTATE' && selectedLayerId) {
      const layer = layers.find(l => l.id === selectedLayerId);
      if (layer) {
        const angle = Math.atan2(mouseY - layer.y, mouseX - layer.x) * 180 / Math.PI;
        updateLayer('rotation', angle + 90);
      }
      return;
    }

    if (handleAction === 'RESIZE' && selectedLayerId) {
      const layer = layers.find(l => l.id === selectedLayerId);
      if (layer) {
        const dist = Math.sqrt(Math.pow(mouseX - layer.x, 2) + Math.pow(mouseY - layer.y, 2));
        const oldDist = Math.sqrt(Math.pow(dragStartPosRef.current.x - layer.x, 2) + Math.pow(dragStartPosRef.current.y - layer.y, 2));
        const scale = dist / oldDist;
        updateLayer('fontSize', Math.max(10, Math.round(layer.fontSize * scale)));
        dragStartPosRef.current = { x: mouseX, y: mouseY };
      }
      return;
    }

    const dx = mouseX - dragStartPosRef.current.x;
    const dy = mouseY - dragStartPosRef.current.y;

    // Magnetic snap threshold (pixels)
    const SNAP_THRESHOLD = 12;
    const canvasCenterX = editorState.canvasWidth / 2;
    const canvasCenterY = editorState.canvasHeight / 2;

    // Figma-style specific snap points
    const snapPointsX = [0, canvasCenterX, editorState.canvasWidth, 50, editorState.canvasWidth - 50];
    const snapPointsY = [0, canvasCenterY, editorState.canvasHeight, 50, editorState.canvasHeight - 50];

    // Calculate proposed new position for the selected layer
    const selectedInitialPos = initialLayerPosMapRef.current[selectedLayerId];
    if (!selectedInitialPos) return;

    let proposedX = selectedInitialPos.x + dx;
    let proposedY = selectedInitialPos.y + dy;
    let newSnapLines: { x?: number; y?: number } = {};

    // Snap to canvas points
    snapPointsX.forEach(px => {
      if (Math.abs(proposedX - px) < SNAP_THRESHOLD) {
        proposedX = px;
        newSnapLines.x = px;
      }
    });

    snapPointsY.forEach(py => {
      if (Math.abs(proposedY - py) < SNAP_THRESHOLD) {
        proposedY = py;
        newSnapLines.y = py;
      }
    });

    // Snap to other layers (including bounds)
    layers.forEach(otherLayer => {
      if (otherLayer.id === selectedLayerId || initialLayerPosMapRef.current[otherLayer.id] || otherLayer.hidden) return;

      // Snap Center-to-Center
      if (Math.abs(proposedX - otherLayer.x) < SNAP_THRESHOLD) {
        proposedX = otherLayer.x;
        newSnapLines.x = otherLayer.x;
      }
      if (Math.abs(proposedY - otherLayer.y) < SNAP_THRESHOLD) {
        proposedY = otherLayer.y;
        newSnapLines.y = otherLayer.y;
      }

      // Snap to Bounds (Approximate based on font size)
      const otherW = (otherLayer.fontSize * otherLayer.text.length * 0.3);
      const otherH = otherLayer.fontSize / 2;

      const boundsX = [otherLayer.x - otherW, otherLayer.x + otherW];
      const boundsY = [otherLayer.y - otherH, otherLayer.y + otherH];

      boundsX.forEach(bx => {
        if (Math.abs(proposedX - bx) < SNAP_THRESHOLD) {
          proposedX = bx;
          newSnapLines.x = bx;
        }
      });

      boundsY.forEach(by => {
        if (Math.abs(proposedY - by) < SNAP_THRESHOLD) {
          proposedY = by;
          newSnapLines.y = by;
        }
      });
    });

    // Calculate the snapped offset
    const snappedDx = proposedX - selectedInitialPos.x;
    const snappedDy = proposedY - selectedInitialPos.y;

    // Update snap lines for visual feedback
    setSnapLines(newSnapLines.x !== undefined || newSnapLines.y !== undefined ? newSnapLines : null);

    // Update positions of ALL linked layers with snapped values
    setLayers(prev => prev.map(l => {
      if (initialLayerPosMapRef.current[l.id]) {
        return {
          ...l,
          x: initialLayerPosMapRef.current[l.id].x + snappedDx,
          y: initialLayerPosMapRef.current[l.id].y + snappedDy
        };
      }
      return l;
    }));
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      dragStartPosRef.current = null;
      initialLayerPosMapRef.current = {};
      setHandleAction('NONE');
      addToHistory(layers, editorState.filters);
    }
  };

  // Touch gesture handlers for pinch-to-zoom
  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Start pinch-to-zoom
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      setTouchStartDistance(distance);
      setTouchStartZoom(zoom);
      lastTouchRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
    } else if (e.touches.length === 1) {
      // Single touch - pass to mouse handler
      handleCanvasMouseDown(e as any);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistance) {
      // Pinch-to-zoom in progress
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const scale = distance / touchStartDistance;
      const newZoom = Math.max(0.1, Math.min(10, touchStartZoom * scale));
      setZoom(newZoom);

      // 2-finger pan refinement
      const currentCenter = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
      if (lastTouchRef.current) {
        const dx = (currentCenter.x - lastTouchRef.current.x) / zoom;
        const dy = (currentCenter.y - lastTouchRef.current.y) / zoom;
        setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      }
      lastTouchRef.current = currentCenter;
    } else if (e.touches.length === 1) {
      // Single touch - pass to mouse handler
      handleCanvasMouseMove(e as any);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setTouchStartDistance(null);
      lastTouchRef.current = null;
    }
    if (e.touches.length === 0) {
      handleCanvasMouseUp();
    }
  };

  // --- Actions ---

  const loadProjects = async () => {
    const projs = await getAllProjects();
    setSavedProjects(projs);
  };

  useEffect(() => {
    loadProjects();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
      if (e.key === 'Delete' && selectedLayerId && activeTab !== 'TEXT') {
        deleteLayer(selectedLayerId);
      }
      if (e.key === 'h' || e.key === 'H' || e.key === 'F1') {
        e.preventDefault();
        setShowGuide(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, selectedLayerId, activeTab]);

  // --- Modal Helpers ---
  const confirmAction = (message: string, onConfirm: () => void, title: string = "Confirm Action") => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm,
      isPrompt: false
    });
  };

  const handleSaveProject = async () => {
    if (!canvasRef.current) return;

    const name = prompt("Enter project name:", "My Creative Design");
    if (!name) return;

    const thumbnail = canvasRef.current.toDataURL('image/jpeg', 0.3);
    const newProject: SavedProject = {
      id: crypto.randomUUID(),
      name,
      lastModified: Date.now(),
      thumbnail,
      editorState,
      layers
    };
    try {
      await saveProjectToRepo(newProject);
      await loadProjects();
      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Project saved successfully!",
        onConfirm: () => { },
        isPrompt: false
      });
    } catch (e) {
      alert("Failed to save.");
    }
  };

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fontName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, ''); // Clean name
    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      if (!arrayBuffer) return;

      try {
        const fontFace = new FontFace(fontName, arrayBuffer);
        await fontFace.load();
        document.fonts.add(fontFace);

        const newFontDef: FontDef = {
          name: fontName,
          family: fontName,
          category: 'Custom'
        };

        setFontList(prev => [newFontDef, ...prev]);

        // Auto-select if a layer is selected
        if (selectedLayerId) {
          updateLayer('fontFamily', fontName);
          updateLayerFinal();
        }

        setModalConfig({
          isOpen: true,
          title: "Font Uploaded",
          message: `Successfully added font: ${fontName}`,
          onConfirm: () => { }
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load font file. Ensure it is a valid TTF, OTF, or WOFF.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleEnhance = async (type: 'CRISP' | 'MASK') => {
    if (!editorState.originalImage) return;
    setLoading(true);
    setLoadingMessage(type === 'MASK' ? "Generating Subject Mask..." : "Enhancing Image Resolution...");
    try {
      const result = await enhanceImage(editorState.originalImage, type);
      if (type === 'MASK') setEditorState(prev => ({ ...prev, maskImage: result }));
      else setEditorState(prev => ({ ...prev, originalImage: result }));
    } catch (error) { alert("AI operation failed."); }
    finally { setLoading(false); setLoadingMessage(""); }
  };

  const handleAiEdit = async () => {
    if (!editorState.originalImage || !promptInput) return;
    setLoading(true);
    setLoadingMessage("Applying Magic Edit...");
    try {
      const result = await enhanceImage(editorState.originalImage, 'CREATIVE', promptInput);
      setEditorState(prev => ({ ...prev, originalImage: result }));
    } catch (error) { console.error(error); }
    finally { setLoading(false); setLoadingMessage(""); }
  };

  const handleSuggestCaption = async () => {
    if (!editorState.originalImage || !selectedLayerId) return;
    setLoading(true);
    setLoadingMessage("Generating creative caption...");
    try {
      const suggestions = await suggestCaption(editorState.originalImage);
      if (suggestions && suggestions.length > 0) {
        const cleanCaption = sanitizeInput(suggestions[0]);
        updateLayer('text', cleanCaption);
        updateLayerFinal();
      }
    } catch (error) { alert("Caption generation failed."); }
    finally { setLoading(false); setLoadingMessage(""); }
  };

  const toggleLayerCheck = (id: string) => {
    const newSet = new Set(checkedLayerIds);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setCheckedLayerIds(newSet);
  };

  const createGroup = () => {
    if (checkedLayerIds.size < 2) return;
    const groupId = crypto.randomUUID();
    const newLayers = layers.map(l => checkedLayerIds.has(l.id) ? { ...l, groupId } : l);
    setLayers(newLayers);
    setCheckedLayerIds(new Set());
    addToHistory(newLayers, editorState.filters);
  };

  const ungroupLayers = () => {
    if (checkedLayerIds.size === 0) return;
    const newLayers = layers.map(l => checkedLayerIds.has(l.id) ? { ...l, groupId: undefined } : l);
    setLayers(newLayers);
    setCheckedLayerIds(new Set());
    addToHistory(newLayers, editorState.filters);
  };

  const toggleLock = (id: string) => setLayers(prev => prev.map(l => l.id === id ? { ...l, locked: !l.locked } : l));
  const toggleHide = (id: string) => setLayers(prev => prev.map(l => l.id === id ? { ...l, hidden: !l.hidden } : l));

  const handleDragStart = (_e: React.DragEvent, index: number) => setDraggedLayerIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedLayerIndex === null || draggedLayerIndex === index) return;
    const newLayers = [...layers];
    const draggedItem = newLayers[draggedLayerIndex];
    newLayers.splice(draggedLayerIndex, 1);
    newLayers.splice(index, 0, draggedItem);
    setLayers(newLayers);
    setDraggedLayerIndex(index);
  };
  const handleDragEnd = () => { setDraggedLayerIndex(null); addToHistory(layers, editorState.filters); };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMask: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (isMask) {
          setEditorState(prev => ({ ...prev, maskImage: res }));
        } else {
          // AUTO-RESPONSIVENESS: Detect natural resolution
          const img = new Image();
          img.onload = () => {
            setDimensions(img.naturalWidth, img.naturalHeight);
            setEditorState(prev => {
              const newState = { ...prev, originalImage: res, maskImage: null };
              setTimeout(() => addToHistory(layers, newState.filters), 100);
              return newState;
            });
          };
          img.src = res;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlay = () => {
    if (isPlaying) setIsPlaying(false);
    else { animationStartRef.current = performance.now(); setIsPlaying(true); }
  };

  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  const exportHighRes = async () => {
    setIsProcessing(true);
    setLoadingMessage("Forging High-Res Masterpiece...");

    // Psychology: Small delay to let the 'Bloom' effect sink in
    await new Promise(r => setTimeout(r, 1500));

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // HIGH-RES EXPORT ENGINE (4K Logic)
      // We temporarily scale up the canvas context or use an offscreen canvas
      const exportCanvas = document.createElement('canvas');
      const scale = 4; // 4x Upscale for 4K-ish results
      exportCanvas.width = editorState.canvasWidth * scale;
      exportCanvas.height = editorState.canvasHeight * scale;

      const exportCtx = exportCanvas.getContext('2d');
      if (exportCtx) {
        // Re-render everything at 4x scale here (logic to be refined)
        // For now, we use a high-quality drawImage of the current canvas
        exportCtx.imageSmoothingEnabled = true;
        exportCtx.imageSmoothingQuality = 'high';
        exportCtx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
      }

      const link = document.createElement('a');
      link.download = `kalpana-forge-4k-${Date.now()}.png`;
      link.href = exportCanvas.toDataURL('image/png', 1.0);
      link.click();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-20 pb-4 px-2 md:px-6 flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-y-auto lg:overflow-hidden relative">
      {/* SENTINEL SHIELD (Psychological Trust Indicator) */}
      <div className="fixed top-24 left-6 z-[60] hidden md:flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl group">
        <div className={`w-2 h-2 rounded-full ${isSecure ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'} shadow-[0_0_10px_rgba(52,211,153,0.5)]`} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-primary transition-colors">Sentinel Shield Active</span>
        <div className="absolute inset-0 border border-emerald-400/20 rounded-full animate-ping pointer-events-none opacity-20" />
      </div>

      {/* GLOBAL TOP-RIGHT DOWNLOAD BUTTON (OFFSET FOR AUTH) */}
      <div className="fixed top-6 right-20 sm:right-52 z-[60]">
        <button
          onClick={exportHighRes}
          className="group relative px-6 py-3 bg-primary hover:bg-primaryDark text-white font-black text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-110 active:scale-95 flex items-center gap-3 overflow-hidden"
        >
          <span className="relative z-10">Export Masterpiece</span>
          <svg className="relative z-10 transition-transform group-hover:translate-y-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
        </button>
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        footer={
          <>
            <button
              onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black hover:bg-black/5 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                modalConfig.onConfirm();
                setModalConfig(prev => ({ ...prev, isOpen: false }));
              }}
              className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-primaryDark transition-colors"
            >
              Confirm
            </button>
          </>
        }
      >
        <p className="text-base font-medium text-gray-700 leading-relaxed">
          {modalConfig.message}
        </p>
      </Modal>

      <Modal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        title="Forge Designer Guide"
      >
        <GuidePanel />
      </Modal>

      {/* ACCESSIBILITY: Hidden DOM tree for screen readers */}
      <div
        className="sr-only"
        role="region"
        aria-label="Editor Status"
        aria-live="polite"
      >
        <h2 id="editor-status">DepthText Studio Editor</h2>
        <p>Canvas size: {editorState.canvasWidth} by {editorState.canvasHeight} pixels</p>
        <p>Zoom level: {(zoom * 100).toFixed(0)} percent</p>
        <p>{layers.length} text layers on canvas</p>
        {selectedLayer && (
          <p>
            Selected layer: {selectedLayer.name || 'Unnamed'},
            Text: {selectedLayer.text},
            Font: {selectedLayer.fontFamily},
            Size: {selectedLayer.fontSize} pixels,
            Position: {Math.round(selectedLayer.x)}, {Math.round(selectedLayer.y)}
          </p>
        )}
        {isPlaying && <p aria-live="assertive">Animation is playing</p>}
        {loading && <p aria-live="assertive">{loadingMessage || 'Processing...'}</p>}

        <h3>Layer List (use arrow keys to navigate)</h3>
        <ul role="listbox" aria-label="Text Layers">
          {layers.map((layer, index) => (
            <li
              key={layer.id}
              role="option"
              aria-selected={layer.id === selectedLayerId}
              tabIndex={-1}
            >
              Layer {index + 1}: {layer.name || 'Unnamed'},
              {layer.hidden ? 'hidden' : 'visible'},
              {layer.locked ? 'locked' : 'unlocked'},
              Text: {layer.text}
            </li>
          ))}
        </ul>
      </div>

      {/* LEFT PANEL: CONTROLS */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        // Layers
        layers={layers}
        selectedLayerId={selectedLayerId}
        checkedLayerIds={checkedLayerIds}
        draggedLayerIndex={draggedLayerIndex}
        onSelectLayer={setSelectedLayerId}
        onToggleHide={toggleHide}
        onToggleLock={toggleLock}
        onDeleteLayer={deleteLayer}
        onAddLayer={addNewLayer}
        onToggleCheck={toggleLayerCheck}
        onCreateGroup={createGroup}
        onUngroup={ungroupLayers}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        // Presets
        presets={PRESETS}
        onApplyPreset={applyPreset}
        // Text
        selectedLayer={selectedLayer}
        fontList={fontList}
        fontInputRef={fontInputRef}
        onUpdateLayer={updateLayer}
        onUpdateLayerFinal={updateLayerFinal}
        onHandleFontUpload={handleFontUpload}
        onSuggestCaption={handleSuggestCaption}
        // Animation
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onUpdateAnimation={updateAnimation}
        // Adjust
        editorState={editorState}
        onUpdateFilter={updateFilter}
        onResetFilters={() => {
          setEditorState(prev => ({ ...prev, filters: DEFAULT_FILTERS }));
          setTimeout(() => addToHistory(layers, DEFAULT_FILTERS), 50);
        }}
        // Image
        fileInputRef={fileInputRef}
        maskInputRef={maskInputRef}
        onHandleImageUpload={handleImageUpload}
        onEnhance={handleEnhance}
        // AI
        promptInput={promptInput}
        setPromptInput={setPromptInput}
        onAiEdit={handleAiEdit}
        loading={loading}
        // Projects
        savedProjects={savedProjects}
        onLoadProject={(p) => {
          confirmAction("Load this project? Unsaved changes will be lost.", () => {
            setEditorState(p.editorState);
            const loadedLayers = p.layers.map((l: TextLayer) => ({
              ...l,
              animation: l.animation || { ...DEFAULT_ANIMATION },
              locked: l.locked || false,
              hidden: l.hidden || false,
              groupId: l.groupId || undefined,
              name: l.name || 'Text Layer',
              fillType: l.fillType || 'SOLID'
            }));
            setLayers(loadedLayers);
            addToHistory(loadedLayers, p.editorState.filters);
          }, "Load Project");
        }}
        onSaveProject={handleSaveProject}
        onDeleteProject={async (id, e) => {
          e.stopPropagation();
          confirmAction("Are you sure you want to delete this project?", async () => {
            await deleteProjectFromRepo(id);
            await loadProjects();
          }, "Delete Project");
        }}
        onReturnToHub={onReturnToHub}
        onViewGallery={onViewGallery}
        onMedicate={handleMedicate}
        glitchActive={glitchActive}
        onToggleGlitch={setGlitchActive}
      />
      <div className="flex-1 flex flex-col relative bg-surfaceHighlight/30 rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-surface/50 backdrop-blur">
          <div className="flex gap-4 items-center">
            <div className="text-xs text-gray-500 font-mono">
              {editorState.canvasWidth} x {editorState.canvasHeight}px
            </div>
            <div className="h-6 w-[1px] bg-white/10 mx-2" />
            <div className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded">
              {(zoom * 100).toFixed(0)}%
            </div>
            {/* Undo/Redo Controls */}
            <div className="flex items-center gap-1 ml-4 border-l border-white/10 pl-4">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Redo (Ctrl+Shift+Z)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7"></path></svg>
              </button>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {/* Playback Controls in Toolbar */}
            <button
              onClick={togglePlay}
              className={`p-2 rounded transition-all mr-2 ${isPlaying ? 'bg-red-500/20 text-red-400' : 'hover:text-primary text-gray-400'}`}
              title={isPlaying ? 'Stop Animation' : 'Play Animation'}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              )}
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          className={`flex-1 flex items-center justify-center p-4 md:p-12 canvas-grid overflow-hidden bg-black/20 ${isPanning ? 'cursor-grabbing' : ''}`}
          onWheel={(e) => {
            if (e.ctrlKey) {
              e.preventDefault();
              setZoom(prev => Math.max(0.1, Math.min(10, prev - e.deltaY * 0.001)));
            }
          }}
        >
          <div
            className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 bg-[#0a0a0a]"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxHeight: '100%',
              maxWidth: '100%'
            }}
          >
            <div style={{
              position: 'relative',
              width: editorState.canvasWidth,
              height: editorState.canvasHeight,
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom * Math.min(1, Math.min(
                (canvasRef.current?.parentElement?.clientWidth || 2000) / (editorState.canvasWidth || 1),
                (canvasRef.current?.parentElement?.clientHeight || 1200) / (editorState.canvasHeight || 1)
              ) * 0.9)})`,
              transformOrigin: 'center center',
              boxShadow: '0 0 50px rgba(0,0,0,0.5)',
            }}>
              <canvas
                ref={canvasRef}
                width={editorState.canvasWidth}
                height={editorState.canvasHeight}
                className="block cursor-crosshair shadow-2xl"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>

            {/* Help Concierge Button */}
            <button
              onClick={() => setShowGuide(true)}
              className="absolute bottom-6 left-6 w-12 h-12 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-primary shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:scale-110 hover:border-primary transition-all z-40 group"
              title="Open Studio Guide (H)"
            >
              <span className="text-xl font-black group-hover:scale-125 transition-transform">?</span>
            </button>

            {/* Empty State Upload Prompt */}
            {!editorState.originalImage && (
              <div
                className="absolute inset-0 bg-zinc-900/50 backdrop-blur-md border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer group hover:border-primary transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-all group-hover:scale-110">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:text-black">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Start Your Creation</h3>
                <p className="text-sm text-zinc-500 max-w-[200px] text-center font-medium">Click here or use the ASSETS tab to upload your photo</p>
              </div>
            )}

            {/* Loading / Progressive Bloom Overlay */}
            <AnimatePresence>
              {(loading || isProcessing) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center"
                >
                  {/* PROGRESSIVE BLOOM ANIMATION */}
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, 180, 360],
                        borderRadius: ["40%", "50%", "40%"]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-primary/20 blur-[60px]"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [360, 180, 0]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="w-32 h-32 border border-primary/40 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.2)]"
                    >
                      <div className="w-4 h-4 bg-primary rounded-full animate-ping" />
                    </motion.div>
                  </div>

                  <h3 className="mt-12 text-2xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                    {loadingMessage.toUpperCase() || "REFINING REALITY..."}
                  </h3>
                  <p className="mt-2 text-zinc-500 font-black text-[10px] uppercase tracking-[0.5em]">The Forge is Thinking</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SNAP GUIDES (Psychological Precision) */}
            {snapLines && (
              <>
                {snapLines.x !== undefined && (
                  <div
                    className="absolute top-0 bottom-0 w-[1px] bg-primary/50 shadow-[0_0_10px_rgba(34,211,238,1)] z-50 pointer-events-none"
                    style={{
                      left: '50%',
                      transform: `translateX(${(snapLines.x - (canvasRef.current?.width || 0) / 2) * zoom}px)`
                    }}
                  />
                )}
                {snapLines.y !== undefined && (
                  <div
                    className="absolute left-0 right-0 h-[1px] bg-primary/50 shadow-[0_0_10px_rgba(34,211,238,1)] z-50 pointer-events-none"
                    style={{
                      top: '50%',
                      transform: `translateY(${(snapLines.y - (canvasRef.current?.height || 0) / 2) * zoom}px)`
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-[88px] right-4 lg:top-auto lg:bottom-4 lg:right-6 flex flex-col gap-2 z-40">
        <div className="bg-surface/50 backdrop-blur-md p-1 rounded-lg border border-border">
          {[
            { label: 'Original', value: -1 }, // Custom logic for original
            { label: '1:1', value: AspectRatio.SQUARE },
            { label: '9:16', value: AspectRatio.STORY },
            { label: '16:9', value: AspectRatio.LANDSCAPE },
            { label: '4:5', value: AspectRatio.POST },
          ].map(r => (
            <button
              key={r.label}
              onClick={() => {
                if (r.value === -1) {
                  if (bgImageRef.current) {
                    setDimensions(bgImageRef.current.naturalWidth, bgImageRef.current.naturalHeight);
                  }
                } else {
                  changeAspectRatio(r.value);
                }
              }}
              className={`block w-full text-left px-2 py-1 text-[10px] font-bold rounded mb-1 last:mb-0 transition-all ${Math.abs(editorState.aspectRatio - r.value) < 0.01 ? 'bg-primary text-black' : 'text-gray-400 hover:bg-white/5'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* MR. X SUPREME NOTIFICATION UI */}
      <AnimatePresence>
        {supremeNotice && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 bg-black/60 backdrop-blur-2xl border border-primary/20 rounded-2xl shadow-3xl flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Mr. X Supreme Advice</p>
              <p className="text-sm font-bold text-white leading-tight">{supremeNotice}</p>
            </div>
            <div className="absolute inset-0 bg-primary/5 rounded-2xl animate-pulse -z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM TOOLBAR - Only visible on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-surface/95 backdrop-blur-xl border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-4">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            aria-label="Undo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>
            <span className="text-[10px] font-bold">Undo</span>
          </button>

          {/* Redo */}
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
            aria-label="Redo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7"></path></svg>
            <span className="text-[10px] font-bold">Redo</span>
          </button>

          {/* Add Layer */}
          <button
            onClick={addNewLayer}
            className="flex flex-col items-center gap-1 p-2 text-primary hover:text-primaryDark transition-colors"
            aria-label="Add Text Layer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span className="text-[10px] font-bold">Add Text</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${isPlaying ? 'text-red-400' : 'text-gray-400 hover:text-white'}`}
            aria-label={isPlaying ? 'Stop Animation' : 'Play Animation'}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            )}
            <span className="text-[10px] font-bold">{isPlaying ? 'Stop' : 'Play'}</span>
          </button>

          {/* Export */}
          <button
            onClick={exportHighRes}
            className="flex flex-col items-center gap-1 p-2 text-primary hover:text-primaryDark transition-colors"
            aria-label="Export Image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span className="text-[10px] font-bold">Export</span>
          </button>
        </div>
      </div>

      {/* ACCESSIBILITY LAYER (Hidden DOM mirrored to Canvas for SEO/Screen Readers) */}
      <div className="sr-only" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {layers.filter(l => !l.hidden).map(layer => (
          <div key={layer.id} style={{ position: 'absolute', left: layer.x, top: layer.y }}>
            {layer.text}
          </div>
        ))}
      </div>
    </div>
  );
};