import { Patient } from './types';
import { analyzeExecutionForensics } from './forensicsEngine';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-101',
    name: 'Anvesha Sharma',
    age: 48,
    condition: 'Essential Hypertension',
    activeCoMedications: ['Metformin 500mg BD', 'Atorvastatin 10mg HS'],
    knownAllergies: ['Lactose Monohydrate', 'Sulfa Drugs'],
    riskStatus: 'RED',
    verificationStatus: 'PENDING',
    supply: {
      medicationName: 'Amlodipine 5mg',
      dosage: '1 tablet daily',
      currentStock: 0,
      dailyConsumption: 1,
      lastRefillDate: '2026-08-04',
      expectedDepletionDate: '2026-09-04',
      deliveryLeadTimeHours: 6,
      brandName: 'Amlovas 5mg',
      genericName: 'Amlodipine Besylate 5mg',
    },
    doses: [
      {
        id: 'd-1',
        medicationName: 'Amlodipine 5mg',
        dosage: '1 tablet',
        scheduledTime: '08:00 AM Today',
        status: 'MISSED',
      },
      {
        id: 'd-2',
        medicationName: 'Amlodipine 5mg',
        dosage: '1 tablet',
        scheduledTime: '08:00 AM Yesterday',
        status: 'TAKEN',
        takenAt: '08:12 AM',
      },
    ],
    signals: {
      doseEvents: [
        {
          id: 'd-1',
          medicationName: 'Amlodipine 5mg',
          dosage: '1 tablet',
          scheduledTime: '08:00 AM Today',
          status: 'MISSED',
        },
      ],
      supply: {
        medicationName: 'Amlodipine 5mg',
        dosage: '1 tablet daily',
        currentStock: 0,
        dailyConsumption: 1,
        lastRefillDate: '2026-08-04',
        expectedDepletionDate: '2026-09-04',
        deliveryLeadTimeHours: 6,
        brandName: 'Amlovas 5mg',
        genericName: 'Amlodipine Besylate 5mg',
      },
      refill: {
        lastRefillDate: '2026-08-04',
        refillOverdueDays: 2,
        expectedRunoutDate: '2026-09-03',
      },
      wearable: {
        sleepDisruptionHours: 0.5,
        activityLevelPercentile: 85,
        timezoneChanged: false,
        restingHeartRateDelta: 2,
      },
    },
    recoveryHistory: [
      {
        timestamp: '08:00 AM',
        action: 'Scheduled Dose Reminder Delivered',
        result: 'No confirmation response within 15 min window',
      },
      {
        timestamp: '08:15 AM',
        action: 'Execution Forensics Reasoning Engine Executed',
        result: 'Identified Cause: ACCESS_EXHAUSTION (94% Confidence)',
      },
    ],
  },
  {
    id: 'p-102',
    name: 'Rahul Verma',
    age: 34,
    condition: 'Post-Op Bacterial Infection',
    activeCoMedications: ['Paracetamol 650mg PRN'],
    knownAllergies: ['Penicillin Derivatives'],
    riskStatus: 'ORANGE',
    verificationStatus: 'PENDING',
    supply: {
      medicationName: 'Amoxicillin 500mg',
      dosage: '1 capsule TID',
      currentStock: 12,
      dailyConsumption: 3,
      lastRefillDate: '2026-09-02',
      expectedDepletionDate: '2026-09-08',
      deliveryLeadTimeHours: 4,
      brandName: 'Mox 500mg',
      genericName: 'Amoxicillin Trihydrate',
    },
    doses: [
      {
        id: 'd-10',
        medicationName: 'Amoxicillin 500mg',
        dosage: '1 capsule',
        scheduledTime: '02:00 PM Today',
        status: 'MISSED',
      },
    ],
    signals: {
      doseEvents: [
        {
          id: 'd-10',
          medicationName: 'Amoxicillin 500mg',
          dosage: '1 capsule',
          scheduledTime: '02:00 PM Today',
          status: 'MISSED',
        },
      ],
      supply: {
        medicationName: 'Amoxicillin 500mg',
        dosage: '1 capsule TID',
        currentStock: 12,
        dailyConsumption: 3,
        lastRefillDate: '2026-09-02',
        expectedDepletionDate: '2026-09-08',
        deliveryLeadTimeHours: 4,
        brandName: 'Mox 500mg',
        genericName: 'Amoxicillin Trihydrate',
      },
      refill: {
        lastRefillDate: '2026-09-02',
        refillOverdueDays: 0,
        expectedRunoutDate: '2026-09-08',
      },
      symptoms: [
        {
          symptomName: 'Severe Acute Nausea & Epigastric Distress',
          severity: 8,
          loggedHoursPostDose: 1.5,
        },
      ],
    },
    recoveryHistory: [
      {
        timestamp: '02:00 PM',
        action: 'Dose Reminder Sent',
        result: 'Dose unconfirmed',
      },
      {
        timestamp: '02:15 PM',
        action: 'Symptom Signal Evaluated',
        result: 'Identified Cause: SIDE_EFFECT_AVOIDANCE (82% Confidence)',
      },
    ],
  },
  {
    id: 'p-103',
    name: 'Priya Patel',
    age: 29,
    condition: 'Bronchial Asthma',
    activeCoMedications: ['Montelukast 10mg HS'],
    knownAllergies: ['Aspirin', 'NSAIDs'],
    riskStatus: 'ORANGE',
    verificationStatus: 'PENDING',
    supply: {
      medicationName: 'Budesonide 200mcg Inhaler',
      dosage: '2 puffs twice daily',
      currentStock: 40,
      dailyConsumption: 4,
      lastRefillDate: '2026-08-20',
      expectedDepletionDate: '2026-09-20',
      deliveryLeadTimeHours: 6,
      brandName: 'Budecort 200',
      genericName: 'Budesonide Inhalation Powder',
    },
    doses: [
      {
        id: 'd-20',
        medicationName: 'Budesonide 200mcg',
        dosage: '2 puffs',
        scheduledTime: '09:00 AM Today',
        status: 'MISSED',
      },
    ],
    signals: {
      doseEvents: [
        {
          id: 'd-20',
          medicationName: 'Budesonide 200mcg',
          dosage: '2 puffs',
          scheduledTime: '09:00 AM Today',
          status: 'MISSED',
        },
      ],
      supply: {
        medicationName: 'Budesonide 200mcg Inhaler',
        dosage: '2 puffs twice daily',
        currentStock: 40,
        dailyConsumption: 4,
        lastRefillDate: '2026-08-20',
        expectedDepletionDate: '2026-09-20',
        deliveryLeadTimeHours: 6,
        brandName: 'Budecort 200',
        genericName: 'Budesonide Inhalation Powder',
      },
      refill: {
        lastRefillDate: '2026-08-20',
        refillOverdueDays: 0,
        expectedRunoutDate: '2026-09-20',
      },
      wearable: {
        sleepDisruptionHours: 3.2,
        activityLevelPercentile: 45,
        timezoneChanged: true,
        restingHeartRateDelta: 6,
      },
    },
    recoveryHistory: [
      {
        timestamp: '09:00 AM',
        action: 'Scheduled Inhaler Reminder',
        result: 'Unconfirmed',
      },
      {
        timestamp: '09:20 AM',
        action: 'Wearable Event Analysis',
        result: 'Identified Cause: ROUTINE_DISRUPTION (74% Confidence - Travel Timezone Shift)',
      },
    ],
  },
  {
    id: 'p-104',
    name: 'Amit Kumar',
    age: 56,
    condition: 'Hyperlipidemia',
    activeCoMedications: ['Enalapril 5mg'],
    knownAllergies: [],
    riskStatus: 'GREEN',
    verificationStatus: 'VERIFIED_SUCCESS',
    supply: {
      medicationName: 'Atorvastatin 10mg',
      dosage: '1 tablet HS',
      currentStock: 24,
      dailyConsumption: 1,
      lastRefillDate: '2026-08-28',
      expectedDepletionDate: '2026-09-28',
      deliveryLeadTimeHours: 12,
      brandName: 'Atorva 10mg',
      genericName: 'Atorvastatin Calcium',
    },
    doses: [
      {
        id: 'd-30',
        medicationName: 'Atorvastatin 10mg',
        dosage: '1 tablet',
        scheduledTime: '10:00 PM Yesterday',
        status: 'TAKEN',
        takenAt: '09:55 PM',
      },
    ],
    signals: {
      doseEvents: [
        {
          id: 'd-30',
          medicationName: 'Atorvastatin 10mg',
          dosage: '1 tablet',
          scheduledTime: '10:00 PM Yesterday',
          status: 'TAKEN',
          takenAt: '09:55 PM',
        },
      ],
      supply: {
        medicationName: 'Atorvastatin 10mg',
        dosage: '1 tablet HS',
        currentStock: 24,
        dailyConsumption: 1,
        lastRefillDate: '2026-08-28',
        expectedDepletionDate: '2026-09-28',
        deliveryLeadTimeHours: 12,
        brandName: 'Atorva 10mg',
        genericName: 'Atorvastatin Calcium',
      },
      refill: {
        lastRefillDate: '2026-08-28',
        refillOverdueDays: 0,
        expectedRunoutDate: '2026-09-28',
      },
    },
    recoveryHistory: [
      {
        timestamp: '09:55 PM',
        action: 'Dose Logged On-Time',
        result: 'Adherence stable (100%)',
      },
    ],
  },
];

INITIAL_PATIENTS.forEach((p) => {
  p.activeAttribution = analyzeExecutionForensics(p.id, p.name, p.signals);
});
