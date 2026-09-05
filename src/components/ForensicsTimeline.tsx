'use client';

import React, { useState } from 'react';
import { ForensicsAttribution, Patient } from '@/lib/types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { exportHL7FHIR_R4 } from '@/lib/forensicsEngine';
import { useVanishingDose } from '@/context/VanishingDoseContext';
import { AlertCircle, Clock, ShieldAlert, Cpu, Activity, ArrowRight, CheckCircle2, FileJson, TrendingUp, UserCheck, Edit3, X } from 'lucide-react';

export function ForensicsTimeline({ patient }: { patient: Patient }) {
  const { triggerAshaEscalation, modifyRegimen } = useVanishingDose();
  const attribution: ForensicsAttribution | undefined = patient.activeAttribution;

  const [showFhir, setShowFhir] = useState(false);
  const [showRegimenModal, setShowRegimenModal] = useState(false);
  const [newDosageInput, setNewDosageInput] = useState(patient.supply.dosage);

  if (!attribution) {
    return <div className="text-slate-400 text-sm">No forensic analysis active.</div>;
  }

  const fhirJson = exportHL7FHIR_R4(attribution, patient.name);

  const causeColorMap = {
    ACCESS_EXHAUSTION: 'border-rose-800 bg-rose-950/40 text-rose-300',
    SIDE_EFFECT_AVOIDANCE: 'border-amber-800 bg-amber-950/40 text-amber-300',
    ROUTINE_DISRUPTION: 'border-indigo-800 bg-indigo-950/40 text-indigo-300',
    FORGETTING: 'border-cyan-800 bg-cyan-950/40 text-cyan-300',
    CLINICAL_CONCERN: 'border-purple-800 bg-purple-950/40 text-purple-300',
    UNKNOWN: 'border-slate-800 bg-slate-900 text-slate-400',
  };

  const handleModifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    modifyRegimen(patient.id, newDosageInput);
    setShowRegimenModal(false);
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
      {/* Header & Attribution */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-base">Execution Forensics Reasoning Output</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Temporal evidence graph analysis without manual patient self-report
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-lg border px-3 py-1 text-xs font-bold ${
              causeColorMap[attribution.detectedCause]
            }`}
          >
            {attribution.detectedCause.replace('_', ' ')}
          </span>
          <ConfidenceBadge confidence={attribution.confidenceLevel} />
        </div>
      </div>

      {/* Uncertainty & 30-Day Trajectory Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Uncertainty Bar */}
        <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <span>Reasoning Confidence</span>
            <span className="font-mono text-cyan-400 font-bold">{attribution.confidenceScore}% Certainty</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${attribution.confidenceScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Pattern: <strong className="text-slate-200">{attribution.patternType.replace('_', ' ')}</strong>
          </p>
        </div>

        {/* 30-Day Trajectory Trend */}
        <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <TrendingUp className="h-3.5 w-3.5" /> 30-Day Adherence Drift Trajectory
            </span>
            <span className="font-mono text-xs text-slate-400">
              {attribution.adherenceTrend30Days[attribution.adherenceTrend30Days.length - 1]}% Current
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-6 pt-1">
            {attribution.adherenceTrend30Days.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t ${
                    val >= 80 ? 'bg-emerald-500' : val >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ height: `${val * 0.24}px` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asha Worker & Caregiver Escalation Status */}
      <div className="flex items-center justify-between rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-purple-400" />
          <span>
            Community Asha Worker Escalation:{' '}
            <strong className={patient.ashaEscalated ? 'text-purple-400 font-bold' : 'text-slate-400 font-medium'}>
              {patient.ashaEscalated ? 'ALERT DISPATCHED' : 'Standby'}
            </strong>
          </span>
        </div>
        {!patient.ashaEscalated && (
          <button
            onClick={() => triggerAshaEscalation(patient.id)}
            className="rounded bg-purple-950 px-2.5 py-1 text-[11px] font-bold text-purple-300 border border-purple-800 hover:bg-purple-900"
          >
            Dispatch Asha Fallback Alert
          </button>
        )}
      </div>

      {/* Evidence Chain */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Temporal Evidence Chain (Why the dose vanished)
        </h4>
        <div className="space-y-2">
          {attribution.evidence.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 text-xs text-slate-300"
            >
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-cyan-400">
                {idx + 1}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Actions Toolbar: Modify Regimen & FHIR Export */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4 flex-wrap gap-2">
        <button
          onClick={() => setShowRegimenModal(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
        >
          <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
          Modify Dosage / Regimen
        </button>

        <button
          onClick={() => setShowFhir(!showFhir)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
        >
          <FileJson className="h-3.5 w-3.5 text-emerald-400" />
          {showFhir ? 'Hide FHIR R4 JSON' : 'Export HL7 FHIR R4 JSON'}
        </button>
      </div>

      {/* FHIR JSON Export Box */}
      {showFhir && (
        <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span>HL7 FHIR R4 Compliant Bundle Resource</span>
            <span className="text-[10px] text-emerald-400">Standard Spec Export</span>
          </div>
          <pre className="max-h-48 overflow-y-auto rounded bg-slate-900 p-3 text-[11px] text-slate-300">
            {JSON.stringify(fhirJson, null, 2)}
          </pre>
        </div>
      )}

      {/* Regimen Modification Modal */}
      {showRegimenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-white text-sm">Clinician Regimen Modification</h4>
              <button onClick={() => setShowRegimenModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleModifySubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Medication Name</label>
                <input
                  disabled
                  value={patient.supply.medicationName}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">New Dosage Instructions</label>
                <input
                  value={newDosageInput}
                  onChange={(e) => setNewDosageInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                Apply Clinical Regimen Change
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
