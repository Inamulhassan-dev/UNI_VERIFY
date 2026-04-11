'use client';

import { useState, useCallback } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isLoading?: boolean;
}

export default function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files[0];
        const validExts = ['.pdf', '.docx', '.doc', '.txt', '.pptx'];
        if (file) {
            const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (validExts.includes(ext)) {
                setSelectedFile(file);
                onFileSelect(file);
            }
        }
    }, [onFileSelect]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    return (
        <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group relative overflow-hidden ${dragOver
                ? 'border-indigo-500 bg-indigo-500/10 scale-102 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                : selectedFile
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'
                } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-[40px] -z-10 group-hover:bg-indigo-600/20 transition-all duration-500"></div>

            <input
                type="file"
                id="file-input"
                accept=".pdf,.docx,.doc,.txt,.pptx"
                onChange={handleFileChange}
                className="hidden"
            />

            {isLoading ? (
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-indigo-400 font-medium animate-pulse">Analyzing content...</p>
                </div>
            ) : selectedFile ? (
                <div className="flex flex-col items-center gap-4 py-2 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center box-shadow-neon-indigo">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold text-lg">{selectedFile.name}</p>
                        <p className="text-sm text-zinc-500 font-mono mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <p className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-3 py-1 rounded-full">Click or drag to replace</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 py-2 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-500/20 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <svg className="w-8 h-8 text-zinc-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-white font-semibold text-lg mb-1">Drag & Drop your document</p>
                        <p className="text-sm text-zinc-400">or <span className="text-indigo-400 font-bold underline decoration-indigo-500/30 underline-offset-4 group-hover:text-indigo-300">browse</span> from computer</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                        {['PDF', 'DOCX', 'TXT'].map(ext => (
                            <span key={ext} className="text-[10px] uppercase font-bold text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md">
                                {ext}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
