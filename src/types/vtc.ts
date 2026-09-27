export type RideStatus =
  | 'idle'
  | 'selecting_destination'
  | 'choosing_vehicle'
  | 'searching_driver'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'driver_arrived'
  | 'in_progress'
  | 'completed';

export type UserMode = 'passenger' | 'driver';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'driver_assigned' | 'driver_arriving' | 'driver_arrived' | 'trip_cancelled' | 'trip_completed' | 'system';
  timestamp: string;
  read: boolean;
  timeAgo?: string;
}

export interface LocationPoint {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  type?: 'airport' | 'popular' | 'station' | 'home' | 'work';
}

export interface RideCategory {
  id: 'eco' | 'confort' | 'moto' | 'climatise' | 'express';
  name: string;
  tagline: string;
  basePrice: number;
  perKmRate: number;
  etaMinutes: number;
  capacity: number;
  image: string;
  badge?: string;
  features: string[];
}

export interface PaymentMethod {
  id: 'wave' | 'orange_money' | 'cash' | 'wallet';
  name: string;
  iconName: string;
  description: string;
  color: string;
  balance?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalTrips: number;
  carModel: string;
  carColor: string;
  licensePlate: string;
  photoUrl: string;
  lat: number;
  lng: number;
  bearing: number;
}

export interface Trip {
  id: string;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  category: RideCategory;
  paymentMethod: PaymentMethod;
  estimatedFare: number;
  actualFare?: number;
  distanceKm: number;
  durationMinutes: number;
  driver?: Driver;
  pinCode: string;
  status: RideStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  rating?: number;
  tip?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'driver' | 'passenger';
  text: string;
  timestamp: string;
}

export interface WalletTransaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  method: string;
}
