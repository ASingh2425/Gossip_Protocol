'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Activity, Cpu, RefreshCw, CheckCircle2, ArrowRight, User, Stethoscope, Store, HelpCircle } from 'lucide-react';
import { useVanishingDose } from '@/context/VanishingDoseContext';

export default function Home() {
  const { patients } = useVanishingDose();

  const redCount = patients.filter((p) => p.riskStatus === 'RED').length;
  const orangeCount = patients.filter((p) => p.riskStatus === 'ORANGE').length;
  const greenCount = patients.filter((p) => p.riskStatus === 'GREEN').length;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Pitch Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3.5 py-1 text-xs font-semibold text-cyan-400">
              <Activity className="h-3.5 w-3.5" />
              <span>THE VANISHING DOSE ARCHITECTURE</span>
            </div>

            <h1 className="font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              From Missed Dose to <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Resolved Dose.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Existing medication systems largely stop at reminding, detecting, or predicting non-adherence. <strong className="text-white">Vanishing Dose closes the loop:</strong> it reconstructs why an intended dose failed, selects a cause-specific recovery path—from contextual intervention to medication access—and verifies whether treatment execution was actually restored.
            </p>

            {/* Quote Pitch Box */}
            <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/30 p-4 text-xs sm:text-sm text-cyan-200 italic font-mono">
              &quot;Don&apos;t just detect the vanishing dose. Explain where it vanished, remove the obstacle, and prove that it came back.&quot;
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/doctor"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                <Stethoscope className="h-4 w-4" />
                Launch Doctor Command Center
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/patient"
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 transition-all"
              >
                <User className="h-4 w-4" />
                View Patient Recovery App
              </Link>
            </div>
          </div>
        </div>

        {/* The 3 Core USPs */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">The Three Differentiating USP Layers</h2>
            <p className="text-xs text-slate-400">Built directly on top of the foundational prescription & reminder problem statement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* USP 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-lg hover:border-slate-700 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 font-extrabold text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Execution Forensics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reconstructs why a dose diverged from its intended execution using surrounding temporal evidence graph (refill history, inventory logs, wearable sleep/timezone shifts, and post-dose symptom spikes) <strong className="text-slate-200">without manual patient self-report</strong>.
              </p>
              <div className="rounded-lg bg-slate-950 p-2.5 text-[11px] font-mono text-cyan-300 border border-slate-800">
                Reasoning Output: ACCESS_EXHAUSTION (94% Certainty)
              </div>
            </div>

            {/* USP 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-lg hover:border-slate-700 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-950 border border-amber-800 text-amber-400 font-extrabold text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Failure-Specific Recovery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Routes each detected failure to the appropriate resolution path instead of sending another generic reminder. When access is the cause, launches the <strong className="text-slate-200">Medication Access Network</strong> with availability confidence ratings, pricing, and generic safety checks.
              </p>
              <div className="rounded-lg bg-slate-950 p-2.5 text-[11px] font-mono text-amber-300 border border-slate-800">
                Intervention: Verified Pharmacy Access (4 Candidates)
              </div>
            </div>

            {/* USP 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-lg hover:border-slate-700 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 font-extrabold text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Closed-Loop Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tracks the complete lifecycle: <strong className="text-slate-200">Problem $\rightarrow$ Cause $\rightarrow$ Intervention $\rightarrow$ Outcome</strong>. Verifies whether the recovery action actually restored physical stock and treatment execution.
              </p>
              <div className="rounded-lg bg-slate-950 p-2.5 text-[11px] font-mono text-emerald-300 border border-slate-800">
                Ledger Status: VERIFIED_SUCCESS (+30 Stock Restored)
              </div>
            </div>
          </div>
        </div>

        {/* Live Closed-Loop Architecture Diagram */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Closed-Loop Data Engine & State Flow</h3>
              <p className="text-xs text-slate-400">Live operational state across all active patient cohorts</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> {redCount} Red (Access Failure)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> {orangeCount} Orange (Side-Effect/Routine)
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> {greenCount} Green (Restored/Stable)
              </span>
            </div>
          </div>

          {/* Interactive Flow Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-500">STAGE 1 — DETECT</span>
              <h4 className="font-bold text-sm text-slate-200">Execution Divergence</h4>
              <p className="text-[11px] text-slate-400">8:00 AM Dose Unconfirmed. Reminder timeout.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400">STAGE 2 — EXPLAIN</span>
              <h4 className="font-bold text-sm text-slate-200">Execution Forensics</h4>
              <p className="text-[11px] text-slate-400">Stock estimate = 0. Refill overdue 2 days.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-400">STAGE 3 — RESOLVE</span>
              <h4 className="font-bold text-sm text-slate-200">Access Recovery</h4>
              <p className="text-[11px] text-slate-400">4 Verified Pharmacies surfaced with price/stock.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400">STAGE 4 — VERIFY</span>
              <h4 className="font-bold text-sm text-slate-200">Adherence Restored</h4>
              <p className="text-[11px] text-slate-400">Stock +30. Dose executed & logged.</p>
            </div>
          </div>
        </div>

        {/* Navigation Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/patient"
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400">
                <User className="h-5 w-5" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-base font-bold text-white">Patient App Interface</h4>
            <p className="text-xs text-slate-400">
              Interactive dose tracker, pre-empted depletion alerts, and direct Medication Access Recovery flow.
            </p>
          </Link>

          <Link
            href="/doctor"
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-blue-400">
                <Stethoscope className="h-5 w-5" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-base font-bold text-white">Doctor Command Center</h4>
            <p className="text-xs text-slate-400">
              Patient risk triage (🔴/🟠/🟢), multi-signal forensic timelines, uncertainty metrics, and recovery audits.
            </p>
          </Link>

          <Link
            href="/pharmacy"
            className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400">
                <Store className="h-5 w-5" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="text-base font-bold text-white">Pharmacy Partner Portal</h4>
            <p className="text-xs text-slate-400">
              Live stock verification, price updates, and inventory API integration for high confidence availability.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
