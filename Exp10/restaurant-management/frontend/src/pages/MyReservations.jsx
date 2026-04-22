import React, { useState, useEffect } from 'react';
import { getMyReservations, cancelReservation, updateReservation, getTables } from '../api';
import { Clock, Trash2, Edit2, Users, CheckCircle2, X } from 'lucide-react';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Edit Form State
  const [editData, setEditData] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    tableId: '', reservationTime: '', numberOfGuests: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resData, tabData] = await Promise.all([getMyReservations(), getTables()]);
      setReservations(resData);
      setTables(tabData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await cancelReservation(id);
        fetchData();
      } catch (error) {
        alert("Failed to cancel reservation.");
      }
    }
  };

  const startEditing = (res) => {
    // Convert to datetime-local format string (YYYY-MM-DDTHH:MM)
    const d = new Date(res.reservationTime);
    const tzoffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(d - tzoffset)).toISOString().slice(0, 16);

    setEditData({
      customerName: res.customerName,
      customerEmail: res.customerEmail,
      customerPhone: res.customerPhone,
      tableId: res.restaurantTable ? res.restaurantTable.id : '',
      reservationTime: localISOTime,
      numberOfGuests: res.numberOfGuests
    });
    setEditingId(res.id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const selectedTable = tables.find(t => t.id === parseInt(editData.tableId));
      const payload = {
        customerName: editData.customerName,
        customerEmail: editData.customerEmail,
        customerPhone: editData.customerPhone,
        reservationTime: new Date(editData.reservationTime).toISOString(),
        numberOfGuests: parseInt(editData.numberOfGuests),
        restaurantTable: selectedTable
      };

      await updateReservation(editingId, payload);
      setEditingId(null);
      fetchData();
    } catch (error) {
      alert("Failed to update reservation: " + error.message);
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading your reservations...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-fade-in relative">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold text-white mb-2">My Reservations</h1>
        <p className="text-slate-400">View and manage your upcoming dining experiences.</p>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-2xl h-fit">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 text-sm tracking-wider">
                <th className="pb-3 px-2 font-medium">Guest Details</th>
                <th className="pb-3 px-2 font-medium">Table & Party</th>
                <th className="pb-3 px-2 font-medium">Date & Time</th>
                <th className="pb-3 px-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {reservations.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-slate-500 italic">You don't have any reservations yet.</td></tr>
              ) : (
                reservations.map(res => (
                  <tr key={res.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-2">
                      <div className="font-medium text-white">{res.customerName}</div>
                      <div className="text-sm text-slate-400 mt-1">{res.customerEmail}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          Table {res.restaurantTable?.tableNumber || '?'}
                        </span>
                        <div className="text-xs text-slate-400 flex items-center mt-1">
                          <Users className="w-3 h-3 mr-1"/> {res.numberOfGuests} guests
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-sm">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-slate-400"/>
                        {new Date(res.reservationTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => startEditing(res)} className="p-2 text-accent hover:text-white hover:bg-accent/20 rounded-lg transition-colors cursor-pointer" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleCancel(res.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer" title="Cancel">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel p-8 rounded-2xl w-full max-w-lg relative animate-fade-in">
            <button onClick={() => setEditingId(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-bold text-white mb-6">Modify Reservation</h2>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase">Name</label>
                  <input required type="text" value={editData.customerName} onChange={e => setEditData({...editData, customerName: e.target.value})} className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase">Email</label>
                  <input required type="email" value={editData.customerEmail} onChange={e => setEditData({...editData, customerEmail: e.target.value})} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase">Phone</label>
                  <input required type="tel" value={editData.customerPhone} onChange={e => setEditData({...editData, customerPhone: e.target.value})} className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 uppercase">Guests</label>
                  <input required type="number" min="1" max="20" value={editData.numberOfGuests} onChange={e => setEditData({...editData, numberOfGuests: e.target.value})} className="input-field" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase">Date & Time</label>
                <input required type="datetime-local" value={editData.reservationTime} onChange={e => setEditData({...editData, reservationTime: e.target.value})} className="input-field" />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 uppercase">Select Table</label>
                <select required value={editData.tableId} onChange={e => setEditData({...editData, tableId: e.target.value})} className="input-field bg-slate-800">
                  <option value="" disabled>Choose a table...</option>
                  {tables.map(table => (
                    <option key={table.id} value={table.id}>Table {table.tableNumber} (Seats {table.seatingCapacity})</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary w-full py-3 mt-4">Save Changes</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyReservations;
