import React, { useState, useEffect } from 'react';
import { getTables, createReservation } from '../api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ReservationPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    tableId: '',
    reservationTime: '',
    numberOfGuests: 1
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const data = await getTables();
      setTables(data);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Processing your reservation...' });
    
    // Find selected table
    const selectedTable = tables.find(t => t.id === parseInt(formData.tableId));
    
    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      reservationTime: new Date(formData.reservationTime).toISOString(),
      numberOfGuests: parseInt(formData.numberOfGuests),
      restaurantTable: selectedTable
    };

    try {
      await createReservation(payload);
      setStatus({ type: 'success', message: 'Reservation confirmed successfully! We look forward to seeing you.' });
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        tableId: '',
        reservationTime: '',
        numberOfGuests: 1
      });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to make reservation.' });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading available tables...</div>;
  }

  return (
    <div className="flex flex-col mx-auto max-w-4xl py-12 px-4 animate-fade-in">
      <div className="glass-panel p-8 md:p-10 rounded-2xl w-full">
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl font-bold text-white mb-3">Reserve a Table</h2>
          <p className="text-slate-300 max-w-lg mx-auto">Fill in the details below to secure your spot for a delightful culinary experience.</p>
        </div>

        {status.message && (
          <div className={`p-4 rounded-xl mb-8 flex items-start space-x-3 backdrop-blur-sm ${
            status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 
            status.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 
            'bg-blue-500/10 border border-blue-500/20 text-blue-400'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <span className="font-medium">{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
              <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="input-field" placeholder="John Doe" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="input-field" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Phone Number</label>
              <input required type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="input-field" placeholder="+1 (555) 000-0000" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Number of Guests</label>
              <input required type="number" min="1" max="20" name="numberOfGuests" value={formData.numberOfGuests} onChange={handleChange} className="input-field" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Date & Time</label>
              <input required type="datetime-local" name="reservationTime" value={formData.reservationTime} onChange={handleChange} className="input-field" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Select Table</label>
              <select required name="tableId" value={formData.tableId} onChange={handleChange} className="input-field appearance-none bg-slate-800">
                <option value="" disabled className="text-slate-500">Choose a table...</option>
                {tables.map(table => (
                  <option key={table.id} value={table.id}>
                    Table {table.tableNumber} (Seats {table.seatingCapacity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="btn-primary w-full py-3 text-lg" disabled={status.type === 'loading'}>
              {status.type === 'loading' ? 'Confirming...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationPage;
