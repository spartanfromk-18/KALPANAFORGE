import React, { RefObject } from 'react';
import { motion } from 'framer-motion';

interface ImagePanelProps {
    fileInputRef: RefObject<HTMLInputElement>;
    maskInputRef: RefObject<HTMLInputElement>;
    onHandleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, isMask: boolean) => void;
    onEnhance: (type: 'CRISP' | 'MASK') => void;
}

export const ImagePanel: React.FC<ImagePanelProps> = ({
    fileInputRef,
    maskInputRef,
    onHandleImageUpload,
    onEnhance
}) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="image">
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest mb-2 block">Background Image</label>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => onHandleImageUpload(e, false)} accept="image/*" />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 border border-dashed border-border text-textSecondary hover:border-primary hover:text-primary transition-all rounded bg-surfaceHighlight/50 text-xs font-bold uppercase"
                    >
                        Upload Background
                    </button>
                </div>

                <div>
                    <label className="text-[10px] text-textSecondary uppercase font-black tracking-widest mb-2 block flex justify-between">
                        <span>Subject Mask</span>
                        <span className="text-primary cursor-pointer hover:underline" onClick={() => onEnhance('MASK')}>Auto-Generate (AI)</span>
                    </label>
                    <input type="file" ref={maskInputRef} className="hidden" onChange={(e) => onHandleImageUpload(e, true)} accept="image/*" />
                    <button
                        onClick={() => maskInputRef.current?.click()}
                        className="w-full py-4 border border-dashed border-border text-textSecondary hover:border-secondary hover:text-secondary transition-all rounded bg-surfaceHighlight/50 text-xs font-bold uppercase"
                    >
                        Upload Mask / Depth Map
                    </button>
                </div>

                <div className="bg-blue-900/20 border border-blue-900/50 p-3 rounded">
                    <p className="text-[10px] text-blue-200 leading-relaxed">
                        <strong>Pro Tip:</strong> Upload a black/white depth map as the mask for 3D occlusion effects. White = Front, Black = Back.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
