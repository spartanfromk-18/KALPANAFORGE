import React from 'react';
import { motion } from 'framer-motion';
import { EditorState, ImageFilters } from '../../types';

interface AdjustInspectorProps {
    editorState: EditorState;
    glitchActive: boolean;
    onToggleGlitch: (active: boolean) => void;
    onUpdateFilter: (key: keyof ImageFilters, value: number) => void;
}

export const AdjustInspector: React.FC<AdjustInspectorProps> = ({
    editorState,
    glitchActive,
    onToggleGlitch,
    onUpdateFilter
}) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="adjust" className="space-y-6">
            <div className="p-3 bg-surfaceHighlight/30 border border-border rounded mb-4">
                <h4 className="text-[10px] text-textSecondary uppercase font-black tracking-widest mb-2">Color Grading</h4>
                <p className="text-[10px] text-textSecondary">Adjust the background image to match your text vibe.</p>
            </div>
            {[
                { label: 'Brightness', key: 'brightness', min: 0, max: 200, unit: '%' },
                { label: 'Contrast', key: 'contrast', min: 0, max: 200, unit: '%' },
                { label: 'Saturation', key: 'saturation', min: 0, max: 200, unit: '%' },
                { label: 'Blur', key: 'blur', min: 0, max: 20, unit: 'px' },
                { label: 'Sepia', key: 'sepia', min: 0, max: 100, unit: '%' },
                { label: 'Grayscale', key: 'grayscale', min: 0, max: 100, unit: '%' },
            ].map(f => (
                <div key={f.key}>
                    <div className="flex justify-between mb-1">
                        <label className="text-[10px] text-textSecondary uppercase font-bold">{f.label}</label>
                        <span className="text-[10px] text-secondary font-mono">{(editorState.filters as any)[f.key]}{f.unit}</span>
                    </div>
                    <input
                        type="range"
                        min={f.min}
                        max={f.max}
                        value={(editorState.filters as any)[f.key]}
                        onChange={(e) => onUpdateFilter(f.key as keyof ImageFilters, Number(e.target.value))}
                        className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-secondary"
                    />
                </div>
            ))}

            <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/20">
                    <div>
                        <h4 className="text-[10px] text-white uppercase font-black tracking-widest">Glitch Supreme</h4>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase">WebGL-Powered Artifacts</p>
                    </div>
                    <button
                        onClick={() => onToggleGlitch(!glitchActive)}
                        className={`w-12 h-6 rounded-full transition-all relative ${glitchActive ? 'bg-primary' : 'bg-zinc-800'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${glitchActive ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
