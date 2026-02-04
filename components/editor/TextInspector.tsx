import React, { RefObject } from 'react';
import { motion } from 'framer-motion';
import { TextLayer, FontDef } from '../../types';

interface TextInspectorProps {
    selectedLayer: TextLayer | undefined;
    fontList: FontDef[];
    fontInputRef: RefObject<HTMLInputElement>;
    onUpdateLayer: (key: keyof TextLayer, value: any) => void;
    onUpdateLayerFinal: () => void;
    onHandleFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSuggestCaption: () => void;
}

export const TextInspector: React.FC<TextInspectorProps> = ({
    selectedLayer,
    fontList,
    fontInputRef,
    onUpdateLayer,
    onUpdateLayerFinal,
    onHandleFontUpload,
    onSuggestCaption
}) => {
    if (!selectedLayer) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="text">
            <div className="space-y-2">
                <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest">Layer Name</label>
                <input
                    type="text"
                    value={selectedLayer.name}
                    onChange={(e) => onUpdateLayer('name', e.target.value)}
                    className="w-full bg-surfaceHighlight border border-border rounded p-2 text-textPrimary text-xs focus:border-primary outline-none mb-2"
                />
                <div className="flex justify-between items-end">
                    <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest">Content</label>
                    <button
                        onClick={onSuggestCaption}
                        className="text-[9px] bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-2 py-0.5 rounded-full font-bold uppercase transition-transform active:scale-95 flex items-center gap-1"
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                        Magic Caption
                    </button>
                </div>
                <input
                    type="text"
                    value={selectedLayer.text}
                    onChange={(e) => onUpdateLayer('text', e.target.value)}
                    onBlur={onUpdateLayerFinal}
                    className="w-full bg-surfaceHighlight border border-border rounded p-3 text-textPrimary focus:border-primary outline-none font-bold"
                />
            </div>

            <div className="space-y-2 mt-4">
                <div className="flex justify-between items-end">
                    <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest">Typography</label>
                    <input
                        type="file"
                        ref={fontInputRef}
                        className="hidden"
                        accept=".ttf,.otf,.woff"
                        onChange={onHandleFontUpload}
                    />
                    <button
                        onClick={() => fontInputRef.current?.click()}
                        className="text-[10px] text-primary hover:underline uppercase font-bold flex items-center gap-1"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        Upload Font
                    </button>
                </div>
                <div className="h-40 overflow-y-auto border border-border rounded bg-surfaceHighlight custom-scrollbar">
                    {fontList.map((f, idx) => (
                        <button
                            key={`${f.name}-${idx}`}
                            onClick={() => { onUpdateLayer('fontFamily', f.family); onUpdateLayerFinal(); }}
                            className={`w-full text-left px-4 py-3 text-lg hover:bg-black/5 flex justify-between items-center ${selectedLayer.fontFamily === f.family ? 'text-primary' : 'text-textSecondary'}`}
                            style={{ fontFamily: f.family }}
                        >
                            {f.name}
                            {f.category === 'Custom' && <span className="text-[8px] px-1 bg-surface rounded text-textSecondary ml-2 font-sans">USER</span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2 p-3 bg-surfaceHighlight rounded border border-border mt-4">
                <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest flex items-center gap-2">
                    Depth Layering
                    <span className="text-primary text-[10px]">(Req. Mask)</span>
                </label>
                <div className="flex bg-surface p-1 rounded border border-border">
                    <button
                        onClick={() => { onUpdateLayer('zIndex', 0); onUpdateLayerFinal(); }}
                        className={`flex-1 py-2 text-[10px] font-bold rounded transition-colors ${selectedLayer.zIndex === 0 ? 'bg-primary text-white' : 'text-textSecondary hover:text-textPrimary'}`}
                    >
                        BEHIND SUBJECT
                    </button>
                    <button
                        onClick={() => { onUpdateLayer('zIndex', 1); onUpdateLayerFinal(); }}
                        className={`flex-1 py-2 text-[10px] font-bold rounded transition-colors ${selectedLayer.zIndex === 1 ? 'bg-primary text-white' : 'text-textSecondary hover:text-textPrimary'}`}
                    >
                        IN FRONT
                    </button>
                </div>
            </div>

            {/* Fill Type Selection */}
            <div className="space-y-2 mt-4">
                <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest">Fill Style</label>
                <div className="flex bg-surface p-1 rounded border border-border">
                    <button
                        onClick={() => { onUpdateLayer('fillType', 'SOLID'); onUpdateLayerFinal(); }}
                        className={`flex-1 py-2 text-[10px] font-bold rounded transition-colors ${selectedLayer.fillType !== 'GRADIENT' ? 'bg-background text-textPrimary' : 'text-textSecondary hover:text-textPrimary'}`}
                    >
                        Solid
                    </button>
                    <button
                        onClick={() => { onUpdateLayer('fillType', 'GRADIENT'); onUpdateLayerFinal(); }}
                        className={`flex-1 py-2 text-[10px] font-bold rounded transition-colors ${selectedLayer.fillType === 'GRADIENT' ? 'bg-background text-textPrimary' : 'text-textSecondary hover:text-textPrimary'}`}
                    >
                        Gradient
                    </button>
                </div>
            </div>

            {/* Color / Gradient Controls */}
            <div className="space-y-4 p-3 border border-border rounded bg-surfaceHighlight/30 mt-2">
                {selectedLayer.fillType === 'GRADIENT' ? (
                    <>
                        <div className="flex gap-2 mb-2">
                            <select
                                value={selectedLayer.gradientType || 'LINEAR'}
                                onChange={(e) => { onUpdateLayer('gradientType', e.target.value); onUpdateLayerFinal(); }}
                                className="flex-1 bg-surfaceHighlight border border-border rounded text-xs p-1 text-textPrimary"
                            >
                                <option value="LINEAR">Linear</option>
                                <option value="RADIAL">Radial</option>
                            </select>
                            {(!selectedLayer.gradientType || selectedLayer.gradientType === 'LINEAR') && (
                                <input
                                    type="number"
                                    value={selectedLayer.gradientAngle || 0}
                                    onChange={(e) => onUpdateLayer('gradientAngle', Number(e.target.value))}
                                    className="w-16 bg-surfaceHighlight border border-border rounded text-xs p-1 text-center text-textPrimary"
                                    placeholder="Angle"
                                    title="Gradient Angle"
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[9px] text-textSecondary uppercase">
                                <span>Stops</span>
                                <button className="text-primary hover:underline" onClick={() => {
                                    const newStops = [...(selectedLayer.gradientStops || []), { offset: 1, color: '#ffffff' }];
                                    onUpdateLayer('gradientStops', newStops);
                                }}>+ Add Stop</button>
                            </div>
                            {(selectedLayer.gradientStops || [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#000000' }]).map((stop, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input type="color" value={stop.color} onChange={(e) => {
                                        const newStops = [...(selectedLayer.gradientStops || [])];
                                        newStops[idx].color = e.target.value;
                                        onUpdateLayer('gradientStops', newStops);
                                    }} className="w-6 h-6 border-none bg-transparent cursor-pointer" />
                                    <input type="range" min="0" max="1" step="0.01" value={stop.offset} onChange={(e) => {
                                        const newStops = [...(selectedLayer.gradientStops || [])];
                                        newStops[idx].offset = Number(e.target.value);
                                        onUpdateLayer('gradientStops', newStops);
                                    }} className="flex-1 h-1 bg-border rounded-lg appearance-none cursor-pointer" />
                                    <button onClick={() => {
                                        const newStops = (selectedLayer.gradientStops || []).filter((_, i) => i !== idx);
                                        onUpdateLayer('gradientStops', newStops);
                                    }} className="text-textSecondary hover:text-red-500">×</button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="space-y-2">
                        <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest">Color</label>
                        <div className="flex items-center gap-2">
                            <input type="color" value={selectedLayer.color} onChange={(e) => onUpdateLayer('color', e.target.value)} onBlur={onUpdateLayerFinal} className="w-8 h-8 bg-transparent cursor-pointer border-none p-0 rounded overflow-hidden" />
                            <span className="text-xs font-mono text-textSecondary">{selectedLayer.color}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="space-y-2">
                    <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest">Blend Mode</label>
                    <select
                        value={selectedLayer.blendMode}
                        onChange={(e) => { onUpdateLayer('blendMode', e.target.value); onUpdateLayerFinal(); }}
                        className="w-full bg-surfaceHighlight border border-border rounded p-2 text-xs text-textPrimary outline-none"
                    >
                        <option value="source-over">Normal</option>
                        <option value="multiply">Multiply</option>
                        <option value="screen">Screen</option>
                        <option value="overlay">Overlay</option>
                        <option value="darken">Darken</option>
                        <option value="lighten">Lighten</option>
                        <option value="color-dodge">Color Dodge</option>
                        <option value="color-burn">Color Burn</option>
                        <option value="hard-light">Hard Light</option>
                        <option value="soft-light">Soft Light</option>
                        <option value="difference">Difference</option>
                        <option value="exclusion">Exclusion</option>
                        <option value="hue">Hue</option>
                        <option value="saturation">Saturation</option>
                        <option value="color">Color</option>
                        <option value="luminosity">Luminosity</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border mt-4">
                {[
                    { label: 'Size', key: 'fontSize', min: 10, max: 600, step: 1 },
                    { label: 'Letter Spacing', key: 'letterSpacing', min: -20, max: 100, step: 1 },
                    { label: 'Rotation', key: 'rotation', min: -180, max: 180, step: 1 },
                    { label: 'Opacity', key: 'opacity', min: 0, max: 1, step: 0.01 },
                    { label: 'Outline Width', key: 'strokeWidth', min: 0, max: 20, step: 0.5 },
                    { label: 'Shadow Blur', key: 'shadowBlur', min: 0, max: 100, step: 1 },
                ].map((control) => (
                    <div key={control.key}>
                        <div className="flex justify-between mb-1">
                            <label className="text-[10px] text-textSecondary uppercase font-bold">{control.label}</label>
                            <span className="text-[10px] text-primary font-mono">{String((selectedLayer as any)[control.key])}</span>
                        </div>
                        <input
                            type="range"
                            min={control.min}
                            max={control.max}
                            step={control.step}
                            value={(selectedLayer as any)[control.key]}
                            onChange={(e) => onUpdateLayer(control.key as keyof TextLayer, Number(e.target.value))}
                            onMouseUp={onUpdateLayerFinal}
                            className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primaryDark"
                        />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
