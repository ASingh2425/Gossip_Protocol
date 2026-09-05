'use client';

import React, { useState } from 'react';
import { useVanishingDose } from '@/context/VanishingDoseContext';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { Store, ShieldCheck, RefreshCw, MapPin, Truck, ShoppingBag, Lock, Clock, CheckCircle2 } from 'lucide-react';

export default function PharmacyPage() {
  const { pharmacies, reservations, verifyPharmacyStock } = useVanishingDose();
  const [editingPrice, setEditingPrice] = useState<{ [key: string]: number }>({});
  const [updatedSuccessId, setUpdatedSuccessId] = useState<string | null>(null);

  const handleVerify = (pharmacyId: string) => {
    const customPrice = editingPrice[pharmacyId];
    verifyPharmacyStock(pharmacyId, true, customPrice);
    setUpdatedSuccessId(pharmacyId);
    setTimeout(() => setUpdatedSuccessId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                <Store className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Pharmacy Access Recovery Network</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time inventory verification • Direct API integration • Price & Stock Confidence sync
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Active Partners: <strong className="text-white">{pharmacies.length} Stores Connected</strong></span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="rounded-2xl border border-emerald-800/80 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-5 space-y-2">
          <h3 className="font-bold text-sm text-emerald-400">Inventory Verification Protocol</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            When Vanishing Dose detects a patient medication access failure, it queries this network for verified stock. Stores with <strong className="text-white">HIGH CONFIDENCE</strong> (direct API sync within 30 minutes) are prioritized to ensure patients are never routed to stale inventory.
          </p>
        </div>

        {/* Real-time 30-min Stock Hold Reservation Queue */}
        {reservations.length > 0 && (
          <div className="rounded-2xl border border-purple-800/80 bg-purple-950/20 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                <Lock className="h-4 w-4 text-purple-400" />
                Active 30-Minute Patient Stock Reservation Locks ({reservations.length})
              </h3>
              <span className="text-xs text-purple-400 font-mono">Live Hold Queue</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservations.map((res) => (
                <div key={res.id} className="rounded-xl border border-purple-800/60 bg-slate-900 p-4 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-200 font-bold">
                    <span>{res.pharmacyName}</span>
                    <span className="text-emerald-400 font-mono">HOLD ACTIVE</span>
                  </div>
                  <p className="text-slate-400">
                    Patient: <strong className="text-white">{res.patientName}</strong> • Item: <strong className="text-cyan-400">{res.medicationName}</strong>
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                    <span>Reserved at: {res.reservedAt}</span>
                    <span>Expires at: <strong className="text-purple-400">{res.expiresAt}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pharmacy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pharmacies.map((ph) => {
            const isJustUpdated = updatedSuccessId === ph.id;

            return (
              <div
                key={ph.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-white">{ph.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {ph.address}
                    </p>
                    <span className="text-[11px] text-cyan-400 flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {ph.storeHours} • {ph.transitDelayMins}m transit
                    </span>
                  </div>
                  <ConfidenceBadge confidence={ph.stockConfidence} minutesAgo={ph.lastVerifiedMinutesAgo} />
                </div>

                <div className="grid grid-cols-2 gap-3 border-y border-slate-800 py-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Unit Price (₹)</span>
                    <input
                      type="number"
                      value={editingPrice[ph.id] !== undefined ? editingPrice[ph.id] : ph.priceINR}
                      onChange={(e) =>
                        setEditingPrice({ ...editingPrice, [ph.id]: parseFloat(e.target.value) || 0 })
                      }
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 font-mono font-bold text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <span className="text-slate-400 block">Fulfillment Options</span>
                    <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                      {ph.supportsDelivery && (
                        <span className="flex items-center gap-1 rounded bg-blue-950 px-1.5 py-0.5 text-[10px] font-medium text-blue-300 border border-blue-800">
                          <Truck className="h-3 w-3" /> Delivery
                        </span>
                      )}
                      {ph.supportsPickup && (
                        <span className="flex items-center gap-1 rounded bg-purple-950 px-1.5 py-0.5 text-[10px] font-medium text-purple-300 border border-purple-800">
                          <ShoppingBag className="h-3 w-3" /> Pickup
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Source: {ph.verificationSource.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => handleVerify(ph.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      isJustUpdated
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 hover:text-white'
                    }`}
                  >
                    {isJustUpdated ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Live Inventory Verified!
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" /> Confirm Live Stock & Sync API
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
