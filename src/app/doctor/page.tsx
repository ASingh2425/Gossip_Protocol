'use client';

import React, { useState } from 'react';
import { useVanishingDose } from '@/context/VanishingDoseContext';
import { ForensicsTimeline } from '@/components/ForensicsTimeline';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { Stethoscope, ShieldAlert, Cpu, AlertTriangle, CheckCircle2, User, ChevronRight, Activity, PieChart, Layers } from 'lucide-react';

export default function DoctorPage() {
  const { patients, selectedPatientId, setSelectedPatientId } = useVanishingDose();
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const redPatients = patients.filter((p) => p.riskStatus === 'RED');
  const orangePatients = patients.filter((p) => p.riskStatus === 'ORANGE');
  const greenPatients = patients.filter((p) => p.riskStatus === 'GREEN');

  // Breakdown metrics
  const accessCount = patients.filter((p) => p.activeAttribution?.detectedCause === 'ACCESS_EXHAUSTION').length;
  const symptomCount = patients.filter((p) => p.activeAttribution?.detectedCause === 'SIDE_EFFECT_AVOIDANCE').length;
  const routineCount = patients.filter((p) => p.activeAttribution?.detectedCause === 'ROUTINE_DISRUPTION').length;
  const forgettingCount = patients.filter((p) => p.activeAttribution?.detectedCause === 'FORGETTING').length;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Clinical Treatment Command Center</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-signal adherence non-intrusive monitoring • Non-judgmental failure attribution • Closed-loop verification audit
            </p>
          </div>

          {/* Quick Panel Summary */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-rose-800/80 bg-rose-950/40 px-3.5 py-2 text-center">
              <span className="text-[10px] uppercase font-semibold text-rose-300 block">Critical Access Risk</span>
              <span className="text-xl font-extrabold font-mono text-rose-400">{redPatients.length}</span>
            </div>
            <div className="rounded-xl border border-amber-800/80 bg-amber-950/40 px-3.5 py-2 text-center">
              <span className="text-[10px] uppercase font-semibold text-amber-300 block">Emerging Disruption</span>
              <span className="text-xl font-extrabold font-mono text-amber-400">{orangePatients.length}</span>
            </div>
            <div className="rounded-xl border border-emerald-800/80 bg-emerald-950/40 px-3.5 py-2 text-center">
              <span className="text-[10px] uppercase font-semibold text-emerald-300 block">Verified Restored</span>
              <span className="text-xl font-extrabold font-mono text-emerald-400">{greenPatients.length}</span>
            </div>
          </div>
        </div>

        {/* Panel Aggregated Failure Breakdown Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="h-4 w-4 text-cyan-400" />
              Failure Cause Distribution Across Active Cohort
            </h3>
            <span className="text-xs text-slate-400">Identified via Execution Forensics Engine</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-xs text-rose-400 font-semibold block">Access Failure / Depletion</span>
              <span className="text-2xl font-bold font-mono text-white">{accessCount}</span>
              <span className="text-[10px] text-slate-500 block">Pharmacies surfaced for recovery</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-xs text-amber-400 font-semibold block">Side-Effect Avoidance</span>
              <span className="text-2xl font-bold font-mono text-white">{symptomCount}</span>
              <span className="text-[10px] text-slate-500 block">Symptom score spikes post-dose</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-xs text-indigo-400 font-semibold block">Routine Disruption</span>
              <span className="text-2xl font-bold font-mono text-white">{routineCount}</span>
              <span className="text-[10px] text-slate-500 block">Wearable travel & sleep shifts</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <span className="text-xs text-cyan-400 font-semibold block">Intermittent Forgetting</span>
              <span className="text-2xl font-bold font-mono text-white">{forgettingCount}</span>
              <span className="text-[10px] text-slate-500 block">Normal stock, reminder nudge sent</span>
            </div>
          </div>
        </div>

        {/* Patient Triage List & Detailed Audit View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Triage List (4 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Patient Triage Board (Select for Forensics Audit)
            </h3>

            <div className="space-y-3">
              {patients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                const cause = p.activeAttribution?.detectedCause;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`group cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500 shadow-lg'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            p.riskStatus === 'RED'
                              ? 'bg-rose-500 animate-pulse shadow-md shadow-rose-500/50'
                              : p.riskStatus === 'ORANGE'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm group-hover:text-cyan-400 transition-colors">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {p.supply.medicationName} • Stock: <span className="font-mono">{p.supply.currentStock}</span>
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`h-5 w-5 transition-transform ${
                          isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                        }`}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] border-t border-slate-800/80 pt-2 text-slate-400">
                      <span>Attributed Cause:</span>
                      <span className="font-semibold text-slate-200">{cause?.replace('_', ' ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Forensics Audit & Signals View (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Forensic Evidence & Uncertainty Audit</h3>
                  <p className="text-xs text-slate-400">
                    Patient: <span className="font-bold text-cyan-400">{selectedPatient.name}</span> ({selectedPatient.condition})
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    selectedPatient.verificationStatus === 'VERIFIED_SUCCESS'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  VERIFICATION: {selectedPatient.verificationStatus}
                </span>
              </div>

              {/* Forensics Component */}
              <ForensicsTimeline patient={selectedPatient} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
