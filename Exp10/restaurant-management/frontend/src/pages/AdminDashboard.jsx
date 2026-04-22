import React, { useState, useEffect } from 'react';
import { getTables, addTable, getReservations, cancelReservation } from '../api';
import { Users, Hash, Clock, Plus, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [newTable, setNewTable] = useState({ tableNumber: '', seatingCapacity: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tablesData, resData] = await Promise.all([getTables(), getReservations()]);
      setTables(tablesData);
      setReservations(resData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        tableNumber: parseInt(newTable.tableNumber),
        seatingCapacity: parseInt(newTable.seatingCapacity)
      };
      await addTable(payload);
      setNewTable({ tableNumber: '', seatingCapacity: '' });
      fetchData(); // Refresh data
    } catch (error) {
      alert("Failed to add table. Number may already exist.");
    }
  };

  const handleCancelReservation = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await cancelReservation(id);
        fetchData(); // Refresh data
      } catch (error) {
        alert("Failed to cancel reservation.");
      }
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Manage your restaurant tables and view bookings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tables Section */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2" /> Add New Table
            </h2>
            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider pl-1 mb-1 block">Table Number</label>
                <input required type="number" min="1" value={newTable.tableNumber} onChange={e => setNewTable({...newTable, tableNumber: e.target.value})} className="input-field py-2" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider pl-1 mb-1 block">Seating Capacity</label>
                <input required type="number" min="1" max="20" value={newTable.seatingCapacity} onChange={e => setNewTable({...newTable, seatingCapacity: e.target.value})} className="input-field py-2" />
              </div>
              <button type="submit" className="btn-primary w-full py-2">Add Table</button>
            </form>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">All Tables ({tables.length})</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {tables.length === 0 ? <p className="text-slate-500 italic">No tables found.</p> : 
                tables.map(table => (
                  <div key={table.id} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white flex items-center"><Hash className="w-4 h-4 mr-1 text-primary"/> {table.tableNumber}</div>
                    </div>
                    <div className="flex items-center text-slate-300 bg-slate-800 px-3 py-1 rounded-full text-sm">
                      <Users className="w-4 h-4 mr-2 text-accent"/> {table.seatingCapacity} seats
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Reservations Section */}
        <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-2xl h-fit">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Reservations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-sm tracking-wider">
                  <th className="pb-3 px-2 font-medium">Customer</th>
                  <th className="pb-3 px-2 font-medium">Contact</th>
                  <th className="pb-3 px-2 font-medium">Table</th>
                  <th className="pb-3 px-2 font-medium">Date & Time</th>
                  <th className="pb-3 px-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {reservations.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-slate-500 italic">No reservations booked yet.</td></tr>
                ) : (
                  reservations.map(res => (
                    <tr key={res.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-2">
                        <div className="font-medium text-white">{res.customerName}</div>
                        <div className="text-xs text-slate-400 flex items-center mt-1">
                          <Users className="w-3 h-3 mr-1"/> {res.numberOfGuests} guests
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm text-slate-300">
                        <div>{res.customerEmail}</div>
                        <div className="text-xs text-slate-500">{res.customerPhone}</div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          Table {res.restaurantTable?.tableNumber || '?'}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-sm">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-slate-400"/>
                          {new Date(res.reservationTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button 
                          onClick={() => handleCancelReservation(res.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Cancel Reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
