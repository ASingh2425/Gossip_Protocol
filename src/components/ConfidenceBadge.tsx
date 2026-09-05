import React from 'react';
import { ConfidenceLevel } from '@/lib/types';
import { ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

export function ConfidenceBadge({ confidence, minutesAgo }: { confidence: ConfidenceLevel; minutesAgo?: number }) {
  if (confidence === 'HIGH_CONFIDENCE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-800/60">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        HIGH CONFIDENCE
        {minutesAgo !== undefined && (
          <span className="text-[10px] text-emerald-500/80">({minutesAgo}m ago via API)</span>
        )}
      </span>
    );
  }

  if (confidence === 'MEDIUM_CONFIDENCE') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/80 px-2 py-1 text-xs font-medium text-amber-400 border border-amber-800/60">
        <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
        MEDIUM CONFIDENCE
        {minutesAgo !== undefined && (
          <span className="text-[10px] text-amber-500/80">({Math.round(minutesAgo / 60)}h ago partner)</span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-slate-400 border border-slate-700">
      <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
      UNCONFIRMED
    </span>
  );
}
