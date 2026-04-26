import React from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

const BookingDetail = ({ booking, setPage, resources }) => {
  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <p className="text-gray-400 mb-4">No booking selected</p>
            <button onClick={() => setPage('lecturer')} className="text-primary font-bold">
              Return to Dashboard
            </button>
        </div>
    </div>
  );
  
    const resourceData = resources?.find(r => r.name === booking.resource);
  const capacity = resourceData?.capacity || 'N/A';
  
  const qrData = `UNIVERSITY BOOKING PASS\n-----------------------\nRESOURCE: ${booking.resource}\nLOCATION: ${booking.building}\nTIME: ${booking.date} | ${booking.time}\nLECTURER: ${booking.lecturer}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`;

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Booking_${booking.resource.replace(/\s+/g, '_')}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download QR code:', err);
      window.open(qrUrl, '_blank');
    }
  };
    
  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
         {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
        >
          <button 
            onClick={() => setPage('lecturer')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-all font-bold bg-white px-5 py-2.5 rounded-xl shadow-sm border border-gray-100"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          
          <div className="flex items-center gap-3">
             <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                booking.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' : 
                booking.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                'bg-red-50 text-red-600 border-red-100'
             }`}>
                {booking.status}
             </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden"
            >
              <div className="relative z-10">
                <h1 className="text-4xl font-black text-[#1e293b] mb-3 tracking-tight">{booking.resource}</h1>
                <div className="mb-10">
                    <span className="px-4 py-1.5 bg-[#f0f9ff] text-[#0ea5e9] text-[11px] font-black rounded-lg uppercase tracking-widest">
                        {resourceData?.type?.replace(' ', '_') || 'RESOURCE'}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { icon: <MapPin size={18} />, label: 'Location', value: booking.building || 'Main Campus' },
                        { icon: <Users size={18} />, label: 'Capacity', value: `${capacity} people` },
                        { icon: <Calendar size={18} />, label: 'Booking Date', value: booking.date },
                        { icon: <Clock size={18} />, label: 'Time Slot', value: booking.time },
                        { icon: <Calendar size={18} />, label: 'Created On', value: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : new Date().toLocaleDateString() }
                    ].map((item, index) => (
                        <div key={index} className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100 flex flex-col gap-1.5 transition-all hover:border-primary/20">
                            <div className="flex items-center gap-2">
                                <div className="text-primary opacity-70">
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                            </div>
                            <p className="text-sm font-bold text-[#334155]">{item.value}</p>
                        </div>
                    ))}


                    
                </div>
              </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-black text-[#1e293b] mb-4">Purpose</h3>
              <div className="bg-[#f8fafc] p-6 rounded-xl border border-gray-100 min-h-[80px] flex items-center">
                <p className="text-gray-500 font-medium italic">
                    {booking.purpose}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: QR Section */}
          <div className="space-y-8">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center"
            >
              <h3 className="text-lg font-black text-[#1e293b] mb-1">Booking QR</h3>
              <p className="text-[10px] text-gray-400 font-bold mb-6 uppercase tracking-widest">Use this QR at check-in</p>
              
              <div className="bg-[#f0fdff] p-6 rounded-2xl mb-6 flex justify-center border border-cyan-50">
                <img src={qrUrl} alt="Booking QR" className="w-48 aspect-square shadow-xl rounded-xl border-4 border-white" />
              </div>

              <button 
                onClick={handleDownloadQR}
                className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all mb-8"
              >
                <Download size={18} />
                Download QR
              </button>

              <div className="text-left bg-[#f8fafc] p-6 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">QR URL</span>
                <div className="bg-white p-3 rounded-xl border border-gray-100 break-all">
                    <p className="text-[9px] text-gray-400 font-mono leading-relaxed">
                        {`http://localhost:5173/user/bookings/${booking.id}/check-in`}
                    </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;