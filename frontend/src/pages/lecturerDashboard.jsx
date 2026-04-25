import React, { useState, useEffect } from 'react';

import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Ticket,
  LogOut,
  Search,
  Bell,
  User,
  Plus,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  MapPin,
  Users,
  Video,
  Camera,
  Monitor,
  Zap,
  Mic,
  Cpu,
  Wifi,
  Settings2,
  School,
  Layers,
  Filter,
  Eraser,
  MessageSquare,
  Wrench,
  QrCode,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const lecturerDashboard = ({ setPage, user, setUser, setSelectedBooking, setResourcesList }) => {
  const userName = user?.name || (typeof user === 'string' ? user : 'Guest Lecturer');

  // Added ticket state management
  //
  const [activeTab, setActiveTab] = useState('My Tickets');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const timeSlots = [
    '8.00 A.M- 9.00 A.M', '9.00 A.M- 10.00 A.M', '10.00 A.M- 11.00 A.M',
    '11.00 A.M- 12.00 P.M', '12.00 P.M- 1.00 P.M', '1.00 P.M- 2.00 P.M',
    '2.00 P.M- 3.00 P.M', '3.00 P.M- 4.00 P.M', '4.00 P.M- 5.00 P.M',
    '5.00 P.M- 6.00 P.M', '6.00 P.M- 7.00 P.M', '7.00 P.M- 8.00 P.M'
  ];

  const filteredBookings = myBookings.filter((b) =>
    b.resource?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

   // Dynamic Data
  const [myBookings, setMyBookings] = useState([]); //yasith
  const [resources, setResources] = useState([]);
  const [buildings, setBuildings] = useState([]);





  const [showSuccess, setShowSuccess] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || (typeof user === 'string' ? user : ''));
  const [profilePassword, setProfilePassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) {
       setProfileMsg('Error: Cannot update user lacking ID (Guest logged in).');
       return;
    }
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const updatedUser = { ...user, name: profileName, password: profilePassword };
      const res = await fetch(`http://localhost:8081/api/lecturers/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      if (res.ok) {
        const data = await res.json();
        if (setUser) setUser(data);
        setProfileMsg('Profile updated successfully!');
        setTimeout(() => setShowProfileModal(false), 2000);
      } else {
        setProfileMsg('Failed to update profile.');
      }
    } catch (err) {
      setProfileMsg('Error updating profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Added API integration for notifications and lecturer tickets

 


  useEffect(() => {

        fetch('http://localhost:8081/api/bookings')
      .then(res => res.json())
      .then(data => setMyBookings(data))
      .catch(console.error);

      fetch(`http://localhost:8081/api/tickets/lecturer/${userName}`)
      .then(res => res.json())
      .then(setTickets)
      .catch(console.error);
    // Initial notifications fetch
    fetch(`http://localhost:8081/api/notifications/user/${userName}`)
      .then(res => res.json())
      .then(setNotifications)
      .catch(console.error);

    // Polling for notifications every 30s
    const nInterval = setInterval(() => {
      fetch(`http://localhost:8081/api/notifications/user/${userName}`)
        .then(res => res.json())
        .then(setNotifications)
        .catch(console.error);
    }, 30000);

    return () => clearInterval(nInterval);
  }, [userName]);

 // Added ticket searching and ongoing ticket filtering
  
  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase();

    return (
      (t.issue || '').toLowerCase().includes(q) ||
      (t.issueDesc || '').toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q) ||
      (t.resource || '').toLowerCase().includes(q) ||
      (t.course || '').toLowerCase().includes(q) ||
      (t.status || '').toLowerCase().includes(q)
    );
  });

  const ongoingTickets = tickets
    .filter(t =>
       t.status === 'IN PROGRESS' ||
      t.status === 'ASSIGNED' ||
      t.status === 'OPEN'
    )
    .filter((t) => {
      const q = searchQuery.toLowerCase();

      return (
        (t.issue || '').toLowerCase().includes(q) ||
        (t.issueDesc || '').toLowerCase().includes(q) ||
        (t.resource || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.course || '').toLowerCase().includes(q)
      );
    }); 


 const handleCancelBooking = async (id) => {
    const bookingToUpdate = myBookings.find(b => b.id === id);
    if (!bookingToUpdate) return;
    try {
      const res = await fetch(`http://localhost:8081/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...bookingToUpdate, status: 'CANCELLED' })
      });
      const data = await res.json();
      setMyBookings(myBookings.map(b => b.id === id ? data : b));
    } catch (err) { console.error(err); }
  };



  const handleMarkRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:8081/api/notifications/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) { console.error(err); }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/notifications/user/${userName}/read-all`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (err) { console.error(err); }
  };

   const StatusBadge = ({ status }) => {
    const styles = {
      PENDING: 'bg-yellow-50 text-yellow-600 border-yellow-100',
      APPROVED: 'bg-green-50 text-green-600 border-green-100',
      REJECTED: 'bg-red-50 text-red-600 border-red-100',
      CANCELLED: 'bg-gray-50 text-gray-500 border-gray-100',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}>
        {status}
      </span>
    );
  };
  

  const handleDownloadQR = async (booking) => {
    // Ensure all data points are present to avoid 'undefined' in QR
    const loc = booking.resource || 'Resource';
    const bld = booking.building || 'Campus';
    const dt = booking.date || 'No Date';
    const tm = booking.time || 'No Time';
    const lect = booking.lecturer || 'Lecturer';

    // Simplified format for better scanner compatibility
    const qrData = `UNIVERSITY BOOKING PASS\n-----------------------\nRESOURCE: ${loc}\nLOCATION: ${bld}\nTIME: ${dt} | ${tm}\nLECTURER: ${lect}`;
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}`;

    try {
      const response = await fetch(qrUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Booking_${loc.replace(/\s+/g, '_')}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download QR code:', err);
      // Fallback: Open in new tab if download fails
      window.open(qrUrl, '_blank');
    }
  };




 // Added raise ticket feature
  const handleRaiseTicket = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const newTicket = {
      lecturer: formData.get('lecturer'),
      course: formData.get('course'),
      resource: formData.get('hall'),
      category: formData.get('category'),
      issue: formData.get('issueTitle'),
      issueDesc: formData.get('issueDesc'),
      priority: formData.get('priority'),
      status: 'OPEN',
      progressStatus: 'Not Started',
    };

    try {
      const res = await fetch('http://localhost:8081/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTicket),
      });

      const data = await res.json();
      setTickets([data, ...tickets]);
      setShowSuccess(true);
      e.target.reset();
      setTimeout(() => setShowSuccess(false), 3000);
      setActiveTab('My Tickets');
    } catch (err) {
      console.error(err);
    }
  };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#f9fafb] flex font-sans">

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        {/* Header Area */}
        <header className="flex items-center justify-between mb-10 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100/50">

          <div className="flex items-center gap-5">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-12 h-12 flex items-center justify-center bg-white border rounded-2xl text-gray-400 hover:text-primary transition-all relative ${showNotifications ? 'border-primary ring-4 ring-primary/5' : 'border-gray-100'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Bell size={16} className="text-primary" />
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-200">
                             <Bell size={20} />
                          </div>
                          <p className="text-sm font-bold text-gray-400 italic">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {notifications.map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                if (!n.read) handleMarkRead(n.id);
                                const type = n.type?.toUpperCase();
                                if (type === 'BOOKING') {
                                  setActiveTab('My Bookings');
                                  setShowNotifications(false);
                                } else if (type === 'TICKET') {
                                  setActiveTab('My Tickets');
                                  setShowNotifications(false);
                                } else if (type === 'COMMENTS') {
                                  setActiveTab('Ongoing Tickets');
                                  setShowNotifications(false);
                                }
                              }}
                              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${!n.read ? 'bg-primary/[0.02]' : ''}`}
                            >
                              {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full"></div>}
                              <div className="flex flex-col gap-1 ml-2">
                                <div className="flex items-center justify-between">
                                  <p className={`text-[10px] font-black uppercase tracking-widest ${n.read ? 'text-gray-300' : 'text-primary'}`}>{n.type}</p>
                                  <p className="text-[9px] font-bold text-gray-300 italic">{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <p className={`text-xs leading-relaxed ${n.read ? 'text-gray-400 font-medium' : 'text-gray-700 font-bold'}`}>{n.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 bg-white border border-gray-100 p-2 pr-6 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{userName}</p>
                <p className="text-[10px] text-primary font-bold">Edit Profile</p>
              </div>
            </button>
          </div>
        </header>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full p-2"><X size={16} /></button>
            <h3 className="text-xl font-bold mb-6 text-gray-900">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Display Name</label>
                <input required type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Password</label>
                <input required type="password" value={profilePassword} onChange={(e) => setProfilePassword(e.target.value)} placeholder="Enter new password" className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold" />
              </div>
              {profileMsg && <p className={`text-xs font-bold mt-2 ${profileMsg.includes('Error') || profileMsg.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>{profileMsg}</p>}
              <button disabled={profileLoading} type="submit" className="w-full bg-primary text-white font-bold py-3 mt-4 rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90">{profileLoading ? 'Updating...' : 'Save Profile'}</button>
            </form>
          </motion.div>
        </div>
      )}
      
      {activeTab === 'Booking Resources' && (
                <div className="space-y-10">
                  <div className="mt-12 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <Filter size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Filter Resources</h3>
                      </div>
                      <button
                        onClick={() => setFilters({
                          buildingId: '',
                          capacityRange: '',
                          windowRange: '',
                          hallCategory: '',
                          facility: '',
                          date: new Date().toISOString().split('T')[0],
                          selectedSlots: []
                        })}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Eraser size={14} />
                        Clear All Filters
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {/* Building Filter */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Building</label>
                        <select
                          value={filters.buildingId}
                          onChange={(e) => setFilters({ ...filters, buildingId: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-bold appearance-none cursor-pointer"
                        >
                          <option value="">All Buildings</option>
                          {buildings.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Hall Category Filter */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Hall Category</label>
                        <select
                          value={filters.hallCategory}
                          onChange={(e) => setFilters({ ...filters, hallCategory: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-bold appearance-none cursor-pointer"
                        >
                          <option value="">All Categories</option>
                          <option value="Lecture Hall">Lecture Hall</option>
                          <option value="Lab Room">Lab Room</option>
                          <option value="Meeting Room">Meeting Room</option>
                        </select>
                      </div>

                      {/* Capacity Filter */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Capacity</label>
                        <select
                          value={filters.capacityRange}
                          onChange={(e) => setFilters({ ...filters, capacityRange: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-bold appearance-none cursor-pointer"
                        >
                          <option value="">Any Capacity</option>
                          <option value="20-30">20 - 30</option>
                          <option value="30-60">30 - 60</option>
                          <option value="60-100">60 - 100</option>
                          <option value="100-150">100 - 150</option>
                          <option value="150-200">150 - 200</option>
                        </select>
                      </div>

                      {/* Window Filter */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Windows</label>
                        <select
                          value={filters.windowRange}
                          onChange={(e) => setFilters({ ...filters, windowRange: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-bold appearance-none cursor-pointer"
                        >
                          <option value="">Any Windows</option>
                          <option value="5-10">5 - 10</option>
                          <option value="10-15">10 - 15</option>
                          <option value="15-20">15 - 20</option>
                        </select>
                      </div>

                      {/* Facility Filter */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Facilities</label>
                        <select
                          value={filters.facility}
                          onChange={(e) => setFilters({ ...filters, facility: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-bold appearance-none cursor-pointer"
                        >
                          <option value="">All Facilities</option>
                          <option value="Multimedia Projector">Multimedia Projector</option>
                          <option value="Recording Camera">Recording Cameras</option>
                          <option value="Smart Screen">Smart Screen</option>
                          <option value="All Equipment">All Equipment</option>
                        </select>
                      </div>
                    </div>




                    {/* Date and Time Selection */}
                    <div className="mt-10 pt-10 border-t border-gray-50 flex flex-col lg:flex-row gap-10">
                      {/* Date Selection */}
                      <div className="w-full lg:w-1/4 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={14} className="text-primary" />
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Date</label>
                        </div>
                        <input
                          type="date"
                          value={filters.date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold cursor-pointer"
                        />
                      </div>

                      {/* Time Slots Selection */}
                      <div className="w-full lg:w-3/4 space-y-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-primary" />
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Time Slots</label>
                          </div>
                          <span className="text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">{filters.selectedSlots.length} Selected</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                          {timeSlots.map((slot) => {
                            const isSelected = filters.selectedSlots.includes(slot);
                            return (
                              <button
                                key={slot}
                                onClick={() => {
                                  const newSlots = isSelected
                                    ? filters.selectedSlots.filter(s => s !== slot)
                                    : [...filters.selectedSlots, slot];
                                  setFilters({ ...filters, selectedSlots: newSlots });
                                }}
                                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all group ${isSelected
                                  ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-[0.98]'
                                  : 'bg-white border-gray-100 hover:border-primary/30 hover:bg-gray-50'
                                  }`}
                              >
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected
                                  ? 'bg-white border-white'
                                  : 'bg-gray-50 border-gray-200 group-hover:border-primary/50'
                                  }`}>
                                  {isSelected && <CheckCircle2 size={12} className="text-primary" />}
                                </div>
                                <span className={`text-[11px] font-bold transition-colors ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                  {slot}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 border-l-4 border-primary pl-4">Available Specific Resources</h3>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">{filteredResources.length} Results Found</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResources.map((res) => (
                        <div key={res.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-primary transition-all duration-500"></div>

                          <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-white transition-all">
                              {getResourceIcon(res.type)}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${res.status === 'AVAILABLE' ? 'bg-green-50/80 text-green-600 border-green-100' : (res.status === 'MAINTENANCE' || res.status === 'OUT OF SERVICE') ? 'bg-red-50/80 text-red-600 border-red-100' : 'bg-orange-50/80 text-orange-600 border-orange-100'}`}>
                              {res.status === 'MAINTENANCE' ? 'OUT OF SERVICE' : res.status || 'AVAILABLE'}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">{res.name}</h3>
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-6 relative z-10">{res.type}</p>

                          <div className="flex items-center gap-6 mb-8 relative z-10">
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-primary" />
                              <span className="text-xs font-bold text-gray-600">{res.capacity} Seats</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-primary" />
                              <span className="text-xs font-bold text-gray-600">{buildings.find(b => b.id === res.buildingId)?.name || 'Main Campus'}</span>
                            </div>
                          </div>

                          {/* Resource Stats */}
                          <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-gray-400 uppercase">Windows</span>
                              <span className="text-xs font-black text-gray-700">{res.windows} Units</span>
                            </div>
                            <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 flex flex-col gap-1">
                              <span className="text-[9px] font-bold text-gray-400 uppercase">Floor</span>
                              <span className="text-xs font-black text-gray-700">{res.floor || 'G-Floor'}</span>
                            </div>
                          </div>

                          {/* Countdown Timer for Out of Service */}
                          {(res.status?.toUpperCase().replace('_', ' ') === 'OUT OF SERVICE' || res.status?.toUpperCase() === 'MAINTENANCE') && (
                            res.estimatedResolveTime ? (
                              <CountdownTimer targetDate={res.estimatedResolveTime} />
                            ) : (
                              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2">
                                <Info size={16} className="text-gray-400" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recovery time not set</span>
                              </div>
                            )
                          )}
                           

                           //yasith
                          <button
                            disabled={res.status === 'MAINTENANCE' || res.status === 'OUT OF SERVICE' || res.status === 'OUT_OF_SERVICE'}

            
                            onClick={async () => {
                              if (filters.selectedSlots.length === 0) {
                                alert("Please select at least one time slot before booking.");
                                return;
                              }
                              const newBooking = {
                                resource: res.name,
                                date: filters.date,
                                time: filters.selectedSlots.join(', '),
                                purpose: 'For Lecture',
                                status: 'PENDING',
                                building: buildings.find(b => b.id === res.buildingId)?.name || 'Main Campus',
                                lecturer: userName
                              };
                              try {
                                const response = await fetch('http://localhost:8081/api/bookings', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(newBooking)
                                });
                                const data = await response.json();
                                setMyBookings([data, ...myBookings]);
                                setActiveTab('My Bookings');
                              } catch (err) { console.error(err); }
                            }}
                            className={`w-full font-bold py-4 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 shadow-sm ${(res.status === 'MAINTENANCE' || res.status === 'OUT OF SERVICE') ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-opacity-90 shadow-primary/10 shadow-lg'}`}
                          >
                            {(res.status === 'MAINTENANCE' || res.status === 'OUT OF SERVICE') ? 'Out Of Service' : (
                              <>
                                <Plus size={18} />
                                Book This Hall
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              


    </div>
  );
};

export default lecturerDashboard;
