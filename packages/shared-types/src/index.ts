export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'barber' | 'admin';
  createdAt: Date;
}

export interface Barber {
  id: number;
  userId: number;
  bio: string | null;
  isActive: boolean;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
}

export interface Appointment {
  id: number;
  clientId: number | null;
  barberId: number | null;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  status: AppointmentStatus;
  createdAt: string; // ISO String
}