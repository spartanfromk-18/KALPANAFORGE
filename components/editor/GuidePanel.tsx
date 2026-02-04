import React from 'react';
import { motion } from 'framer-motion';

export const GuidePanel: React.FC = () => {
    const sections = [
        {
            title: "✨ Pop-Out Book Magic",
            desc: "Put your words behind any subject! Go to the LAYERS tab and drag your text layer below the 'Main Subject' to make it pop.",
            icon: "📖"
        },
        {
            title: "📏 Resize & Spin",
            desc: "Click your text! Pull the blue circles at the corners to grow it, or use the top handle to spin it around.",
            icon: "🔄"
        },
        {
            title: "🔍 Fast Zoom & Move",
            desc: "Hold CTRL and use your Mouse Wheel to zoom in close. Click and hold the Middle Mouse Button to move the canvas around.",
            icon: "🖱️"
        },
        {
            title: "🪄 Magic Clarity",
            desc: "Use the 'Magic Clear' button in the ASSETS tab to fix blurry photos and make them look crisp and professional.",
            icon: "🌟"
        },
        {
            title: "🎨 2,500+ Fancy Fonts",
            desc: "Browse the TEXT tab to find the perfect style. We have shiny chrome, retro vibes, and super clean letters.",
            icon: "🅰️"
        }
    ];

    return (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-all group"
                    >
                        <div className="text-3xl mb-3 group-hover:scale-125 transition-transform origin-left">{item.icon}</div>
                        <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight">{item.title}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-medium">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl">
                <h4 className="text-primary font-black uppercase text-xs tracking-widest mb-3">Keyboard Shortcuts</h4>
                <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                    <div className="flex justify-between border-b border-primary/5 pb-1">
                        <span className="text-zinc-500 uppercase">Undo</span>
                        <span className="text-primary">CTRL + Z</span>
                    </div>
                    <div className="flex justify-between border-b border-primary/5 pb-1">
                        <span className="text-zinc-500 uppercase">Redo</span>
                        <span className="text-primary">CTRL + SHIFT + Z</span>
                    </div>
                    <div className="flex justify-between border-b border-primary/5 pb-1">
                        <span className="text-zinc-500 uppercase">Zoom</span>
                        <span className="text-primary">CTRL + WHEEL</span>
                    </div>
                    <div className="flex justify-between border-b border-primary/5 pb-1">
                        <span className="text-zinc-500 uppercase">Pan</span>
                        <span className="text-primary">MID-MOUSE</span>
                    </div>
                    <div className="flex justify-between border-b border-primary/5 pb-1">
                        <span className="text-zinc-500 uppercase">Delete</span>
                        <span className="text-primary">DEL</span>
                    </div>
                    <div className="flex justify-between border-b border-primary/5 pb-1">
                        <span className="text-zinc-500 uppercase">Help</span>
                        <span className="text-primary">H / F1</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
