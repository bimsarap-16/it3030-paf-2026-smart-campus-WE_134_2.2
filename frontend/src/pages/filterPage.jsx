import React, { useState } from 'react';
import { Calendar as CalendarIcon, Users, Monitor, MapPin, Search, ChevronRight, X, Filter, School } from 'lucide-react';

const filterPage = ({ setPage }) => {
  // Dummy Data
  const rooms = [
    { id: 1, title: 'Grand Lecture Hall', category: 'Lecture Hall', capacity: 120, windows: 20, time: '8:30 A.M - 9:30 A.M', date: '2026-03-27', image: 'bg-primary/10', purpose: ['For Lecture', 'For Exam'] },
    { id: 2, title: 'Interactive Studio', category: 'Lab Room', capacity: 25, windows: 8, time: '10:30 A.M - 11:30 A.M', date: '2026-03-27', image: 'bg-emerald-50', purpose: ['For Lecture'] },
    { id: 3, title: 'Strategic Meeting Suite', category: 'Meeting Room', capacity: 15, windows: 6, time: '1:30 P.M - 2:30 P.M', date: '2026-03-28', image: 'bg-green-50', purpose: ['For Meeting'] },
    { id: 4, title: 'Innovation Lab', category: 'Lab Room', capacity: 45, windows: 12, time: '9:30 A.M - 10:30 A.M', date: '2026-03-27', image: 'bg-lime-50', purpose: ['For Meeting', 'For Lecture'] },
    { id: 5, title: 'Executive Boardroom', category: 'Meeting Room', capacity: 10, windows: 5, time: '2:30 P.M - 3:30 P.M', date: '2026-03-29', image: 'bg-orange-50', purpose: ['For Meeting'] },
    { id: 6, title: 'Science Auditorium', category: 'Lecture Hall', capacity: 150, windows: 25, time: '7:30 A.M - 8:30 A.M', date: '2026-03-27', image: 'bg-red-50', purpose: ['For Lecture', 'For Exam'] },
    { id: 7, title: 'Computing Center', category: 'Lab Room', capacity: 35, windows: 10, time: '11:30 A.M - 12:30 P.M', date: '2026-03-30', image: 'bg-teal-50', purpose: ['For Lecture'] },
    { id: 8, title: 'Faculty Seminar Room', category: 'Meeting Room', capacity: 30, windows: 8, time: '4:30 P.M - 5:30 P.M', date: '2026-03-27', image: 'bg-emerald-50', purpose: ['For Meeting', 'For Exam'] },
  ];

  // Filter States
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [selectedWindows, setSelectedWindows] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Filter Options
  const purposeOptions = ['For Lecture', 'For Exam', 'For Meeting'];
  const capacityOptions = ['0 - 20', '20 - 30', '30 - 40', '40 - 100', '100 - 150'];
  const windowOptions = ['5 - 10', '10 - 15', '15 - 30'];
  const timeOptions = [
    '7:30 A.M - 8:30 A.M', '8:30 A.M - 9:30 A.M', '9:30 A.M - 10:30 A.M', 
    '10:30 A.M - 11:30 A.M', '11:30 A.M - 12:30 P.M', '12:30 P.M - 1:30 P.M',
    '1:30 P.M - 2:30 P.M', '2:30 P.M - 3:30 P.M', '3:30 P.M - 4:30 P.M',
    '4:30 P.M - 5:30 P.M', '5:30 P.M - 6:30 P.M', '6:30 P.M - 7:30 P.M',
    '7:30 P.M - 8:30 P.M'
  ];

  const handleCheckboxChange = (option, selectedList, setSelectedList) => {
    if (selectedList.includes(option)) {
      setSelectedList(selectedList.filter(item => item !== option));
    } else {
      setSelectedList([...selectedList, option]);
    }
  };

  const isCapacityMatch = (capacity, range) => {
    const [min, max] = range.split(' - ').map(Number);
    return capacity >= min && capacity < max;
  };

  const isWindowMatch = (windows, range) => {
    const [min, max] = range.split(' - ').map(Number);
    return windows >= min && windows < max;
  };

  // Filtering Logic
  const filteredRooms = rooms.filter(room => {
    const capacityMatch = !selectedCapacity || isCapacityMatch(room.capacity, selectedCapacity);
    const windowMatch = selectedWindows.length === 0 || selectedWindows.some(range => isWindowMatch(room.windows, range));
    const timeMatch = selectedTimes.length === 0 || selectedTimes.includes(room.time);
    const dateMatch = !selectedDate || room.date === selectedDate;
    
    return capacityMatch && windowMatch && timeMatch && dateMatch;
  });

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans lg:flex">
      {/* Left Sidebar Filter Panel */}
      <aside className="lg:w-80 w-full bg-gray-50 border-r border-gray-100 p-8 lg:h-screen lg:overflow-y-auto lg:sticky lg:top-0">
        <div className="flex items-center gap-2 mb-8 text-primary font-bold text-2xl uppercase tracking-tighter">
          <Filter size={24} />
          <span>Filter</span>
        </div>

        {/* 1. Seat Capacity */}
        <section className="mb-8 border-b border-gray-100 pb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={18} className="text-primary" />
            Seat Capacity
          </h3>
          <div className="space-y-3">
            {capacityOptions.map(option => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer"
                  checked={selectedCapacity === option}
                  onChange={() => setSelectedCapacity(selectedCapacity === option ? null : option)}
                />
                <span className="text-gray-600 group-hover:text-primary transition-colors">{option} Seats</span>
              </label>
            ))}
          </div>
        </section>

        {/* 2. Windows */}
        <section className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Monitor size={18} className="text-primary" />
            Windows
          </h3>
          <div className="space-y-3">
            {windowOptions.map(option => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer"
                  checked={selectedWindows.includes(option)}
                  onChange={() => handleCheckboxChange(option, selectedWindows, setSelectedWindows)}
                />
                <span className="text-gray-600 group-hover:text-primary transition-colors">{option} Windows</span>
              </label>
            ))}
          </div>
        </section>

        {/* 3. Time */}
        <section className="mb-8 border-t border-gray-200 pt-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon size={18} className="text-primary" />
            Time
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {timeOptions.map(option => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer"
                  checked={selectedTimes.includes(option)}
                  onChange={() => handleCheckboxChange(option, selectedTimes, setSelectedTimes)}
                />
                <span className="text-xs text-gray-600 group-hover:text-primary transition-colors">{option}</span>
              </label>
            ))}
          </div>
        </section>

        {/* 4. Date */}
        <section className="border-t border-gray-200 pt-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon size={18} className="text-primary" />
            Select Date
          </h3>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-gray-600"
          />
        </section>
      </aside>






      
      </div>

      );


  



  };
