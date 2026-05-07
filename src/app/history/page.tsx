import { prisma } from "@/lib/prisma";
import { Shield, Clock, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const analyses = await prisma.analysis.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return (
    <main className="min-h-screen py-20 px-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 rounded-2xl glass text-guardian-cyan">
          <Clock className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white">Analysis History</h1>
          <p className="text-muted-foreground">Review your past document scans</p>
        </div>
      </div>

      <div className="grid gap-4">
        {analyses.length === 0 ? (
          <div className="glass-dark p-12 rounded-3xl text-center">
            <Shield className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">No analyses found yet. Start protecting yourself!</p>
            <Link href="/" className="inline-flex items-center gap-2 mt-6 text-guardian-blue hover:underline">
              Analyze your first document <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          analyses.map((analysis: any) => (
            <div
              key={analysis.id}
              className="glass-dark p-6 rounded-3xl border-white/5 hover:bg-white/5 transition-all group flex items-center justify-between"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-white/90">{analysis.title}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="uppercase">{analysis.sourceType}</span>
                  {analysis.privacyScore !== null && (
                    <>
                      <span>•</span>
                      <span className="text-guardian-cyan">Privacy: {analysis.privacyScore}</span>
                    </>
                  )}
                </div>
              </div>
              <Link
                href={`/?id=${analysis.id}`}
                className="p-3 rounded-xl glass group-hover:premium-gradient transition-all text-white/50 group-hover:text-white"
              >
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          ))
        )}
      </div>

      <Link href="/" className="inline-flex items-center gap-2 mt-12 text-muted-foreground hover:text-white transition-colors">
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Analyzer
      </Link>
    </main>
  );
}
