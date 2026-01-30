
import { UserProfile, ShipmentStatus, Warehouse, Vehicle, Driver, Transaction, Order, Invoice, InventoryLog } from "../types";

const DB_PREFIX = 'logismart_prod_';

export const storageService = {
  _save: (table: string, data: any) => localStorage.setItem(DB_PREFIX + table, JSON.stringify(data)),
  _get: (table: string) => {
    const data = localStorage.getItem(DB_PREFIX + table);
    return data ? JSON.parse(data) : null;
  },

  // User & Session
  saveUser: (user: Partial<UserProfile>) => {
    const current = storageService.getUser();
    const updated = { ...current, ...user };
    storageService._save('users', updated);
    
    // Auto-initialize financial account for new real users
    if (storageService._get('wallet_balance') === null) {
      storageService._save('wallet_balance', 0);
      storageService.saveTransactions([]);
    }
    return updated;
  },
  getUser: (): UserProfile => {
    return storageService._get('users') || {
      id: 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      phone: '',
      fullName: 'New User',
      email: '',
      role: 'Customer',
      isLoggedIn: false,
      kycStatus: 'not_started'
    };
  },
  logout: () => {
    const user = storageService.getUser();
    storageService._save('users', { ...user, isLoggedIn: false });
  },

  // Shipments (The core of the "real" system)
  getShipments: (): ShipmentStatus[] => {
    return storageService._get('shipments') || [];
  },
  saveShipments: (data: ShipmentStatus[]) => storageService._save('shipments', data),
  addShipment: (shipment: ShipmentStatus) => {
    const shipments = storageService.getShipments();
    const updated = [shipment, ...shipments];
    storageService.saveShipments(updated);
    return updated;
  },

  // Wallet & Financials
  getWalletBalance: (): number => {
    const bal = storageService._get('wallet_balance');
    return bal !== null ? Number(bal) : 0;
  },
  updateWallet: (amount: number, type: 'Credit' | 'Debit', description: string) => {
    const currentBal = storageService.getWalletBalance();
    const newBal = type === 'Credit' ? currentBal + amount : currentBal - amount;
    storageService._save('wallet_balance', newBal);
    
    const txns = storageService.getTransactions();
    const newTxn: Transaction = {
      id: 'TXN-' + Math.floor(Math.random() * 1000000),
      type,
      description,
      amount: `₹${amount.toFixed(2)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Successful'
    };
    storageService.saveTransactions([newTxn, ...txns]);
    return newBal;
  },
  getTransactions: (): Transaction[] => storageService._get('transactions') || [],
  saveTransactions: (data: Transaction[]) => storageService._save('transactions', data),

  // Infrastructure Data (Persistence for Hubs/Fleet)
  getWarehouses: (): Warehouse[] => {
    return storageService._get('warehouses') || [
      { id: 'WH-BOM-01', name: 'Bhiwandi Hub', location: 'Mumbai, MH', capacity: 10000, occupied: 0, status: 'Active' },
      { id: 'WH-DEL-01', name: 'Gurgaon Hub', location: 'Delhi NCR', capacity: 8000, occupied: 0, status: 'Active' },
      { id: 'WH-BLR-01', name: 'Hosur Hub', location: 'Bangalore, KA', capacity: 12000, occupied: 0, status: 'Active' }
    ];
  },
  getVehicles: (): Vehicle[] => storageService._get('vehicles') || [
    { id: 'V-01', type: 'Tata Ace', numberPlate: 'MH-04-AB-1234', capacity: 750, status: 'Available' },
    { id: 'V-02', type: 'Eicher Pro', numberPlate: 'DL-01-XY-5678', capacity: 5000, status: 'Available' }
  ],
  getDrivers: (): Driver[] => storageService._get('drivers') || [
    { id: 'D-01', name: 'Rahul Sharma', phone: '9876543210', licenseNumber: 'DL12345678', status: 'Active' },
    { id: 'D-02', name: 'Sandeep Singh', phone: '9876543211', licenseNumber: 'MH87654321', status: 'Active' }
  ],
  saveInfrastructure: (warehouses: Warehouse[], vehicles: Vehicle[], drivers: Driver[]) => {
    storageService._save('warehouses', warehouses);
    storageService._save('vehicles', vehicles);
    storageService._save('drivers', drivers);
  }
};
