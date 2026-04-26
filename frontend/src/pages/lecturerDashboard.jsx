import React, { useState, useEffect } from 'react';
import TicketDetailModal from '../components/TicketDetailModal';

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

const getResourceIcon = (type) => {
  switch (type?.toUpperCase()) {
    case 'LAB ROOM': return <Cpu size={24} />;
    case 'LECTURE HALL': return <BookOpen size={24} />;
    case 'MEETING ROOM': return <Zap size={24} />;
    default: return <LayoutDashboard size={24} />;
  }
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) return null;

      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (!remaining) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return (
    <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2">
      <CheckCircle2 size={16} className="text-emerald-500" />
      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Recovery Imminent...</span>
    </div>
  );

  return (
    <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100">
      <div className="flex items-center justify-between mb-2">
         <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Estimated Recovery In</span>
         <Clock size={14} className="text-red-400 animate-pulse" />
      </div>
      <div className="flex gap-2">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center flex-1 bg-white/50 rounded-xl py-2 border border-red-100/50">
            <span className="text-sm font-black text-red-600">{value}</span>
            <span className="text-[8px] font-bold text-red-400 uppercase">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};




const lecturerDashboard = ({ setPage, user, setUser, setSelectedBooking, setResources : setResourcesProp }) => {
  const userName = user?.name || (typeof user === 'string' ? user : 'Guest Lecturer');
   const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || (typeof user === 'string' ? user : ''));
  const [profilePassword, setProfilePassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('lecturerNotificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

 useEffect(() => {
    localStorage.setItem('lecturerNotificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

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

  
  // Added ticket state management
  
  const [activeTab, setActiveTab] = useState('Booking Resources');
  const [showSuccess, setShowSuccess] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); 

  

  

   // Dynamic Data
  const [myBookings, setMyBookings] = useState([]);  
  const [resources, setResources] = useState([]);
  const [buildings, setBuildings] = useState([]);

  // Filter State
  const [filters, setFilters] = useState({
    buildingId: '',
    capacityRange: '',
    windowRange: '',
    hallCategory: '',
    facility: '',
    date: new Date().toISOString().split('T')[0],
    selectedSlots: []
  });

  const timeSlots = [
    '8.00 A.M- 9.00 A.M', '9.00 A.M- 10.00 A.M', '10.00 A.M- 11.00 A.M',
    '11.00 A.M- 12.00 P.M', '12.00 P.M- 1.00 P.M', '1.00 P.M- 2.00 P.M',
    '2.00 P.M- 3.00 P.M', '3.00 P.M- 4.00 P.M', '4.00 P.M- 5.00 P.M',
    '5.00 P.M- 6.00 P.M', '6.00 P.M- 7.00 P.M', '7.00 P.M- 8.00 P.M'
  ];
 
   // Catalog State
  const [searchQuery, setSearchQuery] = useState('');

  //  BOOKINGS SEARCH FILTER
  const filteredBookings = myBookings.filter((b) =>
    b.resource?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //  ALL TICKETS SEARCH FILTER
  const query = searchQuery?.toLowerCase() || "";

const filteredTickets = (Array.isArray(tickets) ? tickets : []).filter((t) =>
  t.issue?.toLowerCase().includes(query) ||
  t.issueDesc?.toLowerCase().includes(query) ||
  t.category?.toLowerCase().includes(query) ||
  t.resource?.toLowerCase().includes(query) ||
  t.course?.toLowerCase().includes(query)
);

    //  ONGOING TICKETS FILTER
 const ongoingTickets = (Array.isArray(tickets) ? tickets : [])
  .filter(t =>
    t.status === 'IN PROGRESS' ||
    t.status === 'ASSIGNED' ||
    t.status === 'OPEN'
  )
  .filter((t) => {
    const query = searchQuery?.toLowerCase() || "";
    return (
      t.issue?.toLowerCase().includes(query) ||
      t.issueDesc?.toLowerCase().includes(query) ||
      t.resource?.toLowerCase().includes(query) ||
      t.category?.toLowerCase().includes(query) ||
      t.course?.toLowerCase().includes(query)
    );
  });

    // Combined Filtered Resources
  const filteredResources = resources.filter(res => {
    // Search Query filter
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.type.toLowerCase().includes(searchQuery.toLowerCase());

    // Building filter
    const matchesBuilding = !filters.buildingId || res.buildingId === filters.buildingId;

    // Capacity filter
    let matchesCapacity = true;
    if (filters.capacityRange) {
      const [min, max] = filters.capacityRange.split('-').map(Number);
      matchesCapacity = res.capacity >= min && res.capacity <= max;
    }

    // Window filter
    let matchesWindow = true;
    if (filters.windowRange) {
      const [min, max] = filters.windowRange.split('-').map(Number);
      matchesWindow = res.windows >= min && res.windows <= max;
    }

    // Hall Category filter
    const matchesCategory = !filters.hallCategory || res.type === filters.hallCategory;

    // Facility filter
    const matchesFacility = !filters.facility ||
      (res.features && res.features.toLowerCase().includes(filters.facility.toLowerCase()));

    // Availability filter
    let matchesAvailability = true;
    if (filters.selectedSlots.length > 0) {
      const isBooked = myBookings.some(b => 
        b.resource === res.name && 
        b.status === 'APPROVED' && 
        b.date === filters.date && 
        filters.selectedSlots.some(slot => b.time?.includes(slot))
      );
      matchesAvailability = !isBooked;
    }

    return matchesSearch && matchesBuilding && matchesCapacity && matchesWindow && matchesCategory && matchesFacility && matchesAvailability;
  });


   const handleBookResource = async (res) => {
    const newBooking = {
      resource: res.name,
      date: new Date().toISOString().split('T')[0],
      time: '10:30 A.M - 12:30 P.M',
      purpose: 'For Lecture',
      status: 'PENDING',
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
  };

   const getResponseTime = (ticket) => {
    try {
      if (!ticket.respondedAt) return null;
      const raisedTime = ticket.id && ticket.id.length === 24 
        ? parseInt(ticket.id.substring(0, 8), 16) * 1000 
        : null;
      
      if (!raisedTime) return null;
      
      const respondedTime = new Date(ticket.respondedAt).getTime();
      const diffMs = respondedTime - raisedTime;
      
      if (diffMs < 0) return null;
      
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHrs > 0) return `${diffHrs}h ${diffMins}m`;
      return `${diffMins}m`;
    } catch (e) {
      return null;
    }
  };


  // Added API integrations 
  useEffect(() => {

    fetch('http://localhost:8081/api/bookings')
      .then(res => res.json())
      .then(data => setMyBookings(data))
      .catch(console.error);

    fetch('http://localhost:8081/api/resources')
      .then(res => res.json())
      .then(data => {
        setResources(data);
        if (setResourcesProp) setResourcesProp(data);
      })
      .catch(console.error);


     fetch(`http://localhost:8081/api/tickets/lecturer/${userName}`)
      .then(res => res.json())
      .then(data => setTickets(Array.isArray(data) ? data : []))
.catch(() => setTickets([]));

    fetch('http://localhost:8081/api/buildings')
      .then(res => res.json())
      .then(data => setBuildings(data))
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

 
  const getResourceIcon = (type) => {
    if (type === 'Lecture Hall') return <School size={24} />;
    if (type === 'Lab Room') return <Monitor size={24} />;
    if (type === 'Meeting Room') return <Mic size={24} />;
    return <Zap size={24} />;
  };


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

    const unreadCount = notifications.filter(n => !n.read).length;

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



  return (
    <div className="min-h-screen bg-[#f9fafb] flex font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 mt-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <LayoutDashboard size={20} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Lecturer Hub</h1>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'Booking Resources', icon: <BookOpen size={20} />, label: 'Booking Resources' },
              { id: 'My Bookings', icon: <Calendar size={20} />, label: 'My Bookings' },
              { id: 'My Tickets', icon: <Ticket size={20} />, label: 'My Tickets' },
              { id: 'Ongoing Tickets', icon: <Clock size={20} />, label: 'Ongoing Tickets' },
              { id: 'Raise Ticket', icon: <Plus size={20} />, label: 'Raise Ticket' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                  ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
              >
                {item.icon}
                <span className="text-sm whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-50">
          <button onClick={() => { if (setUser) setUser(null); if (setPage) setPage('login'); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium">
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        {/* Header Area */}
        <header className="flex items-center justify-between mb-10 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100/50">
          
          <div className="w-96">
          {activeTab === 'Raise Ticket' ? (
             <div>
               <h2 className="text-2xl font-extrabold text-gray-900">
                 Raise Ticket
               </h2>
               <p className="text-xs text-gray-400">
                 Manage your university resources and schedules efficiently.
               </p>
             </div>
           ) : (   
              <div className="flex items-center gap-4 bg-gray-50 px-6 py-2 rounded-2xl border border-gray-100">
               <Search size={18} className="text-gray-400" />
               <input
                 type="text"
                 placeholder="Search facilities or bookings..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-transparent border-none outline-none text-sm w-full py-2"
               />
             </div>
             )}
          </div>

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
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Bell size={16} className={`transition-all ${notificationsEnabled ? 'text-primary' : 'text-gray-300'}`} />
                          Notifications
                        </h4>
                        <button 
                          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${notificationsEnabled ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                          title={notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${notificationsEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                          <span className="text-[9px] font-black uppercase tracking-tight">{notificationsEnabled ? 'ON' : 'OFF'}</span>
                        </button>
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline whitespace-nowrap">Mark all read</button>
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

        {/* Dynamic Page Title */}
         <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{activeTab}</h2>
          <p className="text-gray-500 mt-1">Manage your university resources and schedules efficiently.</p>
        </div>
      

      {/* Tab Content Area */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            > 

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

               {/* 2. My Bookings Tab */}
              {activeTab === 'My Bookings' && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Recent Booking Requests</h3>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-gray-100">
                      View All History
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white">
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resource</th>
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Schedule</th>
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Purpose</th>
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                       {filteredBookings.map(b => (
                         <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-8 py-6 text-sm font-bold text-gray-500">{b.id}</td>
                           <td className="px-8 py-6 text-sm font-bold text-gray-900">{b.resource}</td>
                           <td className="px-8 py-6">
                             <div className="flex flex-col">
                               <span className="text-sm font-bold text-gray-700">{b.date}</span>
                               <span className="text-[10px] text-gray-400 font-medium">{b.time}</span>
                             </div>
                           </td>
                           <td className="px-8 py-6 text-sm font-medium text-gray-600">{b.purpose}</td>
                           <td className="px-8 py-6 text-sm">
                             <StatusBadge status={b.status} />
                           </td>
                           <td className="px-8 py-6 text-sm">
                             {b.status === 'APPROVED' && (
                               <button
                                 onClick={() => {
                                   setSelectedBooking(b);
                                   setPage('booking-detail');
                                 }}
                                 className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all font-bold text-[10px] uppercase tracking-wider"
                               >
                                 <QrCode size={14} />
                                 View Pass
                               </button>
                             )}
                           </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {myBookings.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                      <Calendar size={48} className="text-gray-200 mb-4" />
                      <p className="text-gray-400 font-medium">No bookings found</p>
                    </div>
                  )}
                </div>
              )}


              {activeTab === 'My Tickets' && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">My Maintenance Tickets</h3>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-gray-100">
                      Status Overview
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white">
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issue</th>
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resource</th>
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority</th>
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</th>
                          <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredTickets.map((ticket) => (
                          <React.Fragment key={ticket.id}>
                            <tr className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-8 py-6 text-sm font-bold text-gray-900">
                                <div className="flex flex-col">
                                  <span className="font-bold text-gray-900">{ticket.category}</span>
                                  <span className="text-[10px] text-gray-400">{ticket.course}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-sm font-medium text-gray-600">{ticket.issue}</td>
                              <td className="px-8 py-6 text-sm font-bold text-primary">{ticket.resource}</td>
                              <td className="px-8 py-6">
                                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${ticket.priority === 'Urgent' ? 'bg-red-100 text-red-600' :
                                  ticket.priority === 'High' ? 'bg-orange-100 text-orange-600' :
                                    'bg-emerald-100 text-emerald-600'
                                  }`}>
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-tight border ${ticket.progressStatus === 'Not Started' ? 'bg-gray-50 text-gray-500 border-gray-100' :
                                  ticket.progressStatus === 'Working On' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    'bg-green-50 text-green-600 border-green-100'
                                  }`}>
                                  {ticket.progressStatus || 'Not Started'}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-sm">
                                <StatusBadge status={ticket.status} />
                              </td>
                            </tr>
                            {ticket.response && (
                              <tr className="bg-gray-50/30">
                                <td colSpan="5" className="px-8 py-4">
                                  <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm ml-4 mb-2 max-w-2xl"
                                  >
                                    <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                      <MessageSquare size={18} />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 rounded-md border border-primary/10">
                                          <Wrench size={10} className="text-primary/60" />
                                          <p className="text-[9px] font-black text-primary/70 uppercase tracking-tight">Action Taken</p>
                                        </div>
                                        {getResponseTime(ticket) && (
                                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100/50 animate-in fade-in zoom-in duration-500">
                                            <Clock size={10} className="text-emerald-500" />
                                            <span className="text-[9px] font-black text-emerald-600 italic">
                                              Responded in {getResponseTime(ticket)}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="bg-gray-50/50 rounded-2xl p-4 border border-dashed border-gray-200 hover:border-primary/30 transition-colors group/resp">
                                        <p className="text-xs text-gray-600 font-medium leading-relaxed group-hover/resp:text-gray-900 transition-colors">
                                          {ticket.response}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {tickets.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                      <Ticket size={48} className="text-gray-200 mb-4" />
                      <p className="text-gray-400 font-medium">No tickets found</p>
                    </div>
                  )}
                </div>
              )}

              {/* Ongoing Tickets Tab (Grid View) */}
              {activeTab === 'Ongoing Tickets' && (() => {
               
                return (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-primary pl-4">Ongoing Tickets</h2>
                    </div>
                    {ongoingTickets.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <Ticket size={48} className="text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium">No ongoing tickets found.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ongoingTickets.map((ticket, idx) => (
                          <div
                            key={ticket.id}
                            onClick={() => setSelectedTicket(ticket)}
                            className="cursor-pointer bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group overflow-hidden flex flex-col h-full relative"
                          >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[4rem] -mr-6 -mt-6 group-hover:bg-primary transition-all duration-500"></div>
                            
                            <div className="relative z-10 flex-grow">
                              <h3 className="text-lg font-black text-gray-900 mb-2">Ticket {String(idx + 1).padStart(2, '0')}</h3>
                              <p className="text-sm font-bold text-gray-400 mb-4 truncate">{ticket.issue}</p>
                              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
                                <MapPin size={14} className="text-primary"/>
                                {ticket.resource}
                              </div>
                            </div>
                            
                            {/* Divider & Status (from sketch) */}
                            <div className="relative z-10 border-t border-gray-100 pt-5 mt-auto flex items-center justify-between">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg">
                                ID: {ticket.id?.substring(ticket.id.length - 6) || ticket.id}
                              </span>
                              <StatusBadge status={ticket.status} />
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${ticket.progressStatus === 'Not Started' ? 'bg-gray-50 text-gray-400 border-gray-100' :
                                ticket.progressStatus === 'Working On' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                  'bg-green-50 text-green-600 border-green-100'
                                }`}>
                                {ticket.progressStatus || 'Not Started'}
                              </span>
                            </div>
                            {/* Click hint */}
                            <p className="relative z-10 text-[10px] text-primary font-bold mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">Click to view &amp; comment →</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

               {/* 3. Raise Ticket Tab */}
              {activeTab === 'Raise Ticket' && (
                <div className="max-w-4xl">
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mb-6 p-6 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-4 text-green-700 shadow-lg shadow-green-500/5"
                    >
                      <CheckCircle2 size={24} />
                      <div>
                        <p className="font-bold">Ticket Submitted Successfully!</p>
                        <p className="text-sm opacity-80">Our technical team will review it shortly within the next hour.</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Report an Issue</h3>
                        <p className="text-sm text-gray-400">Describe the problem encountered during your lecture.</p>
                      </div>
                    </div>

                    <form onSubmit={handleRaiseTicket} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Lecturer Name */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lecturer Name</label>
                          <input
                            name="lecturer"
                            required
                            type="text"
                            defaultValue={userName}
                            className="bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold"
                          />
                        </div>

                        {/* Lecture / Course Name */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Lecture / Course Name</label>
                          <input
                            name="course"
                            required
                            type="text"
                            placeholder="e.g. CS101 Advanced Networking"
                            className="bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold"
                          />
                        </div>

                        {/* Hall / Room Name */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Hall / Room Name</label>
                          <select
                            name="hall"
                            required
                            className="bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold appearance-none"
                          >
                            <option value="">Select Resource</option>
                            {resources.map(res => (
                              <option key={res.id} value={res.name}>{res.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Issue Category */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Issue Category</label>
                          <select
                            name="category"
                            required
                            className="bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold appearance-none"
                          >
                            <option value="Projector Issue">Projector Issue</option>
                            <option value="Smart Screen Issue">Smart Screen Issue</option>
                            <option value="Camera Issue">Camera Issue</option>
                            <option value="Audio Issue">Audio Issue</option>
                            <option value="Network Issue">Network Issue</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Issue Title */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Issue Title</label>
                        <input
                          name="issueTitle"
                          required
                          type="text"
                          placeholder="Short summary of the issue"
                          className="bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold"
                        />
                      </div>

                      {/* Issue Description */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Issue Description</label>
                        <textarea
                          name="issueDesc"
                          required
                          rows="4"
                          placeholder="Please provide details about the problem..."
                          className="bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium resize-none"
                        ></textarea>
                      </div>

                      <div className="flex items-center gap-8 border-t border-gray-50 pt-8 mt-4">
                        <div className="flex-1 flex flex-col gap-2 text-primary">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Priority Level</label>
                          <div className="flex gap-4">
                            {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                              <label key={p} className="flex-1">
                                <input type="radio" name="priority" value={p} className="hidden peer" defaultChecked={p === 'Low'} />
                                <div className="p-3 text-center rounded-2xl border border-gray-100 text-xs font-bold peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary cursor-pointer transition-all hover:bg-gray-50">
                                  {p}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6">
                          <button type="submit" className="bg-primary text-white font-bold py-4 px-12 rounded-2xl hover:bg-opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                            Submit Ticket
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              </motion.div>
          </AnimatePresence>
        </main>
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

      {/* ── Ticket Detail Modal ── */}
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            currentUser={userName}
            currentRole="LECTURER"
            onClose={() => setSelectedTicket(null)}
            onTicketUpdate={(updated) => {
              setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
              setSelectedTicket(updated);
            }}
          />
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{
        __html: `
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      ` }} />
    </div>
                
  );
};

export default lecturerDashboard;
