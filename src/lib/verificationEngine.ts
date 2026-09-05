import { Patient, VerificationStatus } from './types';

export function advanceVerificationState(
  patient: Patient,
  nextStatus: VerificationStatus,
  actionDetails: string
): Patient {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const updatedHistory = [
    {
      timestamp,
      action: actionDetails,
      result: `Status transitioned to: ${nextStatus}`,
    },
    ...patient.recoveryHistory,
  ];

  let updatedDoses = [...patient.doses];
  let updatedSupply = { ...patient.supply };

  // If medication acquired, update supply and mark missed dose as RECOVERED
  if (nextStatus === 'MEDICATION_ACQUIRED' || nextStatus === 'VERIFIED_SUCCESS') {
    updatedSupply.currentStock = Math.max(updatedSupply.currentStock + 30, 30);
    updatedDoses = updatedDoses.map((d) =>
      d.status === 'MISSED' ? { ...d, status: 'RECOVERED', takenAt: timestamp } : d
    );
  }

  // Update risk status based on new state
  let newRiskStatus = patient.riskStatus;
  if (nextStatus === 'VERIFIED_SUCCESS' || nextStatus === 'MEDICATION_ACQUIRED') {
    newRiskStatus = 'GREEN';
  }

  return {
    ...patient,
    riskStatus: newRiskStatus,
    verificationStatus: nextStatus,
    supply: updatedSupply,
    doses: updatedDoses,
    recoveryHistory: updatedHistory,
  };
}
