'use client';

import React, { createContext, useContext, useState } from 'react';
import { Patient, Pharmacy, VerificationStatus, StockReservation } from '@/lib/types';
import { INITIAL_PATIENTS } from '@/lib/mockData';
import { MOCK_PHARMACIES } from '@/lib/accessRecoveryEngine';
import { advanceVerificationState } from '@/lib/verificationEngine';

interface VanishingDoseContextType {
  patients: Patient[];
  pharmacies: Pharmacy[];
  reservations: StockReservation[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  triggerRecoveryAction: (patientId: string, nextStatus: VerificationStatus, details: string) => void;
  verifyPharmacyStock: (pharmacyId: string, inStock: boolean, priceINR?: number) => void;
  reservePharmacyStock: (pharmacyId: string, patientId: string) => void;
  triggerAshaEscalation: (patientId: string) => void;
  modifyRegimen: (patientId: string, newDosage: string) => void;
}

const VanishingDoseContext = createContext<VanishingDoseContextType | undefined>(undefined);

export function VanishingDoseProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(MOCK_PHARMACIES);
  const [reservations, setReservations] = useState<StockReservation[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-101');

  const triggerRecoveryAction = (patientId: string, nextStatus: VerificationStatus, details: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? advanceVerificationState(p, nextStatus, details) : p))
    );
  };

  const verifyPharmacyStock = (pharmacyId: string, inStock: boolean, priceINR?: number) => {
    setPharmacies((prev) =>
      prev.map((ph) => {
        if (ph.id === pharmacyId) {
          return {
            ...ph,
            inStock,
            priceINR: priceINR || ph.priceINR,
            stockConfidence: 'HIGH_CONFIDENCE',
            lastVerifiedMinutesAgo: 0,
            verificationSource: 'DIRECT_INVENTORY_API',
          };
        }
        return ph;
      })
    );
  };

  const reservePharmacyStock = (pharmacyId: string, patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    const pharmacy = pharmacies.find((p) => p.id === pharmacyId);

    if (!patient || !pharmacy) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60000); // 30 minutes

    const newReservation: StockReservation = {
      id: `res-${Date.now()}`,
      pharmacyId,
      pharmacyName: pharmacy.name,
      patientId,
      patientName: patient.name,
      medicationName: patient.supply.medicationName,
      reservedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresAt: expiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACTIVE',
    };

    setReservations((prev) => [newReservation, ...prev]);

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            verificationStatus: 'STOCK_RESERVED',
            activeReservation: newReservation,
            recoveryHistory: [
              {
                timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action: `30-Min Stock Reservation Hold Created`,
                result: `Reserved 1 pack of ${p.supply.medicationName} at ${pharmacy.name} (Expires in 30 mins)`,
              },
              ...p.recoveryHistory,
            ],
          };
        }
        return p;
      })
    );
  };

  const triggerAshaEscalation = (patientId: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            ashaEscalated: true,
            recoveryHistory: [
              {
                timestamp: now,
                action: 'Community Asha Worker & Caregiver Escalation Dispatched',
                result: 'Automated fallback SMS alert sent to regional community health worker',
              },
              ...p.recoveryHistory,
            ],
          };
        }
        return p;
      })
    );
  };

  const modifyRegimen = (patientId: string, newDosage: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            supply: { ...p.supply, dosage: newDosage },
            recoveryHistory: [
              {
                timestamp: now,
                action: 'Clinician Regimen Modification Applied',
                result: `Adjusted dosage instructions to: "${newDosage}"`,
              },
              ...p.recoveryHistory,
            ],
          };
        }
        return p;
      })
    );
  };

  return (
    <VanishingDoseContext.Provider
      value={{
        patients,
        pharmacies,
        reservations,
        selectedPatientId,
        setSelectedPatientId,
        triggerRecoveryAction,
        verifyPharmacyStock,
        reservePharmacyStock,
        triggerAshaEscalation,
        modifyRegimen,
      }}
    >
      {children}
    </VanishingDoseContext.Provider>
  );
}

export function useVanishingDose() {
  const context = useContext(VanishingDoseContext);
  if (!context) {
    throw new Error('useVanishingDose must be used within a VanishingDoseProvider');
  }
  return context;
}
