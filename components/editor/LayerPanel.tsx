import React from 'react';
import { motion } from 'framer-motion';
import { TextLayer } from '../../types';

interface LayerPanelProps {
    layers: TextLayer[];
    selectedLayerId: string | null;
    checkedLayerIds: Set<string>;
    draggedLayerIndex: number | null;
    onSelectLayer: (id: string) => void;
    onToggleHide: (id: string) => void;
    onToggleLock: (id: string) => void;
    onDeleteLayer: (id: string) => void;
    onAddLayer: () => void;
    onToggleCheck: (id: string) => void;
    onCreateGroup: () => void;
    onUngroup: () => void;
    // Drag and Drop Handlers
    onDragStart: (e: any, index: number) => void;
    onDragOver: (e: any, index: number) => void;
    onDragEnd: () => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
    layers,
    selectedLayerId,
    checkedLayerIds,
    draggedLayerIndex,
    onSelectLayer,
    onToggleHide,
    onToggleLock,
    onDeleteLayer,
    onAddLayer,
    onToggleCheck,
    onCreateGroup,
    onUngroup,
    onDragStart,
    onDragOver,
    onDragEnd
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4"
            key="layers"
        >
            <div className="flex gap-2 mb-4">
                <motion.button whileTap={{ scale: 0.95 }} onClick={onAddLayer} className="flex-1 py-2 bg-primary text-white font-bold text-xs uppercase rounded hover:brightness-110">+ Add Layer</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={onCreateGroup} disabled={checkedLayerIds.size < 2} className="flex-1 py-2 bg-surfaceHighlight border border-border text-textPrimary font-bold text-xs uppercase rounded hover:bg-black/5 disabled:opacity-50">Group Selected</motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={onUngroup} disabled={checkedLayerIds.size === 0} className="px-3 py-2 bg-surfaceHighlight border border-border text-textPrimary font-bold text-xs uppercase rounded hover:bg-black/5 disabled:opacity-50">Ungroup</motion.button>
            </div>

            <ul className="space-y-2">
                {[...layers].reverse().map((layer, reverseIndex) => {
                    const originalIndex = layers.length - 1 - reverseIndex;
                    const isSelected = selectedLayerId === layer.id;

                    return (
                        <motion.li
                            layout
                            key={layer.id}
                            draggable={!layer.locked}
                            onDragStart={(e) => onDragStart(e, originalIndex)}
                            onDragOver={(e) => onDragOver(e, originalIndex)}
                            onDragEnd={onDragEnd}
                            className={`
                    flex items-center gap-2 p-3 rounded border transition-all group
                    ${isSelected ? 'bg-surfaceHighlight border-primary' : 'bg-background border-border hover:border-textSecondary'}
                    ${draggedLayerIndex === originalIndex ? 'opacity-50' : 'opacity-100'}
                `}
                        >
                            <input
                                type="checkbox"
                                checked={checkedLayerIds.has(layer.id)}
                                onChange={() => onToggleCheck(layer.id)}
                                className="accent-primary"
                            />

                            <div className="cursor-grab text-textSecondary hover:text-textPrimary">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                            </div>

                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelectLayer(layer.id)}>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold truncate ${layer.hidden ? 'text-textSecondary line-through' : 'text-textPrimary'}`}>
                                        {layer.name || layer.text}
                                    </span>
                                    {layer.groupId && (
                                        <span className="px-1.5 py-0.5 rounded bg-surfaceHighlight text-[8px] text-textSecondary font-mono">GRP</span>
                                    )}
                                </div>
                                <p className="text-[9px] text-textSecondary truncate">{layer.fontFamily} • {layer.zIndex === 0 ? 'Behind' : 'Front'}</p>
                            </div>

                            <button onClick={() => onToggleHide(layer.id)} className="text-textSecondary hover:text-textPrimary p-1" title={layer.hidden ? "Show" : "Hide"}>
                                {layer.hidden ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>

                            <button onClick={() => onToggleLock(layer.id)} className={`${layer.locked ? 'text-red-500' : 'text-textSecondary hover:text-textPrimary'} p-1`} title={layer.locked ? "Unlock" : "Lock"}>
                                {layer.locked ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                                )}
                            </button>

                            <button onClick={() => onDeleteLayer(layer.id)} className="text-textSecondary hover:text-red-500 p-1" title="Delete">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </motion.li>
                    );
                })}
            </ul>
            <p className="text-[9px] text-textSecondary text-center pt-2">Drag items to reorder rendering stack.</p>
        </motion.div>
    );
};
