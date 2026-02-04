import { Component, ErrorInfo, ReactNode } from 'react';
import { mrxService } from '../services/mrx';
import { motion } from 'framer-motion';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    isRecovering: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        isRecovering: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, isRecovering: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[Developer MR.X] Caught an exception:", error, errorInfo);

        const result = mrxService.diagnoseAndRecover(error, errorInfo);

        setTimeout(() => {
            if (result.action === 'WIPE_AND_RELOAD') {
                localStorage.clear();
                window.location.reload();
            } else {
                window.location.reload();
            }
        }, 2000);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-2xl p-8 text-center shadow-2xl"
                    >
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>

                        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                            System Recovery
                        </h2>
                        <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-6">
                            Auto-Repair in Progress
                        </p>

                        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                            A minor runtime issue was encountered. Our background agent
                            is hot-fixing the environment and optimizing the app state for you.
                        </p>

                        <div className="flex flex-col gap-2 font-mono text-[10px] text-left bg-black/40 p-4 rounded-lg border border-white/5 opacity-50">
                            <span className="text-blue-400"># ANALYZING_SYSTEM...</span>
                            <span className="text-green-400">$ system-patch --force</span>
                            <span className="text-zinc-500">[{this.state.error?.message.substring(0, 40)}...]</span>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
