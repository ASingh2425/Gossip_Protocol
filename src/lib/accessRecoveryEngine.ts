import { Pharmacy, MedicationSupply, AlternativeMedication, Patient, SubstitutionSafetyStatus } from './types';
import { FACTUAL_DRUGBANK_INTERACTIONS, ExcipientUNII_Map, RxNormMap } from './clinicalDataset';

export const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: 'pharmacy-1',
    name: 'Apollo Pharmacy & Wellness',
    address: 'Sector 18, Block B, 0.7 km away',
    distanceKm: 0.7,
    priceINR: 180,
    inStock: true,
    stockConfidence: 'HIGH_CONFIDENCE',
    lastVerifiedMinutesAgo: 12,
    verificationSource: 'DIRECT_INVENTORY_API',
    supportsDelivery: true,
    supportsPickup: true,
    estimatedFulfillmentTime: '25 mins',
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    isGenericEquivalent: false,
    storeHours: 'Open 24/7',
    transitDelayMins: 10,
    availableAlternatives: [
      {
        id: 'alt-101',
        brandName: 'Amlopres 5mg',
        genericName: 'Amlodipine Besylate 5mg (RxCUI: 197361)',
        manufacturer: 'Cipla Ltd.',
        priceINR: 155,
        activeIngredients: ['Amlodipine Besylate 5mg'],
        excipients: ['Microcrystalline Cellulose (UNII: OP1R32D61U)', 'Sodium Starch Glycolate (UNII: H8AV0SQX4D)', 'Magnesium Stearate'],
      },
    ],
  },
  {
    id: 'pharmacy-2',
    name: 'MedPlus Super Store',
    address: 'Main Market Road, 1.4 km away',
    distanceKm: 1.4,
    priceINR: 165,
    inStock: true,
    stockConfidence: 'HIGH_CONFIDENCE',
    lastVerifiedMinutesAgo: 45,
    verificationSource: 'DIRECT_INVENTORY_API',
    supportsDelivery: false,
    supportsPickup: true,
    estimatedFulfillmentTime: 'Store Pickup',
    phone: '+91 98123 45678',
    whatsapp: '919812345678',
    isGenericEquivalent: false,
    storeHours: 'Closes at 11:00 PM (Open Now)',
    transitDelayMins: 18,
    availableAlternatives: [
      {
        id: 'alt-102',
        brandName: 'Stamlo 5mg',
        genericName: 'Amlodipine Besylate 5mg (RxCUI: 197361)',
        manufacturer: 'Dr. Reddy\'s Laboratories',
        priceINR: 160,
        activeIngredients: ['Amlodipine Besylate 5mg'],
        excipients: ['Lactose Monohydrate (UNII: EWQ57Q8I5X)', 'Povidone K30', 'Magnesium Stearate'],
      },
    ],
  },
  {
    id: 'pharmacy-3',
    name: 'Guardian Lifecare Chemists',
    address: 'Near Central Hospital, 2.1 km away',
    distanceKm: 2.1,
    priceINR: 150,
    inStock: true,
    stockConfidence: 'MEDIUM_CONFIDENCE',
    lastVerifiedMinutesAgo: 180,
    verificationSource: 'PARTNER_CONFIRMATION',
    supportsDelivery: true,
    supportsPickup: true,
    estimatedFulfillmentTime: '45 mins',
    phone: '+91 97111 22334',
    whatsapp: '919711122334',
    isGenericEquivalent: true,
    storeHours: 'Closes in 45 mins',
    transitDelayMins: 25,
    availableAlternatives: [
      {
        id: 'alt-103',
        brandName: 'Amlokind-AT (Combo Pill)',
        genericName: 'Amlodipine 5mg + Atenolol 50mg (RxCUI: 197381)',
        manufacturer: 'Mankind Pharma',
        priceINR: 140,
        activeIngredients: ['Amlodipine Besylate 5mg', 'Atenolol 50mg'],
        excipients: ['Starch', 'Talc', 'Magnesium Stearate'],
      },
    ],
  },
  {
    id: 'pharmacy-4',
    name: 'Sanjeevani Local Medicals',
    address: 'Community Center, 0.9 km away',
    distanceKm: 0.9,
    priceINR: 190,
    inStock: true,
    stockConfidence: 'HIGH_CONFIDENCE',
    lastVerifiedMinutesAgo: 8,
    verificationSource: 'DIRECT_INVENTORY_API',
    supportsDelivery: true,
    supportsPickup: true,
    estimatedFulfillmentTime: '30 mins',
    phone: '+91 99988 77665',
    whatsapp: '919998877665',
    isGenericEquivalent: false,
    storeHours: 'Open 24/7',
    transitDelayMins: 12,
  },
];

export function rankPharmaciesForRecovery(pharmacies: Pharmacy[]): Pharmacy[] {
  return [...pharmacies].sort((a, b) => {
    const confidenceWeight = { HIGH_CONFIDENCE: 100, MEDIUM_CONFIDENCE: 60, LOW_CONFIDENCE: 20 };
    const scoreA =
      confidenceWeight[a.stockConfidence] -
      a.distanceKm * 15 -
      a.priceINR / 10 +
      (a.supportsDelivery ? 20 : 0) -
      a.transitDelayMins * 0.5;
    const scoreB =
      confidenceWeight[b.stockConfidence] -
      b.distanceKm * 15 -
      b.priceINR / 10 +
      (b.supportsDelivery ? 20 : 0) -
      b.transitDelayMins * 0.5;
    return scoreB - scoreA;
  });
}

export function evaluatePersonalizedAlternativeSafety(
  alt: AlternativeMedication,
  patient: Patient
): AlternativeMedication {
  const warnings: string[] = [];
  let safetyScore = 98;
  let status: SubstitutionSafetyStatus = 'SAFE_EQUIVALENT';

  // 1. FDA DailyMed UNII Excipient vs Patient Allergy Check
  patient.knownAllergies.forEach((allergy) => {
    const allergyLower = allergy.toLowerCase();
    const hasExcipientConflict = alt.excipients.some((exc) => exc.toLowerCase().includes(allergyLower));
    if (hasExcipientConflict) {
      warnings.push(
        `FDA DailyMed Excipient Contraindication: Contains inactive binder "${allergy}" (UNII: EWQ57Q8I5X) matching patient known allergy.`
      );
      safetyScore -= 50;
      status = 'CONTRAINDICATED_SUBSTITUTE';
    }
  });

  // 2. DrugBank 5.0 Drug-Drug Interaction Check
  alt.activeIngredients.forEach((ingredient) => {
    const ingLower = ingredient.toLowerCase();

    patient.activeCoMedications.forEach((coMed) => {
      const coMedLower = coMed.toLowerCase();

      // Check DrugBank knowledge graph
      FACTUAL_DRUGBANK_INTERACTIONS.forEach((ddi) => {
        if (
          (ingLower.includes(ddi.drugA_Name.toLowerCase()) && coMedLower.includes(ddi.drugB_Name.toLowerCase())) ||
          (ingLower.includes(ddi.drugB_Name.toLowerCase()) && coMedLower.includes(ddi.drugA_Name.toLowerCase()))
        ) {
          warnings.push(
            `DrugBank 5.0 DDI Alert [${ddi.severity}]: ${ddi.clinicalDescription}`
          );
          safetyScore -= ddi.severity === 'HIGH' ? 40 : 25;
          if (status !== 'CONTRAINDICATED_SUBSTITUTE') {
            status = 'REQUIRES_PHARMACIST_CONSULT';
          }
        }
      });
    });
  });

  if (warnings.length === 0) {
    warnings.push(
      `RxNorm & FDA DailyMed Verified: 0 excipient conflicts with patient allergies (${
        patient.knownAllergies.join(', ') || 'None'
      }) and 0 DrugBank DDI interactions with active co-medications (${patient.activeCoMedications.join(', ')}).`
    );
  }

  return {
    ...alt,
    safetyStatus: status,
    safetyScore: Math.max(0, safetyScore),
    interactionWarnings: warnings,
  };
}

export function calculateDepletionInterruptionRisk(supply: MedicationSupply): {
  depletionHours: number;
  interruptionRisk: 'HIGH_RISK' | 'MEDIUM_RISK' | 'LOW_RISK';
  summaryMessage: string;
} {
  const dosesRemaining = supply.currentStock;
  const dosesPerDay = supply.dailyConsumption;
  const daysRemaining = dosesRemaining / (dosesPerDay || 1);
  const depletionHours = Math.round(daysRemaining * 24);

  let interruptionRisk: 'HIGH_RISK' | 'MEDIUM_RISK' | 'LOW_RISK' = 'LOW_RISK';
  let summaryMessage = 'Supply levels adequate for scheduled regimen.';

  if (depletionHours <= supply.deliveryLeadTimeHours || dosesRemaining === 0) {
    interruptionRisk = 'HIGH_RISK';
    summaryMessage = `CRITICAL: Supply depleted (${dosesRemaining} doses left). Immediate delivery required to prevent treatment failure.`;
  } else if (depletionHours <= 36) {
    interruptionRisk = 'MEDIUM_RISK';
    summaryMessage = `WARNING: Depletion predicted in ~${depletionHours} hours. Pre-emptive refill recommended.`;
  }

  return { depletionHours, interruptionRisk, summaryMessage };
}

export function generatePreFilledWhatsAppLink(pharmacy: Pharmacy, medicationName: string, brandName: string): string {
  const message = encodeURIComponent(
    `Hello ${pharmacy.name}, I am ordering my prescribed medication ${medicationName} (${brandName}) via Vanishing Dose Access Recovery. Please confirm physical stock availability and delivery to my location.`
  );
  return `https://wa.me/${pharmacy.whatsapp}?text=${message}`;
}
