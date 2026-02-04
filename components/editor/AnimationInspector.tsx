import React from 'react';
import { motion } from 'framer-motion';
import { TextLayer, TextAnimation } from '../../types';

interface AnimationInspectorProps {
    selectedLayer: TextLayer | undefined;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onUpdateAnimation: (key: keyof TextAnimation, value: any) => void;
    onUpdateLayerFinal: () => void;
}

export const AnimationInspector: React.FC<AnimationInspectorProps> = ({
    selectedLayer,
    isPlaying,
    onTogglePlay,
    onUpdateAnimation,
    onUpdateLayerFinal
}) => {
    if (!selectedLayer) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="animate" className="space-y-6">
            <div className="p-3 bg-surfaceHighlight/30 border border-border rounded mb-4 flex items-center justify-between">
                <div>
                    <h4 className="text-[10px] text-textSecondary uppercase font-black tracking-widest mb-1">Live Preview</h4>
                    <p className="text-[9px] text-textSecondary">Press Play in canvas to see effects.</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onTogglePlay}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase ${isPlaying ? 'bg-red-500 text-white' : 'bg-primary text-background'}`}
                >
                    {isPlaying ? 'Stop' : 'Play'}
                </motion.button>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest">Effect Type</label>
                <div className="grid grid-cols-2 gap-2">
                    {['NONE', 'FADE_IN', 'SLIDE_UP', 'BOUNCE', 'TYPEWRITER', 'PULSE'].map(type => (
                        <button
                            key={type}
                            onClick={() => { onUpdateAnimation('type', type as any); onUpdateLayerFinal(); }}
                            className={`py-3 text-[10px] font-bold border rounded transition-all ${selectedLayer.animation.type === type ? 'bg-primary text-background border-primary' : 'border-border text-textSecondary hover:bg-surfaceHighlight'}`}
                        >
                            {type.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {selectedLayer.animation.type !== 'NONE' && (
                <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-[10px] text-textSecondary uppercase font-bold">Duration</label>
                            <span className="text-[10px] text-secondary font-mono">{selectedLayer.animation.duration}ms</span>
                        </div>
                        <input
                            type="range"
                            min={200}
                            max={5000}
                            step={100}
                            value={selectedLayer.animation.duration}
                            onChange={(e) => onUpdateAnimation('duration', Number(e.target.value))}
                            onMouseUp={onUpdateLayerFinal}
                            className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-secondary"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-[10px] text-textSecondary uppercase font-bold">Start Delay</label>
                            <span className="text-[10px] text-secondary font-mono">{selectedLayer.animation.delay}ms</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={3000}
                            step={100}
                            value={selectedLayer.animation.delay}
                            onChange={(e) => onUpdateAnimation('delay', Number(e.target.value))}
                            onMouseUp={onUpdateLayerFinal}
                            className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-secondary"
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-surfaceHighlight rounded border border-border">
                        <span className="text-[10px] text-textSecondary uppercase font-bold">Loop Animation</span>
                        <button
                            onClick={() => { onUpdateAnimation('loop', !selectedLayer.animation.loop); onUpdateLayerFinal(); }}
                            className={`w-8 h-4 rounded-full relative transition-colors ${selectedLayer.animation.loop ? 'bg-primary' : 'bg-gray-700'}`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${selectedLayer.animation.loop ? 'translate-x-4' : ''}`} />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
