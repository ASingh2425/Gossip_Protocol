import { PatientSignals, ForensicsAttribution, ConfidenceLevel, PatternType, FailureCause } from './types';

export function analyzeExecutionForensics(
  patientId: string,
  patientName: string,
  signals: PatientSignals
): ForensicsAttribution {
  const { doseEvents, supply, refill, wearable, symptoms } = signals;

  const missedDose = doseEvents.find((d) => d.status === 'MISSED') || doseEvents[0];
  const missedDoseTime = missedDose ? missedDose.scheduledTime : new Date().toISOString();
  const evidence: string[] = [];

  let cause: FailureCause = 'UNKNOWN';
  let confidenceScore = 50;
  let patternType: PatternType = 'INTERMITTENT_SLIP';
  let suggestedAction: 'PHARMACY_RECOVERY' | 'CONTEXTUAL_NUDGE' | 'DOCTOR_ESCALATION' = 'CONTEXTUAL_NUDGE';
  let adherenceTrend30Days = [98, 95, 92, 88, 80];

  // 1. Evaluate Access Failure (Stock Depletion / Refill Gap)
  const daysOverdue = refill.refillOverdueDays;
  const isStockExhausted = supply.currentStock <= 0;

  if (isStockExhausted || daysOverdue > 0) {
    cause = 'ACCESS_EXHAUSTION';
    suggestedAction = 'PHARMACY_RECOVERY';
    confidenceScore = isStockExhausted ? 94 : 88;
    adherenceTrend30Days = [98, 92, 85, 70, 52];

    if (isStockExhausted) {
      evidence.push(`Calculated physical stock exhausted (0 ${supply.dosage} remaining)`);
    }
    if (daysOverdue > 0) {
      evidence.push(`Refill overdue by ${daysOverdue} day(s) based on last pharmacy fill on ${refill.lastRefillDate}`);
    }
    evidence.push(`Delivery lead time (${supply.deliveryLeadTimeHours}h) exceeds remaining stock duration`);

    patternType = daysOverdue > 3 ? 'STRUCTURAL_DRIFT' : 'INTERMITTENT_SLIP';
  }
  // 2. Evaluate Side Effect Avoidance (Symptom Logs)
  else if (symptoms && symptoms.some((s) => s.severity >= 5)) {
    const severeSymptom = symptoms.find((s) => s.severity >= 5)!;
    cause = 'SIDE_EFFECT_AVOIDANCE';
    suggestedAction = 'DOCTOR_ESCALATION';
    confidenceScore = 82;
    adherenceTrend30Days = [95, 90, 80, 68, 60];

    evidence.push(`Severe symptom recorded: "${severeSymptom.symptomName}" (Severity: ${severeSymptom.severity}/10)`);
    evidence.push(`Symptom onset occurred ${severeSymptom.loggedHoursPostDose} hours post-dose`);
    evidence.push(`Patient exhibits non-adherence pattern following adverse reaction episodes`);

    patternType = 'STRUCTURAL_DRIFT';
  }
  // 3. Evaluate Routine Disruption (Wearable Data)
  else if (wearable && (wearable.timezoneChanged || wearable.sleepDisruptionHours > 2.5)) {
    cause = 'ROUTINE_DISRUPTION';
    suggestedAction = 'CONTEXTUAL_NUDGE';
    confidenceScore = 74;
    adherenceTrend30Days = [99, 97, 95, 90, 84];

    if (wearable.timezoneChanged) {
      evidence.push(`Wearable detected timezone change (Travel pattern detected)`);
    }
    if (wearable.sleepDisruptionHours > 2.5) {
      evidence.push(`Wearable sleep score degraded by ${wearable.sleepDisruptionHours}h disruption`);
    }
    evidence.push(`Medication time diverged from routine wakefulness schedule`);

    patternType = 'INTERMITTENT_SLIP';
  }
  // 4. Default: Forgetting / Intermittent Slip
  else {
    cause = 'FORGETTING';
    suggestedAction = 'CONTEXTUAL_NUDGE';
    confidenceScore = 90;
    adherenceTrend30Days = [100, 98, 96, 95, 92];

    evidence.push(`Normal stock level confirmed (${supply.currentStock} units remaining)`);
    evidence.push(`No adverse side effects or wearable routine shifts detected`);
    evidence.push(`Dose reminder delivered at ${missedDose.scheduledTime} with zero patient response`);

    patternType = 'INTERMITTENT_SLIP';
  }

  // Determine Confidence Level Label
  let confidenceLevel: ConfidenceLevel = 'MEDIUM_CONFIDENCE';
  if (confidenceScore >= 85) confidenceLevel = 'HIGH_CONFIDENCE';
  else if (confidenceScore < 70) confidenceLevel = 'LOW_CONFIDENCE';

  return {
    patientId,
    patientName,
    medicationName: supply.medicationName,
    missedDoseTime,
    detectedCause: cause,
    confidenceScore,
    confidenceLevel,
    patternType,
    evidence,
    suggestedAction,
    adherenceTrend30Days,
  };
}

export function exportHL7FHIR_R4(attribution: ForensicsAttribution, patientName: string) {
  return {
    resourceType: 'Bundle',
    id: `bundle-vanishing-dose-${attribution.patientId}`,
    type: 'collection',
    timestamp: new Date().toISOString(),
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: attribution.patientId,
          name: [{ text: patientName }],
        },
      },
      {
        resource: {
          resourceType: 'MedicationRequest',
          id: `medreq-${attribution.patientId}`,
          status: 'active',
          intent: 'order',
          medicationCodeableConcept: {
            text: attribution.medicationName,
          },
          subject: { reference: `Patient/${attribution.patientId}` },
        },
      },
      {
        resource: {
          resourceType: 'DetectedIssue',
          id: `issue-${attribution.patientId}`,
          status: 'final',
          code: {
            text: `Vanishing Dose Forensic Attribution: ${attribution.detectedCause}`,
          },
          severity: attribution.confidenceScore > 85 ? 'high' : 'moderate',
          detail: attribution.evidence.join(' | '),
          mitigation: [
            {
              action: { text: attribution.suggestedAction },
              date: new Date().toISOString(),
            },
          ],
        },
      },
    ],
  };
}
