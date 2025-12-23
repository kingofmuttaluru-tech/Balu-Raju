
export type UserRole = 'PATIENT' | 'ADMIN' | 'COLLECTOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  age?: string;
  gender?: string;
}

export type BookingStatus = 'PENDING' | 'ASSIGNED' | 'COLLECTED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface Test {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface Booking {
  id: string;
  labId?: string; // Generated after payment
  patientId: string;
  patientName: string;
  age?: string;
  gender?: string;
  testId: string;
  testName: string;
  date: string;
  time?: string;
  status: BookingStatus;
  paymentStatus: 'PAID' | 'UNPAID';
  amount: number;
  reportUrl?: string;
  results?: Record<string, string>;
  verifiedAt?: string;
  referringDoctor?: string;
  sampleType?: string;
  collectionType: 'HOME' | 'LAB';
  address?: string;
}
