import React, { RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextLayer, Preset, FontDef, EditorState, TextAnimation, ImageFilters } from '../../types';
import { LayerPanel } from './LayerPanel';
import { PresetPanel } from './PresetPanel';
import { TextInspector } from './TextInspector';
import { AnimationInspector } from './AnimationInspector';
import { AdjustInspector } from './AdjustInspector';
import { ImagePanel } from './ImagePanel';
import { AiPanel } from './AiPanel';
import { ProjectsPanel } from './ProjectsPanel';

interface SidebarProps {
    activeTab: 'LAYERS' | 'PRESETS' | 'TEXT' | 'ANIMATE' | 'ADJUST' | 'IMAGE' | 'AI' | 'PROJECTS' | 'GALLERY';
    setActiveTab: (tab: any) => void;
    // Layer Panel Props
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
    onDragStart: (e: React.DragEvent, index: number) => void;
    onDragOver: (e: React.DragEvent, index: number) => void;
    onDragEnd: () => void;
    // Preset Panel Props
    presets: Preset[];
    onApplyPreset: (preset: Preset) => void;
    // Text Inspector Props
    selectedLayer: TextLayer | undefined;
    fontList: FontDef[];
    fontInputRef: RefObject<HTMLInputElement>;
    onUpdateLayer: (key: keyof TextLayer, value: any) => void;
    onUpdateLayerFinal: () => void;
    onHandleFontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSuggestCaption: () => void;
    // Animation Inspector Props
    isPlaying: boolean;
    onTogglePlay: () => void;
    onUpdateAnimation: (key: keyof TextAnimation, value: any) => void;
    // Adjust Inspector Props
    editorState: EditorState;
    onUpdateFilter: (key: keyof ImageFilters, value: number) => void;
    onResetFilters: () => void;
    // Image Tab Props (Inline for now or extracted later)
    fileInputRef: RefObject<HTMLInputElement>;
    maskInputRef: RefObject<HTMLInputElement>;
    onHandleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, isMask: boolean) => void;
    onEnhance: (type: 'CRISP' | 'MASK') => void;
    // AI Tab Props
    promptInput: string;
    setPromptInput: (val: string) => void;
    onAiEdit: () => void;
    loading: boolean;
    // Projects Tab Props (Simple placeholder for now)
    savedProjects: any[];
    onLoadProject: (p: any) => void;
    onSaveProject: () => void;
    onDeleteProject: (id: string, e: React.MouseEvent) => void;
    onReturnToHub: () => void;
    onViewGallery: () => void;
    onMedicate: () => void;
    glitchActive: boolean;
    onToggleGlitch: (active: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
    const { activeTab, setActiveTab } = props;
    // Maintenance logic still runs in background, but terminal is hidden

    return (
        <div className="w-full lg:w-[420px] bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex flex-col h-auto lg:h-[calc(100vh-6rem)] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex-shrink-0 z-20 relative overflow-hidden group">

            {/* Glam Background Effects */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full" />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 overflow-x-auto flex-nowrap scrollbar-hide items-center px-4 bg-white/5 no-scrollbar">
                <button
                    onClick={props.onReturnToHub}
                    className="p-3 text-zinc-500 hover:text-white transition-all hover:scale-110"
                    title="Return to Selection Hub"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                </button>
                <div className="h-6 w-[1px] bg-white/10 flex-shrink-0 mx-2" />
                {['IMAGE', 'LAYERS', 'PRESETS', 'TEXT', 'ADJUST', 'ANIMATE', 'AI', 'PROJECTS', 'GALLERY'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => tab === 'GALLERY' ? props.onViewGallery() : setActiveTab(tab)}
                        className={`relative flex-shrink-0 px-4 py-5 text-[9px] font-black tracking-[0.15em] transition-all ${activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        {tab === 'IMAGE' ? '💎 ASSETS' : tab === 'GALLERY' ? '🏛️ VAULT' : tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-primary via-white to-secondary shadow-[0_0_20px_rgba(34,211,238,1)]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
                <AnimatePresence mode="wait">

                    {activeTab === 'LAYERS' && (
                        <LayerPanel
                            layers={props.layers}
                            selectedLayerId={props.selectedLayerId}
                            checkedLayerIds={props.checkedLayerIds}
                            draggedLayerIndex={props.draggedLayerIndex}
                            onSelectLayer={props.onSelectLayer}
                            onToggleHide={props.onToggleHide}
                            onToggleLock={props.onToggleLock}
                            onDeleteLayer={props.onDeleteLayer}
                            onAddLayer={props.onAddLayer}
                            onToggleCheck={props.onToggleCheck}
                            onCreateGroup={props.onCreateGroup}
                            onUngroup={props.onUngroup}
                            onDragStart={props.onDragStart}
                            onDragOver={props.onDragOver}
                            onDragEnd={props.onDragEnd}
                        />
                    )}

                    {/* Panels requiring a selected layer */}
                    {['PRESETS', 'TEXT', 'ANIMATE'].includes(activeTab) && !props.selectedLayer && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-zinc-300 font-bold uppercase text-xs tracking-widest">No Layer Selected</h4>
                                <p className="text-zinc-500 text-[10px] max-w-[200px] leading-relaxed">Please select a text layer from the canvas or the LAYERS tab to edit properties.</p>
                            </div>
                            <button
                                onClick={props.onAddLayer}
                                className="px-6 py-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase rounded-full hover:bg-primary/20 transition-all"
                            >
                                + Add New Layer
                            </button>
                        </motion.div>
                    )}

                    {activeTab === 'PRESETS' && props.selectedLayer && (
                        <PresetPanel
                            selectedLayer={props.selectedLayer}
                            presets={props.presets}
                            onApplyPreset={props.onApplyPreset}
                        />
                    )}

                    {activeTab === 'TEXT' && props.selectedLayer && (
                        <TextInspector
                            selectedLayer={props.selectedLayer}
                            fontList={props.fontList}
                            fontInputRef={props.fontInputRef}
                            onUpdateLayer={props.onUpdateLayer}
                            onUpdateLayerFinal={props.onUpdateLayerFinal}
                            onHandleFontUpload={props.onHandleFontUpload}
                            onSuggestCaption={props.onSuggestCaption}
                        />
                    )}

                    {activeTab === 'ANIMATE' && props.selectedLayer && (
                        <AnimationInspector
                            selectedLayer={props.selectedLayer}
                            isPlaying={props.isPlaying}
                            onTogglePlay={props.onTogglePlay}
                            onUpdateAnimation={props.onUpdateAnimation}
                            onUpdateLayerFinal={props.onUpdateLayerFinal}
                        />
                    )}

                    {activeTab === 'ADJUST' && (
                        <>
                            <AdjustInspector
                                editorState={props.editorState}
                                glitchActive={props.glitchActive}
                                onToggleGlitch={props.onToggleGlitch}
                                onUpdateFilter={props.onUpdateFilter}
                            />
                            <button
                                onClick={props.onResetFilters}
                                className="w-full py-2 border border-border text-zinc-500 text-[10px] uppercase font-bold hover:bg-white/5 rounded mt-4"
                            >
                                Reset Filters
                            </button>
                        </>
                    )}

                    {/* Image Tab */}
                    {activeTab === 'IMAGE' && (
                        <ImagePanel
                            fileInputRef={props.fileInputRef}
                            maskInputRef={props.maskInputRef}
                            onHandleImageUpload={props.onHandleImageUpload}
                            onEnhance={props.onEnhance}
                        />
                    )}

                    {/* AI Tab */}
                    {activeTab === 'AI' && (
                        <AiPanel
                            loading={props.loading}
                            promptInput={props.promptInput}
                            setPromptInput={props.setPromptInput}
                            onEnhance={props.onEnhance}
                            onAiEdit={props.onAiEdit}
                        />
                    )}

                    {/* PROJECTS Tab */}
                    {activeTab === 'PROJECTS' && (
                        <ProjectsPanel
                            savedProjects={props.savedProjects}
                            onLoadProject={props.onLoadProject}
                            onSaveProject={props.onSaveProject}
                            onDeleteProject={props.onDeleteProject}
                        />
                    )}

                    {/* MRX SUPREME SECTION - DEV ONLY */}
                    {import.meta.env.DEV && (
                        <div className="pt-6 border-t border-white/5">
                            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 relative overflow-hidden group/mrx">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/mrx:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                        </div>
                                        <div className="leading-tight">
                                            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Mr. X Pulse</h5>
                                            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Supreme Guardian Active</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={props.onMedicate}
                                        className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase rounded-full hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95"
                                    >
                                        Apply Medication
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};
