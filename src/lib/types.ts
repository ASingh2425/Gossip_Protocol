export type FailureCause =
  | 'ACCESS_EXHAUSTION'
  | 'FORGETTING'
  | 'SIDE_EFFECT_AVOIDANCE'
  | 'ROUTINE_DISRUPTION'
  | 'CLINICAL_CONCERN'
  | 'UNKNOWN';

export type ConfidenceLevel = 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';

export type PatternType = 'INTERMITTENT_SLIP' | 'STRUCTURAL_DRIFT' | 'ACUTE_ABANDONMENT';

export type VerificationStatus =
  | 'PENDING'
  | 'INTERVENTION_SENT'
  | 'STOCK_RESERVED'
  | 'MEDICATION_ACQUIRED'
  | 'DOSE_RESTORED'
  | 'VERIFIED_SUCCESS';

export type SubstitutionSafetyStatus =
  | 'SAFE_EQUIVALENT'
  | 'REQUIRES_PHARMACIST_CONSULT'
  | 'CONTRAINDICATED_SUBSTITUTE';

export interface AlternativeMedication {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  priceINR: number;
  activeIngredients: string[];
  excipients: string[]; // Binders, colorings, lactose, preservatives
  safetyStatus?: SubstitutionSafetyStatus;
  safetyScore?: number; // 0 to 100
  interactionWarnings?: string[];
}

export interface DoseEvent {
  id: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string; // ISO string
  status: 'TAKEN' | 'MISSED' | 'PENDING' | 'RECOVERED';
  takenAt?: string;
}

export interface MedicationSupply {
  medicationName: string;
  dosage: string;
  currentStock: number;
  dailyConsumption: number;
  lastRefillDate: string;
  expectedDepletionDate: string;
  deliveryLeadTimeHours: number;
  brandName: string;
  genericName: string;
}

export interface RefillSignal {
  lastRefillDate: string;
  refillOverdueDays: number;
  expectedRunoutDate: string;
}

export interface WearableSignal {
  sleepDisruptionHours: number;
  activityLevelPercentile: number;
  timezoneChanged: boolean;
  restingHeartRateDelta: number;
}

export interface SymptomSignal {
  symptomName: string;
  severity: number; // 1-10
  loggedHoursPostDose: number;
}

export interface PatientSignals {
  doseEvents: DoseEvent[];
  supply: MedicationSupply;
  refill: RefillSignal;
  wearable?: WearableSignal;
  symptoms?: SymptomSignal[];
}

export interface ForensicsAttribution {
  patientId: string;
  patientName: string;
  medicationName: string;
  missedDoseTime: string;
  detectedCause: FailureCause;
  confidenceScore: number; // 0 to 100
  confidenceLevel: ConfidenceLevel;
  patternType: PatternType;
  evidence: string[];
  suggestedAction: 'PHARMACY_RECOVERY' | 'CONTEXTUAL_NUDGE' | 'DOCTOR_ESCALATION';
  adherenceTrend30Days: number[];
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  priceINR: number;
  inStock: boolean;
  stockConfidence: ConfidenceLevel;
  lastVerifiedMinutesAgo: number;
  verificationSource: 'DIRECT_INVENTORY_API' | 'PARTNER_CONFIRMATION' | 'UNVERIFIED_LISTING';
  supportsDelivery: boolean;
  supportsPickup: boolean;
  estimatedFulfillmentTime: string;
  phone: string;
  whatsapp: string;
  isGenericEquivalent?: boolean;
  storeHours: string;
  transitDelayMins: number;
  reservedUntilTimestamp?: string;
  reservedForPatientId?: string;
  availableAlternatives?: AlternativeMedication[];
}

export interface StockReservation {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  patientId: string;
  patientName: string;
  medicationName: string;
  reservedAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'FULFILLED' | 'EXPIRED';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  activeCoMedications: string[]; // Current drugs patient is taking e.g. ["Metformin 500mg", "Atorvastatin 10mg"]
  knownAllergies: string[]; // Known patient allergies e.g. ["Lactose Monohydrate", "Sulfa Drugs"]
  riskStatus: 'RED' | 'ORANGE' | 'GREEN';
  supply: MedicationSupply;
  doses: DoseEvent[];
  signals: PatientSignals;
  activeAttribution?: ForensicsAttribution;
  verificationStatus: VerificationStatus;
  ashaEscalated?: boolean;
  activeReservation?: StockReservation;
  recoveryHistory: {
    timestamp: string;
    action: string;
    result: string;
  }[];
}
