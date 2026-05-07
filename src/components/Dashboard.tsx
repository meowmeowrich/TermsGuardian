"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Info,
  ChevronDown,
  ChevronUp,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Finding {
  category: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  consequence: string;
  recommendation: string;
}

interface AnalysisData {
  title: string;
  summary: string;
  scores: {
    privacy: number;
    danger: number;
    friendliness: number;
  };
  findings: Finding[];
  verdict: string;
  redFlags: string[];
  bestClauses: string[];
}

export default function Dashboard({ data, onReset }: { data: AnalysisData, onReset: () => void }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto py-12 px-4 print:py-0 print:px-0"
    >
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h2 className="text-3xl font-bold text-gradient">{data.title}</h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="glass hover:bg-white/10 rounded-xl">
            <Printer className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={onReset} className="glass hover:bg-white/10 rounded-xl">
            Analyze New
          </Button>
        </div>
      </div>

      <div className="hidden print:block mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold mb-2">Terms Guardian Analysis Report</h1>
        <h2 className="text-xl text-gray-600">{data.title}</h2>
        <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <ScoreCard
          label="Privacy"
          score={data.scores.privacy}
          color="text-guardian-cyan"
          gradient="from-guardian-cyan/20 to-transparent"
        />
        <ScoreCard
          label="Danger"
          score={data.scores.danger}
          reverse
          color="text-guardian-crimson"
          gradient="from-guardian-crimson/20 to-transparent"
        />
        <ScoreCard
          label="Friendly"
          score={data.scores.friendliness}
          color="text-guardian-gold"
          gradient="from-guardian-gold/20 to-transparent"
        />
        <div className="glass-dark p-6 rounded-3xl flex flex-col justify-center border-guardian-purple/30 print:bg-gray-100 print:text-black">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 print:text-gray-600">Overall Verdict</p>
          <p className="text-sm font-semibold text-white leading-relaxed print:text-black">{data.verdict}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Findings */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 print:text-black">
            <AlertTriangle className="w-5 h-5 text-guardian-gold" />
            Key Findings
          </h3>
          {data.findings.map((finding, i) => (
            <FindingCard key={i} finding={finding} index={i} />
          ))}
        </div>

        {/* Sidebar: Red Flags & Good Points */}
        <div className="space-y-8">
          <section className="glass-dark p-6 rounded-3xl border-guardian-crimson/20 print:bg-red-50 print:border-red-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-guardian-crimson">
              <XCircle className="w-5 h-5" />
              Critical Red Flags
            </h3>
            <ul className="space-y-3">
              {data.redFlags.map((flag, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/80 print:text-black">
                  <span className="text-guardian-crimson mt-1">•</span>
                  {flag}
                </li>
              ))}
            </ul>
          </section>

          {data.bestClauses.length > 0 && (
            <section className="glass-dark p-6 rounded-3xl border-guardian-cyan/20 print:bg-blue-50 print:border-blue-200">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-guardian-cyan">
                <CheckCircle2 className="w-5 h-5" />
                Silver Linings
              </h3>
              <ul className="space-y-3">
                {data.bestClauses.map((clause, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/80 print:text-black">
                    <span className="text-guardian-cyan mt-1">•</span>
                    {clause}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="glass-dark p-6 rounded-3xl border-white/5 print:bg-gray-50">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white/60 print:text-gray-700">
              <Info className="w-5 h-5" />
              Aggressive Summary
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic print:text-gray-800">
              "{data.summary}"
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function ScoreCard({ label, score, color, gradient, reverse = false }: {
  label: string,
  score: number,
  color: string,
  gradient: string,
  reverse?: boolean
}) {
  const isBad = reverse ? score > 60 : score < 40;
  const isGood = reverse ? score < 30 : score > 70;

  return (
    <div className={`glass-dark p-6 rounded-3xl border-white/5 relative overflow-hidden group print:bg-white print:border print:text-black`}>
      <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 print:hidden`} />
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 relative z-10 print:text-gray-500">{label}</p>
      <div className="flex items-end gap-2 relative z-10">
        <span className={`text-4xl font-bold ${color} print:text-black`}>{score}</span>
        <span className="text-sm text-muted-foreground mb-1">/100</span>
      </div>
      <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10 print:bg-gray-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${isBad ? 'bg-guardian-crimson' : isGood ? 'bg-guardian-cyan' : 'bg-guardian-gold'}`}
        />
      </div>
    </div>
  );
}

function FindingCard({ finding, index }: { finding: Finding, index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);

  const severityColors = {
    high: 'text-guardian-crimson border-guardian-crimson/30 bg-guardian-crimson/5 print:text-red-700 print:border-red-200 print:bg-red-50',
    medium: 'text-guardian-gold border-guardian-gold/30 bg-guardian-gold/5 print:text-yellow-700 print:border-yellow-200 print:bg-yellow-50',
    low: 'text-guardian-cyan border-guardian-cyan/30 bg-guardian-cyan/5 print:text-blue-700 print:border-blue-200 print:bg-blue-50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-dark rounded-3xl border-white/5 overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-white/10' : ''} print:ring-0 print:border print:mb-4`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors print:p-2"
      >
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${severityColors[finding.severity]}`}>
            {finding.severity}
          </div>
          <h4 className="font-semibold text-white/90 print:text-black">{finding.title}</h4>
        </div>
        <div className="print:hidden">
          {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </div>
      </button>

      <div className={`${isOpen ? 'block' : 'hidden print:block'}`}>
        <div className="p-6 pt-0 space-y-4 print:p-2">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 print:bg-transparent print:border-0 print:p-0">
            <p className="text-sm text-muted-foreground leading-relaxed print:text-gray-700">
              {finding.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-guardian-crimson flex items-center gap-2">
                <ShieldAlert className="w-3 h-3" />
                Real-World Consequence
              </p>
              <p className="text-sm text-white/80 leading-relaxed print:text-black">
                {finding.consequence}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-guardian-cyan flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                Guardian Recommendation
              </p>
              <p className="text-sm text-white/80 leading-relaxed print:text-black">
                {finding.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
