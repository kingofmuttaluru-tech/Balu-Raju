
import { Test, Booking } from './types';

export interface Parameter {
  name: string;
  key: string;
  unit: string;
  range: string;
}

export const TEST_TEMPLATES: Record<string, Parameter[]> = {
  'Hematology': [
    { name: 'Hemoglobin (Hb)', key: 'Hb', unit: 'g/dL', range: '13.0 – 17.0' },
    { name: 'Total RBC Count', key: 'RBC', unit: 'million/µL', range: '4.5 – 5.9' },
    { name: 'Hematocrit (PCV)', key: 'PCV', unit: '%', range: '40 – 50' },
    { name: 'Total WBC Count', key: 'WBC', unit: 'cells/µL', range: '4,000 – 11,000' },
    { name: 'Platelet Count', key: 'Platelets', unit: 'cells/µL', range: '150,000 – 450,000' },
    { name: 'Neutrophils', key: 'Neutrophils', unit: '%', range: '40 – 75' },
    { name: 'Lymphocytes', key: 'Lymphocytes', unit: '%', range: '20 – 45' },
    { name: 'Monocytes', key: 'Monocytes', unit: '%', range: '2 – 10' },
    { name: 'Eosinophils', key: 'Eosinophils', unit: '%', range: '1 – 6' },
  ],
  'Organ Profile': [
    { name: 'Total Bilirubin', key: 'TotalBili', unit: 'mg/dL', range: '0.1 – 1.2' },
    { name: 'Direct Bilirubin', key: 'DirectBili', unit: 'mg/dL', range: '0.0 – 0.3' },
    { name: 'SGOT (AST)', key: 'SGOT', unit: 'U/L', range: '0 – 40' },
    { name: 'SGPT (ALT)', key: 'SGPT', unit: 'U/L', range: '0 – 41' },
    { name: 'Total Protein', key: 'TotalProtein', unit: 'g/dL', range: '6.0 – 8.3' },
    { name: 'Albumin', key: 'Albumin', unit: 'g/dL', range: '3.5 – 5.2' },
  ],
  'Biochemistry': [
    { name: 'Total Cholesterol', key: 'Cholesterol', unit: 'mg/dL', range: '< 200' },
    { name: 'Triglycerides', key: 'Triglycerides', unit: 'mg/dL', range: '< 150' },
    { name: 'HDL Cholesterol', key: 'HDL', unit: 'mg/dL', range: '> 40' },
    { name: 'LDL Cholesterol', key: 'LDL', unit: 'mg/dL', range: '< 100' },
  ],
  'Metabolic': [
    { name: 'HbA1c', key: 'HbA1c', unit: '%', range: '4.0 – 5.6' },
    { name: 'Estimated Avg Glucose', key: 'EAG', unit: 'mg/dL', range: '70 – 126' },
  ],
  'Endocrinology': [
    { name: 'T3', key: 'T3', unit: 'ng/dL', range: '80 – 200' },
    { name: 'T4', key: 'T4', unit: 'µg/dL', range: '5.0 – 12.0' },
    { name: 'TSH', key: 'TSH', unit: 'µIU/mL', range: '0.3 – 4.5' },
  ]
};

export const AVAILABLE_TESTS: Test[] = [
  { id: '1', name: 'Complete Blood Count (CBC)', price: 499, category: 'Hematology', description: 'Comprehensive screening for blood-related conditions.' },
  { id: '2', name: 'Lipid Profile', price: 850, category: 'Biochemistry', description: 'Checks cholesterol and triglyceride levels for heart health.' },
  { id: '3', name: 'Thyroid Profile (T3, T4, TSH)', price: 1200, category: 'Endocrinology', description: 'Evaluates thyroid gland function.' },
  { id: '4', name: 'Diabetes Screen (HbA1c)', price: 600, category: 'Metabolic', description: 'Measures average blood sugar over 3 months.' },
  { id: '5', name: 'Vitamin D (25-OH)', price: 1500, category: 'Vitamins', description: 'Assesses vitamin D levels for bone health.' },
  { id: '6', name: 'Liver Function Test (LFT)', price: 950, category: 'Organ Profile', description: 'Evaluates health and performance of the liver.' },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK1001',
    patientId: 'p1',
    patientName: 'John Doe',
    age: '45 Yrs',
    gender: 'Male',
    testId: '1',
    testName: 'Complete Blood Count (CBC)',
    date: '2024-05-15',
    time: '09:00 AM',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    amount: 499,
    referringDoctor: 'Dr. Sameer Verma',
    sampleType: 'Whole Blood (EDTA)',
    collectionType: 'LAB',
    results: {
      'Hb': '14.2',
      'RBC': '5.1',
      'PCV': '42',
      'WBC': '7500',
      'Platelets': '250000',
      'Neutrophils': '60',
      'Lymphocytes': '30',
      'Monocytes': '5',
      'Eosinophils': '4'
    },
    verifiedAt: '2024-05-16 11:45 AM'
  },
  {
    id: 'BK1002',
    patientId: 'p1',
    patientName: 'John Doe',
    age: '45 Yrs',
    gender: 'Male',
    testId: '2',
    testName: 'Lipid Profile',
    date: '2024-05-20',
    time: '08:30 AM',
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    amount: 850,
    referringDoctor: 'Self',
    sampleType: 'Serum',
    collectionType: 'HOME',
    address: '123 Gagan Heights, Ludhiana'
  }
];
