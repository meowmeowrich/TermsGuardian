"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Search, AlertTriangle, History, X } from "lucide-react";
import AnalysisInput from "@/components/AnalysisInput";
import Dashboard from "@/components/Dashboard";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState("");

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      loadAnalysis(id);
    }
  }, [searchParams]);

  const loadAnalysis = async (id: string) => {
    setLoading(true);
    setLoadingStep("Loading past analysis...");
    try {
      const res = await axios.get(`/api/analysis/${id}`);
      setAnalysisData(res.data);
    } catch (err: any) {
      setError("Could not load history item.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleAnalyze = async ({ mode, input, file }: any) => {
    setLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      setLoadingStep("Extracting document content...");
      let content = "";
      let title = "Document Analysis";
      let sourceUrl = mode === 'url' ? input : null;

      if (mode === 'url') {
        const res = await axios.post('/api/extract', { url: input });
        content = res.data.content;
      } else if (mode === 'text') {
        content = input;
      } else if (mode === 'file') {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('/api/extract', formData);
        content = res.data.content;
        title = file.name;
      }

      setLoadingStep("Analyzing with Guardian AI...");
      const aiRes = await axios.post('/api/analyze', {
        content,
        title,
        sourceType: mode,
        sourceUrl
      });

      setAnalysisData(aiRes.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
    router.push('/');
  };

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="absolute top-8 right-8 z-20">
        <Link href="/history">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-white/70 hover:text-white"
          >
            <History className="w-4 h-4" />
            History
          </motion.button>
        </Link>
      </nav>

      <AnimatePresence mode="wait">
        {!analysisData && !loading && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center py-20"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="w-4 h-4 text-guardian-cyan" />
                <span className="text-xs font-medium tracking-wider uppercase text-guardian-cyan">
                  Your Legal Safeguard
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-gradient leading-tight">
                Terms <span className="text-guardian-blue">Guardian</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Uncover hidden risks, dangerous clauses, and data traps before you click "Agree".
                Aggressive AI analysis for the modern consumer.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="w-full max-w-3xl"
            >
              <AnalysisInput onAnalyze={handleAnalyze} />
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 glass-dark border-guardian-crimson/50 p-4 rounded-2xl flex items-center justify-between"
                >
                  <p className="text-guardian-crimson text-sm font-medium">
                    {error}
                  </p>
                  <X className="w-4 h-4 text-guardian-crimson cursor-pointer" onClick={() => setError(null)} />
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
            >
              <FeatureCard
                icon={<AlertTriangle className="w-5 h-5 text-guardian-crimson" />}
                title="Risk Detection"
                description="Identifies predatory clauses and liability shifting in seconds."
              />
              <FeatureCard
                icon={<Lock className="w-5 h-5 text-guardian-cyan" />}
                title="Privacy First"
                description="Exposes hidden data harvesting and third-party sharing."
              />
              <FeatureCard
                icon={<Search className="w-5 h-5 text-guardian-purple" />}
                title="Deep Analysis"
                description="Goes beyond summary to explain 'what they really mean'."
              />
            </motion.div>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-t-2 border-guardian-blue animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-8 h-8 text-guardian-cyan animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Analyzing Document</h2>
              <p className="text-muted-foreground animate-pulse">{loadingStep}</p>
            </div>
          </motion.div>
        )}

        {analysisData && !loading && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full"
          >
            <Dashboard data={analysisData} onReset={resetAnalysis} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-guardian-blue/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-guardian-purple/10 blur-[120px]" />
      </div>

      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-guardian-blue" />}>
        <HomeContent />
      </Suspense>

      <footer className="py-8 text-center text-muted-foreground/30 text-xs z-10">
        <p>&copy; 2024 Terms Guardian. Powered by Advanced AI Analysis.</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-dark p-6 rounded-2xl flex flex-col items-center text-center gap-4 transition-colors hover:bg-white/5 group"
    >
      <div className="p-3 rounded-xl glass group-hover:premium-gradient transition-all duration-500">
        {icon}
      </div>
      <h3 className="font-semibold text-white/90">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="w-8 h-8 rounded-full border-t-2 border-guardian-blue animate-spin" />
    </div>
  );
}
