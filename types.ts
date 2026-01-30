
import React from 'react';

export type UserRole = 'Admin' | 'Staff' | 'Driver' | 'Customer';

export interface UserProfile {
  id: string;
  phone: string;
  fullName: string;
  email: string;
  role: UserRole;
  isLoggedIn: boolean;
  kycStatus: 'pending' | 'verified' | 'not_started';
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Metric {
  label: string;
  value: string;
  trend: string;
}

export interface OptimizedRoute {
  carrier: string;
  cost: string;
  estimatedDelivery: string;
  efficiencyScore: number;
  reasoning: string;
}

export interface TrackingStep {
  date: string;
  location: string;
  status: string;
  details: string;
}

export interface ShipmentStatus {
  id: string;
  currentStatus: string;
  origin: string;
  destination: string;
  estimatedArrival: string;
  history: TrackingStep[];
  createdAt?: number; // Timestamp for real-time simulation
  originCoords?: [number, number];
  destCoords?: [number, number];
  currentCoords?: [number, number];
  warehouseId?: string;
  vehicleId?: string;
  driverId?: string;
  weight?: number;
  invoiceValue?: number;
}

export interface Order {
  id: string;
  customerId: string;
  shipmentId: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface Invoice {
  id: string;
  orderId: string;
  amount: number;
  tax: number;
  total: number;
  date: string;
  status: 'Paid' | 'Unpaid';
}

export interface InventoryLog {
  id: string;
  warehouseId: string;
  shipmentId: string;
  type: 'Inbound' | 'Outbound';
  timestamp: string;
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Transaction {
  id: string;
  type: 'Credit' | 'Debit';
  description: string;
  amount: string;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed';
}

export interface Pickup {
  id: string;
  courier: string;
  status: 'Scheduled' | 'Completed' | 'Delayed';
  address: string;
  slots: string;
  count: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupied: number;
  status: 'Active' | 'Maintenance' | 'Full';
}

export interface Vehicle {
  id: string;
  type: string;
  numberPlate: string;
  capacity: number;
  status: 'Available' | 'On Trip' | 'Maintenance';
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  status: 'Active' | 'On Leave' | 'On Duty';
  assignedVehicleId?: string;
}
