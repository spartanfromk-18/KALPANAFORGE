import React from 'react';
import { motion } from 'framer-motion';
import { TextLayer, Preset } from '../../types';

interface PresetPanelProps {
    selectedLayer: TextLayer | undefined;
    presets: Preset[];
    onApplyPreset: (preset: Preset) => void;
}

export const PresetPanel: React.FC<PresetPanelProps> = ({
    selectedLayer,
    presets,
    onApplyPreset
}) => {
    if (!selectedLayer) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="presets" className="grid grid-cols-2 gap-3">
            {presets.map(preset => (
                <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onApplyPreset(preset)}
                    className="group relative h-24 rounded-lg border border-border overflow-hidden hover:border-textPrimary transition-all"
                >
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: '#111' }}
                    >
                        <span
                            className="text-2xl font-black"
                            style={{
                                color: preset.styles.color || '#fff',
                                textShadow: preset.styles.shadowBlur ? `0 0 ${preset.styles.shadowBlur}px ${preset.styles.shadowColor}` : 'none',
                                WebkitTextStroke: preset.styles.strokeWidth ? `${preset.styles.strokeWidth}px ${preset.styles.strokeColor}` : 'none'
                            }}
                        >
                            Abc
                        </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-1 text-center">
                        <span className="text-[10px] uppercase font-bold text-white">{preset.name}</span>
                    </div>
                </motion.button>
            ))}
        </motion.div>
    );
};
