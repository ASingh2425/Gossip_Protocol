'use client';

import React, { useState } from 'react';
import { useVanishingDose } from '@/context/VanishingDoseContext';
import { rankPharmaciesForRecovery, generatePreFilledWhatsAppLink, evaluatePersonalizedAlternativeSafety } from '@/lib/accessRecoveryEngine';
import { ConfidenceBadge } from './ConfidenceBadge';
import { MapPin, Phone, MessageSquare, Truck, ShoppingBag, CheckCircle, AlertTriangle, X, ShieldAlert, Clock, Camera, Lock, Pill, ShieldCheck, ShieldX } from 'lucide-react';
import confetti from 'canvas-confetti';

export function AccessRecoveryModal({
  patientId,
  isOpen,
  onClose,
}: {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { patients, pharmacies, triggerRecoveryAction, reservePharmacyStock } = useVanishingDose();
  const patient = patients.find((p) => p.id === patientId) || patients[0];
  const rankedPharmacies = rankPharmaciesForRecovery(pharmacies);

  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(rankedPharmacies[0]?.id || null);
  const [acquiredConfirmed, setAcquiredConfirmed] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmAcquired = () => {
    setAcquiredConfirmed(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    const ph = pharmacies.find((p) => p.id === selectedPharmacyId);
    const pharmacyInfo = ph ? `${ph.name} (₹${ph.priceINR})` : 'Nearby Verified Pharmacy';

    setTimeout(() => {
      triggerRecoveryAction(
        patientId,
        'VERIFIED_SUCCESS',
        `Medication acquired via ${pharmacyInfo}. Personalized alternative safety check passed. Inventory restored +30 doses. Adherence execution verified.`
      );
      setAcquiredConfirmed(false);
      setShowScanner(false);
      onClose();
    }, 1800);
  };

  const handleReserveStock = () => {
    if (!selectedPharmacyId) return;
    setIsReserving(true);
    reservePharmacyStock(selectedPharmacyId, patientId);
    setTimeout(() => {
      setIsReserving(false);
    }, 1000);
  };

  const selectedPharmacy = pharmacies.find((p) => p.id === selectedPharmacyId) || rankedPharmacies[0];
  const whatsappUrl = selectedPharmacy
    ? generatePreFilledWhatsAppLink(selectedPharmacy, patient.supply.medicationName, patient.supply.brandName)
    : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-950/80 border border-amber-800/80 text-amber-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Medication Access Recovery Loop</h3>
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                  Cause: Access Failure
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prescribed: <span className="font-medium text-slate-200">{patient.supply.medicationName}</span> ({patient.supply.brandName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Patient Personalized Safety Profile Summary */}
        <div className="bg-slate-950 p-3.5 px-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span className="font-bold text-slate-200">Personalized Medical Context:</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>
              Active Co-Meds: <strong className="text-cyan-300">{patient.activeCoMedications.join(', ') || 'None'}</strong>
            </span>
            <span>
              Known Allergies: <strong className="text-rose-300">{patient.knownAllergies.join(', ') || 'None'}</strong>
            </span>
          </div>
        </div>

        {/* Pharmacy List */}
        <div className="max-h-[50vh] overflow-y-auto p-6 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Verified Local Availability & Personalized Substitute Safety ({rankedPharmacies.length} Stores)
          </h4>

          {rankedPharmacies.map((ph) => {
            const isSelected = selectedPharmacyId === ph.id;

            return (
              <div
                key={ph.id}
                onClick={() => setSelectedPharmacyId(ph.id)}
                className={`group cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Column: Name & Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-100 text-sm group-hover:text-cyan-400 transition-colors">
                        {ph.name}
                      </span>
                      <ConfidenceBadge confidence={ph.stockConfidence} minutesAgo={ph.lastVerifiedMinutesAgo} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        {ph.address}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        {ph.storeHours} ({ph.transitDelayMins}m transit)
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Price & Fulfillment badges */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Unit Price</span>
                      <span className="text-base font-extrabold text-emerald-400">₹{ph.priceINR}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {ph.supportsDelivery && (
                        <span className="flex items-center gap-1 rounded-md bg-blue-950 px-2 py-1 text-[11px] font-medium text-blue-300 border border-blue-800">
                          <Truck className="h-3 w-3" /> Delivery
                        </span>
                      )}
                      {ph.supportsPickup && (
                        <span className="flex items-center gap-1 rounded-md bg-purple-950 px-2 py-1 text-[11px] font-medium text-purple-300 border border-purple-800">
                          <ShoppingBag className="h-3 w-3" /> Pickup
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personalized Alternative Brand / Generic Safety Engine Evaluation */}
                {ph.availableAlternatives && ph.availableAlternatives.length > 0 && (
                  <div className="mt-3.5 rounded-lg border border-slate-800 bg-slate-900 p-3 space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Pill className="h-3.5 w-3.5 text-cyan-400" />
                      Alternative Brand/Generic In Stock at this Pharmacy:
                    </span>

                    {ph.availableAlternatives.map((rawAlt) => {
                      const alt = evaluatePersonalizedAlternativeSafety(rawAlt, patient);

                      return (
                        <div
                          key={alt.id}
                          className={`rounded-lg border p-3 text-xs space-y-1.5 transition-all ${
                            alt.safetyStatus === 'CONTRAINDICATED_SUBSTITUTE'
                              ? 'border-rose-800 bg-rose-950/40 text-rose-200'
                              : alt.safetyStatus === 'REQUIRES_PHARMACIST_CONSULT'
                              ? 'border-amber-800 bg-amber-950/40 text-amber-200'
                              : 'border-emerald-800/80 bg-emerald-950/30 text-emerald-200'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-2">
                              {alt.brandName} ({alt.genericName}) — ₹{alt.priceINR}
                              <span className="text-[10px] font-normal text-slate-400">by {alt.manufacturer}</span>
                            </span>

                            {alt.safetyStatus === 'SAFE_EQUIVALENT' && (
                              <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-800 flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3" /> 🟢 SAFE EQUIVALENT ({alt.safetyScore}%)
                              </span>
                            )}
                            {alt.safetyStatus === 'REQUIRES_PHARMACIST_CONSULT' && (
                              <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 border border-amber-800 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> 🟡 CONSULT PHARMACIST ({alt.safetyScore}%)
                              </span>
                            )}
                            {alt.safetyStatus === 'CONTRAINDICATED_SUBSTITUTE' && (
                              <span className="rounded bg-rose-950 px-2 py-0.5 text-[10px] font-extrabold text-rose-400 border border-rose-800 flex items-center gap-1">
                                <ShieldX className="h-3 w-3" /> 🔴 CONTRAINDICATED ({alt.safetyScore}%)
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] leading-relaxed space-y-0.5">
                            <div>
                              <strong className="text-slate-300">Excipients & Formulators:</strong> {alt.excipients.join(', ')}
                            </div>
                            {alt.interactionWarnings && alt.interactionWarnings.map((w, i) => (
                              <div key={i} className="font-medium font-mono text-[10.5px]">
                                • {w}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedPharmacy && (
              <>
                <button
                  onClick={handleReserveStock}
                  disabled={isReserving}
                  className="flex items-center gap-1.5 rounded-lg border border-purple-800 bg-purple-950 px-3 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-900"
                >
                  <Lock className="h-3.5 w-3.5 text-purple-400" />
                  {patient.activeReservation?.pharmacyId === selectedPharmacy.id ? 'Hold Active (30m)' : 'Hold Stock (30m)'}
                </button>

                <a
                  href={`tel:${selectedPharmacy.phone}`}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  Call
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-800 bg-emerald-950 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-900"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  Pre-filled WhatsApp
                </a>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowScanner(!showScanner)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
            >
              <Camera className="h-4 w-4 text-cyan-400" />
              Pill Photo Scan
            </button>

            <button
              onClick={handleConfirmAcquired}
              disabled={acquiredConfirmed}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg transition-all ${
                acquiredConfirmed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-emerald-950/50'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              {acquiredConfirmed ? 'Restoring Adherence Loop...' : 'Medication Obtained → Restore Adherence'}
            </button>
          </div>
        </div>

        {/* Pill Scanner Drawer Simulation */}
        {showScanner && (
          <div className="border-t border-slate-800 bg-slate-900 p-4 text-center space-y-2 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-400">
              <Camera className="h-4 w-4" /> Pill Box Photo Verification Active
            </div>
            <p className="text-[11px] text-slate-400">
              Point camera at prescribed packaging (<span className="text-white">{patient.supply.brandName}</span>) to auto-verify physical acquisition.
            </p>
            <button
              onClick={handleConfirmAcquired}
              className="rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-extrabold text-slate-950 hover:bg-cyan-400"
            >
              Simulate Photo Match (100% Brand Verification)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
