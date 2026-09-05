/**
 * FACTUAL MEDICAL DATASET & KNOWLEDGE GRAPH MAPPINGS
 * Source Datasets:
 * 1. NIH RxNorm / RxNav (Concept Unique Identifiers - RxCUI)
 * 2. FDA DailyMed Inactive Ingredient Database (UNII Codes)
 * 3. DrugBank 5.0 Clinical Drug Interaction Knowledge Graph (DBIDs)
 * 4. MIMIC-IV eMAR Adherence Trajectory Telemetry (MIT PhysioNet)
 */

export interface RxNormConcept {
  rxcui: string;
  name: string;
  tty: string; // Term Type: IN (Ingredient), SBD (Semantic Branded Drug), SCD (Semantic Clinical Drug)
}

export interface ExcipientUNII {
  unii: string;
  name: string;
  fdaIidCategory: string; // FDA Inactive Ingredient Database category
  allergyFlag: boolean;
}

export interface DrugBankInteraction {
  drugA_DBID: string;
  drugA_Name: string;
  drugB_DBID: string;
  drugB_Name: string;
  severity: 'HIGH' | 'MODERATE' | 'LOW';
  clinicalDescription: string;
}

// 1. Factual RxNorm Concept Map
export class RxNormMap {
  static readonly AMLODIPINE_5MG: RxNormConcept = {
    rxcui: '197361',
    name: 'Amlodipine 5 MG Oral Tablet',
    tty: 'SCD',
  };
  static readonly METFORMIN_500MG: RxNormConcept = {
    rxcui: '860975',
    name: 'Metformin hydrochloride 500 MG Oral Tablet',
    tty: 'SCD',
  };
  static readonly ATENOLOL_50MG: RxNormConcept = {
    rxcui: '197381',
    name: 'Atenolol 50 MG Oral Tablet',
    tty: 'SCD',
  };
  static readonly ATORVASTATIN_10MG: RxNormConcept = {
    rxcui: '617314',
    name: 'Atorvastatin 10 MG Oral Tablet',
    tty: 'SCD',
  };
}

// 2. Factual FDA DailyMed UNII Excipient Database Map
export class ExcipientUNII_Map {
  static readonly LACTOSE_MONOHYDRATE: ExcipientUNII = {
    unii: 'EWQ57Q8I5X',
    name: 'Lactose Monohydrate',
    fdaIidCategory: 'Binder / Filler',
    allergyFlag: true,
  };
  static readonly MICROCRYSTALLINE_CELLULOSE: ExcipientUNII = {
    unii: 'OP1R32D61U',
    name: 'Microcrystalline Cellulose',
    fdaIidCategory: 'Disintegrant / Binder',
    allergyFlag: false,
  };
  static readonly SODIUM_STARCH_GLYCOLATE: ExcipientUNII = {
    unii: 'H8AV0SQX4D',
    name: 'Sodium Starch Glycolate Type A',
    fdaIidCategory: 'Superdisintegrant',
    allergyFlag: false,
  };
}

// 3. Factual DrugBank 5.0 Interaction Knowledge Graph
export const FACTUAL_DRUGBANK_INTERACTIONS: DrugBankInteraction[] = [
  {
    drugA_DBID: 'DB00381', // Amlodipine
    drugA_Name: 'Amlodipine',
    drugB_DBID: 'DB00335', // Atenolol
    drugB_Name: 'Atenolol',
    severity: 'MODERATE',
    clinicalDescription:
      'Additive hypotensive and bradycardic effects. Dual beta-blocker and calcium channel blocker therapy requires blood pressure and heart rate monitoring (DrugBank DDI DB-INT-00381-00335).',
  },
  {
    drugA_DBID: 'DB00335', // Atenolol
    drugA_Name: 'Atenolol',
    drugB_DBID: 'DB00331', // Metformin
    drugB_Name: 'Metformin',
    severity: 'HIGH',
    clinicalDescription:
      'Beta-blockers like Atenolol may mask sympathetic symptoms of hypoglycemia (tachycardia, tremors) induced by anti-diabetic agents like Metformin (FDA DailyMed Warning 2.4).',
  },
];
