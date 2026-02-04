import React from 'react';
import { motion } from 'framer-motion';

interface AiPanelProps {
    loading: boolean;
    promptInput: string;
    setPromptInput: (val: string) => void;
    onEnhance: (type: 'CRISP' | 'MASK') => void;
    onAiEdit: () => void;
}

export const AiPanel: React.FC<AiPanelProps> = ({
    loading,
    promptInput,
    setPromptInput,
    onEnhance,
    onAiEdit
}) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="ai" className="space-y-4">
            <div>
                <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest mb-2 block">Refine Image</label>
                <button
                    onClick={() => onEnhance('CRISP')}
                    disabled={loading}
                    className="w-full py-3 bg-secondary hover:bg-orange-600 text-white font-bold text-xs uppercase rounded disabled:opacity-50"
                >
                    Magic Upscale & Fix
                </button>
            </div>

            <div className="pt-4 border-t border-border">
                <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest mb-2 block">Creative Edit</label>
                <textarea
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Describe how to change the image..."
                    className="w-full bg-surfaceHighlight border border-border rounded p-3 text-xs text-textPrimary h-24 resize-none mb-2 focus:border-primary outline-none"
                />
                <button
                    onClick={onAiEdit}
                    disabled={loading || !promptInput}
                    className="w-full py-3 bg-primary hover:bg-primaryDark text-white font-bold text-xs uppercase rounded disabled:opacity-50"
                >
                    Apply Magic Edit
                </button>
            </div>
        </motion.div>
    );
};
