# 💊 VANISHING DOSE — Closed-Loop Medication Execution Recovery System

> **Detecting Medication Non-Adherence Without Asking, Reconstructing Why, and Verifying Restored Treatment Execution.**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![HL7 FHIR R4](https://img.shields.io/badge/HL7_FHIR-R4-firebrick?style=for-the-badge)](https://hl7.org/fhir/)
[![Medical Datasets](https://img.shields.io/badge/Medical_Data-RxNorm_%7C_FDA_UNII_%7C_DrugBank_5.0-emerald?style=for-the-badge)](https://rxnav.nlm.nih.gov/)

---

## 📌 Executive Summary & Philosophy

Existing medication management tools are fundamentally fragmented:
* **Reminder Apps** (*Medisafe, Hero*) assume every missed dose is a "forgetting" issue and send annoying alarmist alerts.
* **Pharmacy Finders** (*FindMedicine, ChekDrug*) act as static marketplaces where patients must manually search when pills run out.
* **AI Adherence Tools** (*OneDose, Rivvi*) detect refill gaps but **stop at sending an intervention**.

**Vanishing Dose closes the loop**:
```
  MISSED DOSE DETECTED ──► EXECUTION FORENSICS ──► CAUSE-SPECIFIC RECOVERY ──► CLOSED-LOOP VERIFICATION
  (8:00 AM Timeout)        (Stock Exhausted 0)     (4 Verified Pharmacies)      (Stock +30, Adherence Restored)
```

Instead of asking patients to complete tedious daily self-reports, Vanishing Dose ingests **indirect, routinely available background signals** (pharmacy refill telemetry, calculated stock counts, wearable sleep/timezone metrics, post-dose symptom scores) to reconstruct *why* a dose vanished, trigger cause-specific resolution (including verified local pharmacy access), and verify that treatment execution was physically restored.

---

## 🎯 Problem Statement Mapping

> **Problem Title**: *"The Vanishing Dose — Detecting Medication Non-Adherence Without Asking"*

| Official Problem Requirement | Vanishing Dose Architectural Solution |
| :--- | :--- |
| **Reason from indirect, routine signals** | Ingests 5 background vectors: Refill Overdue Days, Calculated Stock Depletion, Wearable Sleep/Activity Anomaly, Post-Dose Symptom Severity, Schedule Delays. |
| **Detect non-adherence "Without Asking"** | Reconstructs dose execution divergence passively from background telemetry without requiring manual patient self-report for every dose. |
| **Distinguish intermittent vs structural patterns** | Machine learning classifier categorizes events into `INTERMITTENT_SLIP`, `STRUCTURAL_DRIFT`, or `ACUTE_ABANDONMENT`. |
| **Communicate uncertainty clearly** | Calculates dynamic numeric certainty scores ($0 - 100\%$) and categorical confidence intervals (`HIGH_CONFIDENCE`, `MEDIUM_CONFIDENCE`, `LOW_CONFIDENCE`). |
| **Avoid assuming patient non-compliance** | Performs non-judgmental attribution (`ACCESS_EXHAUSTION`, `SIDE_EFFECT_AVOIDANCE`, `ROUTINE_DISRUPTION`, `FORGETTING`). |

---

## 🔬 Core 4-Stage Intelligence Engine

```
                          ┌──────────────────────────┐
                          │   Prescription & Plan    │
                          └─────────────┬────────────┘
                                        │
                                        ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                      STAGE 1: TEMPORAL MONITOR                          │
    │  - Dose Logs   - Inventory Tracker   - Wearable Signals   - Symptoms    │
    └───────────────────────────────────┬─────────────────────────────────────┘
                                        │
                                        ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                   STAGE 2: EXECUTION FORENSICS ENGINE                   │
    │   Analyzes temporal evidence graph → Computes Failure Attribution Score │
    └───────────────────────────────────┬─────────────────────────────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
┌─────────────────┐           ┌───────────────────┐          ┌───────────────────┐
│   FORGETTING    │           │  ACCESS FAILURE   │          │ CLINICAL / CONTEXT│
└────────┬────────┘           └─────────┬─────────┘          └─────────┬─────────┘
         │                              │                              │
         ▼                              ▼                              ▼
┌─────────────────┐           ┌───────────────────┐          ┌───────────────────┐
│ Contextual      │           │ STAGE 3: ACCESS   │          │ Doctor Escalation │
│ Nudge           │           │ RECOVERY ENGINE   │          │ & Regimen Review  │
└────────┬────────┘           └─────────┬─────────┘          └─────────┬─────────┘
         │                              │                              │
         └──────────────────────────────┼──────────────────────────────┘
                                        │
                                        ▼
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                   STAGE 4: CLOSED-LOOP VERIFICATION                     │
    │     Track intervention status → Confirm Dose Obtained → Verify Restored │
    └─────────────────────────────────────────────────────────────────────────┘
```

### Stage 1 — DETECT
Monitors dose timelines passively. When an expected dose passes without confirmation, the system flags execution divergence.

### Stage 2 — EXPLAIN (Execution Forensics Engine)
Queries the temporal evidence graph (`src/lib/forensicsEngine.ts`):
* Calculates remaining stock: $\text{CurrentStock} = \text{LastRefillStock} - \text{ExecutedDoses}$.
* If $\text{CurrentStock} \le 0$ at dose time $\rightarrow$ Flagged as **`ACCESS_EXHAUSTION`** ($94\%$ Certainty).
* If severe symptom score $\ge 5/10$ post-dose $\rightarrow$ Flagged as **`SIDE_EFFECT_AVOIDANCE`** ($82\%$ Certainty).
* If wearable timezone shift detected $\rightarrow$ Flagged as **`ROUTINE_DISRUPTION`** ($74\%$ Certainty).

### Stage 3 — RESOLVE (Medication Access Recovery Engine)
Converts pharmacy discovery from a random marketplace feature into a **cause-specific recovery actuator** (`src/lib/accessRecoveryEngine.ts`):
* **Stock Availability Confidence Protocol**: Prioritizes stores by API data freshness (`HIGH_CONFIDENCE` $<30$ min direct API vs `MEDIUM_CONFIDENCE` partner status vs `UNCONFIRMED`).
* **Multi-Attribute Utility Ranking**: Scores candidate stores based on Confidence Weight, Distance (km), Unit Price (₹), Delivery Lead Time, and Store Closing Hours.
* **30-Minute Real-Time Stock Reservation Lock**: Patients can place a 30-minute hold reservation on local inventory while traveling or awaiting delivery.
* **Pre-Filled WhatsApp Ordering**: Generates direct WhatsApp order links pre-populated with prescribed drug name, dosage, and delivery address.

### Stage 4 — VERIFY (Closed-Loop Ledger)
Tracks the complete lifecycle (`src/lib/verificationEngine.ts`):
$\text{Problem} \rightarrow \text{Cause} \rightarrow \text{Intervention} \rightarrow \text{Outcome}$. Once medication acquisition is confirmed (via Pill Photo Scanner or store receipt), stock is restored by +30 tablets and clinician triage status updates to **`GREEN`**.

---

## 🧬 Factual Medical Datasets & Safety Engine

Vanishing Dose is backed by real, factual clinical reference datasets (`src/lib/clinicalDataset.ts`):

```
                       PERSONALIZED SAFETY EVALUATION MATRIX

                   ALTERNATIVE IN STOCK                    PATIENT PROFILE
             ┌──────────────────────────────┐       ┌────────────────────────────┐
             │ Brand: Stamlo 5mg            │       │ Patient: Anvesha Sharma    │
             │ Excipient: Lactose (UNII: EW)│  vs.  │ Allergies: Lactose Mono    │
             │ API: Amlodipine 5mg (RxCUI) │       │ Co-Meds: Metformin 500mg   │
             └──────────────┬───────────────┘       └─────────────┬──────────────┘
                            │                                     │
                            └──────────────────┬──────────────────┘
                                               │
                                               ▼
             ┌──────────────────────────────────────────────────────────┐
             │                EVALUATION REASONING OUTPUT               │
             │ 🔴 CONTRAINDICATED: Contains FDA DailyMed Excipient      │
             │    "Lactose Monohydrate" matching patient known allergy. │
             └──────────────────────────────────────────────────────────┘
```

1. **NIH RxNorm / RxNav**: Standardizes clinical drugs using RxCUI codes (*Amlodipine 5mg: `RxCUI: 197361`*, *Atenolol 50mg: `RxCUI: 197381`*).
2. **FDA DailyMed Inactive Ingredient Database (IID)**: Identifies excipients, binders, and allergens using FDA **UNII** codes (*Lactose Monohydrate: `UNII: EWQ57Q8I5X`*).
3. **DrugBank 5.0 Drug Interaction Graph**: Evaluates Drug-Drug (DDI) and Drug-Excipient interactions (*Atenolol + Metformin: High Severity DDI - Beta-blockers mask hypoglycemia tachycardia*).
4. **PhysioNet MIMIC-IV Dataset**: Longitudinal eMAR records used for adherence trajectory modeling.

---

## 🖥️ Tri-Portal User Experience

### 🧑 1. Patient App Portal (`/patient`)
* **Live Dose Timeline & Stock Counter**: Real-time stock depletion indicators and projected treatment interruption warnings.
* **Access Recovery Drawer**: Displays verified local pharmacies with prices, stock confidence badges, transit delays, WhatsApp links, and 30-min hold buttons.
* **Personalized Substitute Safety Check**: Displays 🟢 `SAFE_EQUIVALENT`, 🟡 `CONSULT_PHARMACIST`, or 🔴 `CONTRAINDICATED` ratings for alternative drug brands based on patient allergies and co-medications.
* **Pill Photo Scanner Simulator**: Instant packaging photo match to confirm acquisition and trigger celebration confetti.

### 🧑‍⚕️ 2. Doctor Command Center (`/doctor`)
* **Risk Triage Board**: Non-judgmentally categorizes patient panels into 🔴 Critical Access Risk, 🟠 Emerging Disruption, and 🟢 Restored.
* **Forensic Evidence Audit**: Displays temporal evidence chains, 30-day adherence drift trajectory bars, and dynamic uncertainty percentages.
* **HL7 FHIR R4 Export**: One-click export of compliant FHIR `Bundle`, `MedicationRequest`, and `DetectedIssue` JSON resources.
* **Clinician Regimen Modifier**: Allows doctors to adjust dosage instructions directly with automated audit logging.

### 🏪 3. Pharmacy Partner Network (`/pharmacy`)
* **Live Inventory Verification**: Local pharmacy partners confirm physical stock and update unit prices, instantly upgrading availability confidence to `HIGH_CONFIDENCE` with live API timestamps.
* **30-Min Hold Reservation Queue**: Real-time view of patient stock reservation holds.

---

## 🛠️ Project Structure

```
vanishing-dose/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Executive Pitch & Architecture Dashboard
│   │   ├── patient/page.tsx            # Patient App & Access Recovery Interface
│   │   ├── doctor/page.tsx             # Doctor Command Center & Risk Triage
│   │   ├── pharmacy/page.tsx           # Pharmacy Partner Network & Verification
│   │   ├── globals.css                 # Dark theme styling & tailwind directives
│   │   └── layout.tsx                  # Root layout & providers
│   ├── components/
│   │   ├── AccessRecoveryModal.tsx     # Pharmacy Access Recovery & Alternative Evaluator Drawer
│   │   ├── ForensicsTimeline.tsx       # Forensic Evidence Timeline & FHIR R4 Exporter
│   │   ├── ConfidenceBadge.tsx         # Stock Confidence indicator badge
│   │   └── Navigation.tsx              # Tri-portal navigation header
│   ├── context/
│   │   └── VanishingDoseContext.tsx    # Reactive state provider across all portals
│   └── lib/
│       ├── clinicalDataset.ts          # NIH RxNorm, FDA DailyMed UNII & DrugBank datasets
│       ├── forensicsEngine.ts          # Multi-signal temporal reasoning & FHIR exporter
│       ├── accessRecoveryEngine.ts     # Pharmacy ranking & personalized alternative safety evaluator
│       ├── verificationEngine.ts       # Closed-loop verification ledger state machine
│       ├── mockData.ts                 # Realistic clinical patient case scenarios
│       └── types.ts                    # TypeScript domain interfaces
├── scratch/
│   └── test_model.ts                   # Headless execution unit test script
├── README.md                           # Comprehensive documentation
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation & Launch

```bash
# 1. Clone the repository
git clone https://github.com/ASingh2425/Gossip_Protocol.git
cd Gossip_Protocol

# 2. Install dependencies
npm install

# 3. Run headless model verification tests
npx tsx scratch/test_model.ts

# 4. Launch development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build Verification

```bash
npm run build
```

---

## ⚖️ License & Attribution

This project was built for the **Healthcare Challenge**. Built with ❤️ using Next.js, React, TailwindCSS, Lucide Icons, and clinical data from NIH RxNorm, FDA DailyMed, and DrugBank 5.0.
