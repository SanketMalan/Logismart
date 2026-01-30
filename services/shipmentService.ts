
import { ShipmentStatus, TrackingStep } from '../types';
import { storageService } from './storageService';

// Mock coordinates for major cities
const CITIES: Record<string, [number, number]> = {
  'MUMBAI': [19.0760, 72.8777],
  'DELHI': [28.6139, 77.2090],
  'BANGALORE': [12.9716, 77.5946],
  'CHENNAI': [13.0827, 80.2707],
  'KOLKATA': [22.5726, 88.3639],
  'HYDERABAD': [17.3850, 78.4867],
  'PUNE': [18.5204, 73.8567],
  'AHMEDABAD': [23.0225, 72.5714],
  'JAIPUR': [26.9124, 75.7873],
  'LUCKNOW': [26.8467, 80.9462],
  // Fallbacks
  'NORTH': [28.6139, 77.2090],
  'SOUTH': [12.9716, 77.5946],
  'EAST': [22.5726, 88.3639],
  'WEST': [19.0760, 72.8777],
  'CENTER': [22.7196, 75.8577] // Indore
};

const getCoordsForPincode = (pincode: string): [number, number] => {
  const code = parseInt(pincode.substring(0, 1));
  // Rough mapping based on first digit of Indian pincode
  if (code === 1) return CITIES['DELHI']; // North
  if (code === 2) return CITIES['LUCKNOW']; // North-Central
  if (code === 3) return CITIES['JAIPUR']; // West-North
  if (code === 4) return CITIES['MUMBAI']; // West
  if (code === 5) return CITIES['HYDERABAD']; // South-Central
  if (code === 6) return CITIES['CHENNAI']; // South
  if (code === 7) return CITIES['KOLKATA']; // East
  if (code === 8) return CITIES['EAST']; // East (Bihar/Jharkhand)
  return CITIES['CENTER'];
};

const interpolate = (start: [number, number], end: [number, number], progress: number): [number, number] => {
  return [
    start[0] + (end[0] - start[0]) * progress,
    start[1] + (end[1] - start[1]) * progress
  ];
};

export const shipmentService = {
  createShipment: (originPincode: string, destPincode: string, weight: number, carrier: string, cost: number) => {
    const id = 'LS-' + Math.floor(100000 + Math.random() * 900000);
    const now = Date.now();
    
    const newShipment: ShipmentStatus = {
      id,
      currentStatus: 'Order Placed',
      origin: `Pincode ${originPincode}`,
      destination: `Pincode ${destPincode}`,
      estimatedArrival: 'Calculating...',
      createdAt: now,
      originCoords: getCoordsForPincode(originPincode),
      destCoords: getCoordsForPincode(destPincode),
      currentCoords: getCoordsForPincode(originPincode),
      weight,
      history: [
        {
          date: new Date(now).toLocaleString(),
          location: `Pincode ${originPincode}`,
          status: 'Order Placed',
          details: 'Shipment details received and sorting in progress.'
        }
      ]
    };

    storageService.addShipment(newShipment);
    return id;
  },

  getShipment: (id: string): ShipmentStatus | null => {
    const shipments = storageService.getShipments();
    const shipment = shipments.find(s => s.id === id);
    
    if (!shipment || !shipment.createdAt) return null;

    // SIMULATE REAL-TIME PROGRESS
    const now = Date.now();
    const elapsedMinutes = (now - shipment.createdAt) / (1000 * 60); // minutes
    
    // Config: Full journey takes 5 minutes for demo purposes
    const TOTAL_JOURNEY_MINUTES = 5;
    const progress = Math.min(elapsedMinutes / TOTAL_JOURNEY_MINUTES, 1);

    let status = shipment.currentStatus;
    let history = [...shipment.history];
    let currentCoords = shipment.currentCoords;

    // Update steps based on time
    if (elapsedMinutes > 0.5 && history.length === 1) {
      status = 'Picked Up';
      history.unshift({
        date: new Date(shipment.createdAt + 30000).toLocaleString(),
        location: shipment.origin,
        status: 'Picked Up',
        details: 'Courier partner has collected the package.'
      });
    }

    if (elapsedMinutes > 1.5 && history.length === 2) {
      status = 'In Transit';
      history.unshift({
        date: new Date(shipment.createdAt + 90000).toLocaleString(),
        location: 'In Transit',
        status: 'In Transit',
        details: 'Package is on the way to the destination hub.'
      });
    }

    if (elapsedMinutes > 4.5 && history.length === 3) {
      status = 'Out for Delivery';
      history.unshift({
        date: new Date(shipment.createdAt + 270000).toLocaleString(),
        location: shipment.destination,
        status: 'Out for Delivery',
        details: 'Agent is out for delivery.'
      });
    }

    if (elapsedMinutes >= TOTAL_JOURNEY_MINUTES && history.length === 4) {
      status = 'Delivered';
      history.unshift({
        date: new Date(shipment.createdAt + TOTAL_JOURNEY_MINUTES * 60000).toLocaleString(),
        location: shipment.destination,
        status: 'Delivered',
        details: 'Package delivered successfully.'
      });
    }

    // Update coordinates if in transit
    if (shipment.originCoords && shipment.destCoords && status !== 'Delivered') {
       currentCoords = interpolate(shipment.originCoords, shipment.destCoords, progress);
    } else if (status === 'Delivered' && shipment.destCoords) {
       currentCoords = shipment.destCoords;
    }

    return {
      ...shipment,
      currentStatus: status,
      history,
      currentCoords,
      estimatedArrival: progress >= 1 ? 'Delivered' : `${Math.ceil(TOTAL_JOURNEY_MINUTES - elapsedMinutes)} mins`
    };
  }
};
