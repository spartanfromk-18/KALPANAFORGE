import { useState, useCallback } from 'react';
import { TextLayer, EditorState, ImageFilters, TextAnimation, Preset, AspectRatio } from '../types';

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

interface HistoryStep {
    layers: TextLayer[];
    filters: ImageFilters;
}

export const useEditorState = (initialImage?: string, initialMask?: string) => {
    const [editorState, setEditorState] = useState<EditorState>({
        originalImage: initialImage || null,
        maskImage: initialMask || null,
        canvasWidth: 1080,
        canvasHeight: 1080,
        aspectRatio: AspectRatio.SQUARE,
        zoom: 1,
        filters: DEFAULT_FILTERS
    });

    const [layers, setLayers] = useState<TextLayer[]>([
        {
            id: '1',
            name: 'Main Text',
            text: 'DEPTH',
            fontFamily: 'Anton',
            fontSize: 280,
            color: '#ffffff',
            x: 540,
            y: 540,
            rotation: 0,
            opacity: 1,
            blendMode: 'source-over',
            shadowColor: '#000000',
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            strokeColor: '#000000',
            strokeWidth: 0,
            letterSpacing: 0,
            zIndex: 0,
            animation: { ...DEFAULT_ANIMATION },
            locked: false,
            hidden: false,
            fillType: 'SOLID'
        }
    ]);

    const [selectedLayerId, setSelectedLayerId] = useState<string | null>('1');
    const [checkedLayerIds, setCheckedLayerIds] = useState<Set<string>>(new Set());
    const [history, setHistory] = useState<HistoryStep[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Structural sharing helper: only deep copy layers that changed
    const createLayerSnapshot = useCallback((newLayers: TextLayer[], previousLayers?: TextLayer[]): TextLayer[] => {
        if (!previousLayers) {
            return newLayers.map(l => ({ ...l, animation: { ...l.animation } }));
        }

        return newLayers.map(newLayer => {
            const prevLayer = previousLayers.find(p => p.id === newLayer.id);
            // If layer unchanged (same reference or identical content), reuse reference
            if (prevLayer && JSON.stringify(prevLayer) === JSON.stringify(newLayer)) {
                return prevLayer; // Structural sharing - reuse existing object
            }
            // Only shallow copy the changed layer
            return { ...newLayer, animation: { ...newLayer.animation } };
        });
    }, []);

    const addToHistory = useCallback((newLayers: TextLayer[], newFilters: ImageFilters) => {
        const previousStep = history[historyIndex];
        const newHistory = history.slice(0, historyIndex + 1);

        // Use structural sharing - only copy changed layers
        const layerSnapshot = createLayerSnapshot(newLayers, previousStep?.layers);

        // Only copy filters if they changed
        const filterSnapshot = previousStep &&
            JSON.stringify(previousStep.filters) === JSON.stringify(newFilters)
            ? previousStep.filters  // Reuse filters reference
            : { ...newFilters };    // Shallow copy (filters are flat)

        newHistory.push({
            layers: layerSnapshot,
            filters: filterSnapshot
        });

        if (newHistory.length > 30) { // Increased limit since memory is now optimized
            newHistory.shift();
        } else {
            setHistoryIndex(newHistory.length - 1);
        }
        setHistory(newHistory);
    }, [history, historyIndex, createLayerSnapshot]);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const prevStep = history[historyIndex - 1];
            setLayers(prevStep.layers);
            setEditorState(prev => ({ ...prev, filters: prevStep.filters }));
            setHistoryIndex(historyIndex - 1);
        }
    }, [history, historyIndex]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextStep = history[historyIndex + 1];
            setLayers(nextStep.layers);
            setEditorState(prev => ({ ...prev, filters: nextStep.filters }));
            setHistoryIndex(historyIndex + 1);
        }
    }, [history, historyIndex]);

    const updateLayer = useCallback((key: keyof TextLayer, value: any) => {
        if (!selectedLayerId) return;
        setLayers(prev => prev.map(l => l.id === selectedLayerId ? { ...l, [key]: value } : l));
    }, [selectedLayerId]);

    const updateLayerFinal = useCallback(() => {
        addToHistory(layers, editorState.filters);
    }, [layers, editorState.filters, addToHistory]);

    const updateAnimation = useCallback((key: keyof TextAnimation, value: any) => {
        if (!selectedLayerId) return;
        setLayers(prev => prev.map(l => {
            if (l.id === selectedLayerId) {
                return {
                    ...l,
                    animation: { ...l.animation, [key]: value }
                };
            }
            return l;
        }));
    }, [selectedLayerId]);

    const updateFilter = useCallback((key: keyof ImageFilters, value: number) => {
        setEditorState(prev => ({
            ...prev,
            filters: { ...prev.filters, [key]: value }
        }));
    }, []);

    const addNewLayer = useCallback(() => {
        const newLayer: TextLayer = {
            id: crypto.randomUUID(),
            name: `Layer ${layers.length + 1}`,
            text: 'NEW TEXT',
            fontFamily: 'Inter',
            fontSize: 120,
            color: '#ffffff',
            x: editorState.canvasWidth / 2,
            y: editorState.canvasHeight / 2,
            rotation: 0,
            opacity: 1,
            blendMode: 'source-over',
            shadowColor: '#000000',
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            strokeColor: '#000000',
            strokeWidth: 0,
            letterSpacing: 0,
            zIndex: 1,
            animation: { ...DEFAULT_ANIMATION },
            locked: false,
            hidden: false,
            fillType: 'SOLID'
        };
        const newLayers = [...layers, newLayer];
        setLayers(newLayers);
        setSelectedLayerId(newLayer.id);
        addToHistory(newLayers, editorState.filters);
    }, [layers, editorState.canvasWidth, editorState.canvasHeight, editorState.filters, addToHistory]);

    const deleteLayer = useCallback((id: string) => {
        const newLayers = layers.filter(l => l.id !== id);
        setLayers(newLayers);
        if (selectedLayerId === id) setSelectedLayerId(null);
        addToHistory(newLayers, editorState.filters);
    }, [layers, selectedLayerId, editorState.filters, addToHistory]);

    const applyPreset = useCallback((preset: Preset) => {
        if (!selectedLayerId) return;
        const newLayers = layers.map(l => l.id === selectedLayerId ? { ...l, ...preset.styles } : l);
        setLayers(newLayers);
        addToHistory(newLayers, editorState.filters);
    }, [layers, selectedLayerId, editorState.filters, addToHistory]);

    const setDimensions = useCallback((w: number, h: number) => {
        setEditorState(prev => {
            const oldW = prev.canvasWidth;
            const oldH = prev.canvasHeight;

            // Adjust layers proportionally
            setLayers(currLayers => currLayers.map(l => ({
                ...l,
                x: (l.x / oldW) * w,
                y: (l.y / oldH) * h,
                fontSize: Math.round((l.fontSize / oldH) * h)
            })));

            return {
                ...prev,
                canvasWidth: w,
                canvasHeight: h,
                aspectRatio: w / h
            };
        });

        // Ensure we have a selection after the dust settles
        setTimeout(() => {
            setSelectedLayerId(currentId => currentId || '1');
        }, 100);
    }, []);

    const changeAspectRatio = useCallback((ratio: number) => {
        const base = 1080;
        let w = base;
        let h = base;
        if (ratio > 1) { h = base / ratio; } else { w = base * ratio; }
        setDimensions(w, h);
    }, [setDimensions]);

    return {
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
        updateLayer,
        updateLayerFinal,
        updateAnimation,
        updateFilter,
        addNewLayer,
        deleteLayer,
        applyPreset,
        changeAspectRatio,
        setDimensions
    };
};
