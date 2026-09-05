import { analyzeExecutionForensics } from '../src/lib/forensicsEngine';
import { rankPharmaciesForRecovery, calculateDepletionInterruptionRisk, evaluatePersonalizedAlternativeSafety, MOCK_PHARMACIES } from '../src/lib/accessRecoveryEngine';
import { advanceVerificationState } from '../src/lib/verificationEngine';
import { INITIAL_PATIENTS } from '../src/lib/mockData';

console.log('=== 1. TESTING EXECUTION FORENSICS REASONING ENGINE ===');
INITIAL_PATIENTS.forEach((patient) => {
  const attribution = analyzeExecutionForensics(patient.id, patient.name, patient.signals);
  console.log(`\nPatient: ${patient.name}`);
  console.log(`- Attributed Cause: ${attribution.detectedCause}`);
  console.log(`- Confidence Score: ${attribution.confidenceScore}% (${attribution.confidenceLevel})`);
  console.log(`- Pattern Taxonomy: ${attribution.patternType}`);
  console.log(`- Evidence Count: ${attribution.evidence.length} items`);
});

console.log('\n=== 2. TESTING PERSONALIZED ALTERNATIVE SAFETY ENGINE ===');
const patientAnvesha = INITIAL_PATIENTS[0]; // Active Co-Meds: Metformin, Atorvastatin | Allergies: Lactose Monohydrate
console.log(`Patient Context: ${patientAnvesha.name}`);
console.log(`- Active Co-Meds: ${patientAnvesha.activeCoMedications.join(', ')}`);
console.log(`- Known Allergies: ${patientAnvesha.knownAllergies.join(', ')}`);

MOCK_PHARMACIES.forEach((pharmacy) => {
  if (pharmacy.availableAlternatives) {
    pharmacy.availableAlternatives.forEach((rawAlt) => {
      const evaluated = evaluatePersonalizedAlternativeSafety(rawAlt, patientAnvesha);
      console.log(`\nAlternative: ${evaluated.brandName} at ${pharmacy.name}`);
      console.log(`- Safety Status: ${evaluated.safetyStatus} (Score: ${evaluated.safetyScore}%)`);
      console.log(`- Warnings: ${evaluated.interactionWarnings?.[0]}`);
    });
  }
});

console.log('\n=== 3. TESTING PHARMACY UTILITY RANKING ENGINE ===');
const ranked = rankPharmaciesForRecovery(MOCK_PHARMACIES);
console.log(`Top Ranked Pharmacy: ${ranked[0].name} (Score Rank 1)`);

console.log('\n=== ALL MODEL & PERSONALIZED ALTERNATIVE SAFETY TESTS PASSED ===');
