import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-zinc-950 border-t border-white/5 py-12 px-8 mt-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                {/* Brand Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg overflow-hidden">
                            <img src="/assets/kf_logo_v2.jpg" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-tighter text-white">Kalpana<span className="italic">Forge</span></span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                        The elite studio for advanced 3D typography and depth-effect design. Powered by Supreme AI.
                    </p>
                </div>

                {/* Meta & Share Section */}
                <div className="md:col-span-2 space-y-6">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Business Link & Share</h4>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Official Domain</p>
                                <p className="text-xs font-bold text-white tracking-tight">https://kalpanaforge.com</p>
                            </div>
                            <button
                                onClick={() => navigator.clipboard.writeText('https://kalpanaforge.com')}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                                title="Copy Link"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                            </button>
                        </div>

                        <div className="h-[1px] bg-white/5 w-full" />

                        <div className="flex flex-wrap gap-3">
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent('Check out KalpanaForge — Forge Elite 3D Typography Studio! https://kalpanaforge.com')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366]/10 border border-[#25D366]/20 rounded-full hover:bg-[#25D366]/20 transition-all group"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                <span className="text-[9px] font-black text-[#25D366] uppercase tracking-widest">Share to WhatsApp</span>
                            </a>
                            <a
                                href="https://twitter.com/intent/tweet?text=Check out KalpanaForge — Forge Elite 3D Typography Studio!&url=https://kalpanaforge.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>
                                <span className="text-[9px] font-black text-white uppercase tracking-widest ml-1">Tweet</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Status Column */}
                <div className="flex flex-col items-end gap-6 text-right">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Global Status</p>
                        <div className="flex items-center gap-2 justify-end">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Systems Operational</span>
                        </div>
                    </div>
                    <div className="pt-6">
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">© 2026 KalpanaForge</p>
                        <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">Commercial Launch Pipeline v1.0</p>
                    </div>
                </div>
            </div>

            {/* Fine Print */}
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-6 justify-center">
                {['About', 'Features', 'Privacy', 'Terms'].map(link => (
                    <button key={link} className="text-[8px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.4em] transition-colors">
                        {link}
                    </button>
                ))}
            </div>
        </footer>
    );
};
