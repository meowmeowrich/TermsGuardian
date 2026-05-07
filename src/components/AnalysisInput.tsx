"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Upload, FileText, Loader2, Search, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisInputProps {
  onAnalyze: (data: { mode: "url" | "text" | "file"; input: string; file: File | null }) => void;
}

export default function AnalysisInput({ onAnalyze }: AnalysisInputProps) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"url" | "text" | "file">("url");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "file" && !file) return;
    if (mode !== "file" && !input.trim()) return;

    onAnalyze({ mode, input, file });
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
      setMode("file");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMode("file");
    }
  };

  return (
    <div className="relative group w-full">
      {/* Animated Glowing Border */}
      <div className="absolute -inset-0.5 premium-gradient rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>

      <div
        className={`relative glass-dark p-2 rounded-3xl transition-all duration-500 ${isDragging ? "ring-2 ring-guardian-blue bg-white/10" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setMode("url"); setFile(null); }}
              className={`rounded-xl transition-all ${mode === "url" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"}`}
            >
              <Link2 className="w-4 h-4 mr-2" />
              URL
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setMode("text"); setFile(null); }}
              className={`rounded-xl transition-all ${mode === "text" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"}`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Paste Text
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl transition-all ${mode === "file" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"}`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx,.txt"
            />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2 px-2 pb-2">
            <div className="relative flex-1 w-full min-h-[60px] flex items-center">
              {mode === "file" && file ? (
                <div className="flex items-center gap-3 px-4 w-full">
                  <div className="p-2 rounded-lg bg-guardian-blue/20 text-guardian-cyan">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => { setFile(null); setMode("url"); }}
                    className="hover:bg-white/10 text-muted-foreground hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : mode === "text" ? (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste document content here..."
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-muted-foreground/30 py-4 px-4 text-lg outline-none resize-none min-h-[120px]"
                />
              ) : (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste legal document URL..."
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-muted-foreground/30 py-4 px-4 text-lg outline-none"
                />
              )}

              <AnimatePresence>
                {!input && !file && !isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 pointer-events-none text-muted-foreground/20"
                  >
                    <span className="text-xs font-medium tracking-widest uppercase">Drop file anywhere</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              disabled={mode === "file" ? !file : !input.trim()}
              className={`w-full md:w-auto h-14 px-8 rounded-2xl premium-gradient text-white font-bold hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-guardian-blue/20 ${mode === 'text' ? 'md:self-end' : ''}`}
            >
              <Search className="w-5 h-5 mr-2" />
              Analyze
            </Button>
          </form>
        </div>
      </div>

      {/* Dynamic Motion Indicator */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-guardian-blue/20 backdrop-blur-md border-2 border-dashed border-guardian-cyan rounded-3xl px-8 py-4 flex items-center gap-3">
              <Upload className="w-6 h-6 text-guardian-cyan animate-bounce" />
              <span className="text-guardian-cyan font-bold">Release to Upload</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex justify-center gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-[0.2em]"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-guardian-cyan animate-pulse" />
          <span>Secured by SSL</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-[0.2em]"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-guardian-purple animate-pulse" />
          <span>Real-time extraction</span>
        </motion.div>
      </div>
    </div>
  );
}
