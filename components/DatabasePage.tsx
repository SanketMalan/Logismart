
import React, { useState } from 'react';

const DatabasePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'schema' | 'er' | 'sql'>('schema');

  const schemaDefinition = [
    { table: 'Users', columns: 'id (PK), fullName, email, phone, role, password_hash, kyc_status' },
    { table: 'Customers', columns: 'id (PK), user_id (FK), default_address, billing_info' },
    { table: 'Shipments', columns: 'id (PK), order_id (FK), status, origin, destination, weight, current_warehouse_id (FK)' },
    { table: 'Orders', columns: 'id (PK), customer_id (FK), amount, status, order_date' },
    { table: 'TrackingHistory', columns: 'id (PK), shipment_id (FK), status, location, timestamp, details' },
    { table: 'Warehouses', columns: 'id (PK), name, location, capacity, manager_id (FK)' },
    { table: 'Vehicles', columns: 'id (PK), type, number_plate, capacity, status' },
    { table: 'Drivers', columns: 'id (PK), name, phone, license_no, vehicle_id (FK), status' },
    { table: 'Payments', columns: 'id (PK), order_id (FK), amount, status, method, transaction_ref' },
    { table: 'Invoices', columns: 'id (PK), order_id (FK), total, tax, date, status' }
  ];

  const sampleSQL = `
-- Create Order and Shipment
INSERT INTO Orders (id, customer_id, amount, status, order_date) 
VALUES ('ORD-501', 'USR-001', 1200.00, 'Confirmed', NOW());

INSERT INTO Shipments (id, order_id, status, origin, destination, weight) 
VALUES ('LS-10293', 'ORD-501', 'Booked', 'Mumbai', 'Delhi', 1.5);

-- Update Tracking History
INSERT INTO TrackingHistory (shipment_id, status, location, timestamp, details)
VALUES ('LS-10293', 'In Transit', 'Bhiwandi Sorting Hub', NOW(), 'Package picked up from origin');

-- Link Driver to Vehicle and Trip
UPDATE Drivers SET vehicle_id = 'VEH-001', status = 'On Duty' WHERE id = 'DRV-101';
UPDATE Shipments SET driver_id = 'DRV-101' WHERE id = 'LS-10293';

-- Fetch Full Order Details (JOIN Example)
SELECT o.id, s.status, p.amount, i.total as invoice_total
FROM Orders o
JOIN Shipments s ON o.id = s.order_id
JOIN Payments p ON o.id = p.order_id
JOIN Invoices i ON o.id = i.order_id
WHERE o.customer_id = 'USR-001';
  `;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white">Logistics DBMS Architecture</h2>
          <p className="text-slate-500 font-medium">Relational schema design, entity relationships, and operational SQL.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
          {(['schema', 'er', 'sql'] as const).map(v => (
            <button 
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === v ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
        {activeView === 'schema' && (
          <div className="animate-in slide-in-from-right-10 duration-500">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="text-blue-500">📊</span> Normalized Relational Schema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schemaDefinition.map((s, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl group hover:border-blue-500/50 transition-all">
                  <h4 className="font-black text-blue-400 mb-2 uppercase text-xs tracking-widest">{s.table}</h4>
                  <p className="font-mono text-[11px] text-slate-400 leading-relaxed">{s.columns}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'er' && (
          <div className="animate-in slide-in-from-right-10 duration-500 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-12 self-start flex items-center gap-3">
              <span className="text-purple-500">🔗</span> Entity Relationship Diagram (Conceptual)
            </h3>
            <div className="relative w-full max-w-4xl h-[500px] border border-slate-800 rounded-3xl bg-slate-950 p-10 overflow-hidden">
               {/* Simple SVG diagram representation */}
               <svg viewBox="0 0 800 500" className="w-full h-full text-slate-500">
                  <rect x="50" y="50" width="120" height="60" rx="10" fill="rgba(37,99,235,0.1)" stroke="currentColor" strokeWidth="2" />
                  <text x="110" y="85" textAnchor="middle" fill="white" className="text-xs font-bold">Users</text>
                  
                  <rect x="250" y="50" width="120" height="60" rx="10" fill="rgba(37,99,235,0.1)" stroke="currentColor" strokeWidth="2" />
                  <text x="310" y="85" textAnchor="middle" fill="white" className="text-xs font-bold">Customers</text>

                  <rect x="450" y="50" width="120" height="60" rx="10" fill="rgba(37,99,235,0.1)" stroke="currentColor" strokeWidth="2" />
                  <text x="510" y="85" textAnchor="middle" fill="white" className="text-xs font-bold">Orders</text>

                  <rect x="650" y="50" width="120" height="60" rx="10" fill="rgba(37,99,235,0.1)" stroke="currentColor" strokeWidth="2" />
                  <text x="710" y="85" textAnchor="middle" fill="white" className="text-xs font-bold">Invoices</text>

                  <rect x="450" y="200" width="120" height="60" rx="10" fill="rgba(37,99,235,0.1)" stroke="currentColor" strokeWidth="2" />
                  <text x="510" y="235" textAnchor="middle" fill="white" className="text-xs font-bold">Shipments</text>

                  <rect x="650" y="200" width="120" height="60" rx="10" fill="rgba(37,99,235,0.1)" stroke="currentColor" strokeWidth="2" />
                  <text x="710" y="235" textAnchor="middle" fill="white" className="text-xs font-bold">Tracking</text>

                  <rect x="250" y="350" width="120" height="60" rx="10" fill="rgba(37,99,235,0.1)" stroke="currentColor" strokeWidth="2" />
                  <text x="310" y="385" textAnchor="middle" fill="white" className="text-xs font-bold">Warehouses</text>

                  <rect x="450" y="350" width="120" height="60" rx="10" fill="rgba(37,99,235,0.1)" stroke="currentColor" strokeWidth="2" />
                  <text x="510" y="385" textAnchor="middle" fill="white" className="text-xs font-bold">Vehicles</text>

                  <rect x="650" y="350" width="120" height="60" rx="10" fill="rgba(37,99,235,0.1)" stroke="currentColor" strokeWidth="2" />
                  <text x="710" y="385" textAnchor="middle" fill="white" className="text-xs font-bold">Drivers</text>

                  {/* Lines */}
                  <line x1="170" y1="80" x2="250" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4" />
                  <line x1="370" y1="80" x2="450" y2="80" stroke="currentColor" strokeWidth="1" />
                  <line x1="570" y1="80" x2="650" y2="80" stroke="currentColor" strokeWidth="1" />
                  <line x1="510" y1="110" x2="510" y2="200" stroke="currentColor" strokeWidth="1" />
                  <line x1="570" y1="230" x2="650" y2="230" stroke="currentColor" strokeWidth="1" />
                  <line x1="510" y1="260" x2="510" y2="350" stroke="currentColor" strokeWidth="1" />
                  <line x1="570" y1="380" x2="650" y2="380" stroke="currentColor" strokeWidth="1" />
                  <line x1="370" y1="380" x2="450" y2="380" stroke="currentColor" strokeWidth="1" strokeDasharray="4" />
               </svg>
               <div className="absolute bottom-8 right-8 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                  Logical ERD v1.0
               </div>
            </div>
          </div>
        )}

        {activeView === 'sql' && (
          <div className="animate-in slide-in-from-right-10 duration-500">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="text-emerald-500">⌨️</span> Sample Operational SQL
            </h3>
            <pre className="bg-slate-950 p-8 rounded-3xl border border-slate-800 text-blue-300 font-mono text-sm leading-relaxed overflow-x-auto">
              {sampleSQL}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-blue-600/5 border border-blue-500/10 p-10 rounded-[3.5rem] flex flex-col md:row items-center gap-8">
        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-3xl">💾</div>
        <div>
           <h4 className="text-xl font-black text-blue-400 mb-2">Design Rationale</h4>
           <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-4xl">
             Our DBMS employs a 3rd Normal Form (3NF) relational structure to minimize data redundancy and ensure ACID properties across logistics transactions. 
             Indexes are optimized for <code>shipment_id</code> and <code>order_id</code> to support high-concurrency tracking queries, while partitioning is suggested for <code>TrackingHistory</code> as it scales horizontally.
           </p>
        </div>
      </div>
    </div>
  );
};

export default DatabasePage;
