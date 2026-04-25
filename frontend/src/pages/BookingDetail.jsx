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

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* content will be added later */}
      </div>
    </div>
  );
};

export default BookingDetail;