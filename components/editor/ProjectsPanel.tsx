import React from 'react';
import { motion } from 'framer-motion';

interface ProjectsPanelProps {
    savedProjects: any[];
    onLoadProject: (p: any) => void;
    onSaveProject: () => void;
    onDeleteProject: (id: string, e: React.MouseEvent) => void;
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({
    savedProjects,
    onLoadProject,
    onSaveProject,
    onDeleteProject
}) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="projects" className="space-y-4">
            <button onClick={onSaveProject} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase rounded mb-4">
                Save New Project
            </button>

            <div className="space-y-2">
                {savedProjects.length === 0 && <p className="text-textSecondary text-xs text-center py-4">No saved projects yet.</p>}
                {savedProjects.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-2 bg-surfaceHighlight rounded border border-border group">
                        <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden">
                            {/* Thumbnail placeholder */}
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[8px]">{p.layers.length}L</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-textPrimary text-xs font-bold truncate">{p.name}</h4>
                            <p className="text-[9px] text-textSecondary">{new Date(p.lastModified).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => onLoadProject(p)} className="text-primary hover:text-white p-1 text-[10px] font-bold">LOAD</button>
                        <button onClick={(e) => onDeleteProject(p.id, e)} className="text-gray-600 hover:text-red-500 p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
