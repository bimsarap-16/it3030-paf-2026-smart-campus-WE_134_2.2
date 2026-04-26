import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';

// Added Ticket Modal import
import TicketDetailModal from '../components/TicketDetailModal';

import {
  Building2,
  Calendar,
  Ticket,
  Users,
  Search,
  Bell,
  User,
  LayoutDashboard,
  Plus,
  Trash2,
  CheckCircle2,
  MapPin,
  Clock,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  Wrench,
  Check,
  X,
  Monitor,
  School,
  LogOut,
  Zap
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = ({ setPage, user, setUser }) => {

  const [activeTab, setActiveTab] = useState('Overview');

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

   const [selectedItem, setSelectedItem] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

     const [notifications, setNotifications] = useState([]);
    
 
     const [statusFilter, setStatusFilter] = useState("ALL");
     const [showFilterMenu, setShowFilterMenu] = useState(false);

      const [showNotifications, setShowNotifications] = useState(false);
      const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        const saved = localStorage.getItem('adminNotificationsEnabled');
        return saved !== null ? JSON.parse(saved) : true;
      });

    useEffect(() => {
    localStorage.setItem('adminNotificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);  
   const [userSearchQuery, setUserSearchQuery] = useState('');
   const [ticketSearchQuery, setTicketSearchQuery] = useState('');

    // --- DUMMY DATA ---

  const [buildings, setBuildings] = useState([]);
  const [resources, setResources] = useState([]);

  const [bookings, setBookings] = useState([]);
   //  Added ticket state management
   const [tickets, setTickets] = useState([]);

  const [lecturers, setLecturers] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const stats = [
    { label: 'Total Buildings', value: buildings.length, icon: <Building2 />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Resources', value: resources.length, icon: <Zap />, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Booking Requests', value: bookings.length, icon: <Calendar />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Bookings', value: bookings.filter(b => b.status === 'PENDING').length, icon: <Clock />, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Open Tickets', value: tickets.filter(t => t.status === 'OPEN').length, icon: <AlertCircle />, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Total Users', value: lecturers.length + technicians.length, icon: <Users />, color: 'text-lime-600', bg: 'bg-lime-50' },
  ];

  useEffect(() => {
 
    fetch('http://localhost:8081/api/buildings').then(res => res.json()).then(setBuildings).catch(console.error);
    fetch('http://localhost:8081/api/resources').then(res => res.json()).then(setResources).catch(console.error);

    fetch('http://localhost:8081/api/bookings').then(res => res.json()).then(setBookings).catch(console.error);

    // Fetch ticket data from backend
    fetch('http://localhost:8081/api/tickets')
      .then(res => res.json())
      .then(setTickets)
      .catch(console.error);
    
    
    fetch('http://localhost:8081/api/lecturers')
      .then(res => res.json())
      .then(setLecturers)
      .catch(console.error);

    fetch('http://localhost:8081/api/technicians')
      .then(res => res.json())
      .then(setTechnicians)
      .catch(console.error);

    
      // Notifications polling for ADMIN
    const fetchNotifications = () => {
      if (notificationsEnabled) {
        fetch('http://localhost:8081/api/notifications/user/ADMIN')
          .then(res => res.json())
          .then(setNotifications)
          .catch(console.error);
      }
    };

       fetchNotifications();
    const nInterval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(nInterval);
  }, [notificationsEnabled]);

 
  // --- ACTIONS ---
     const handleDeleteResource = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/resources/${id}`, { method: 'DELETE' });
      setResources(resources.filter(r => r.id !== id));
      setShowDeleteModal(false);
    } catch (err) { console.error(err); }
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = {
      ...selectedItem,
      name: formData.get('name'),
      capacity: formData.get('capacity'),
      status: formData.get('status')
    };
    try {
      const res = await fetch(`http://localhost:8081/api/resources/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setResources(resources.map(r => r.id === selectedItem.id ? data : r));
      setShowUpdateModal(false);
    } catch (err) { console.error(err); }
  };


  const handleAddTechnician = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTech = {
      name: formData.get('name'),
      email: formData.get('email'),
      spec: formData.get('spec'),
      empId: formData.get('empId')
    };
  };
 
  // Added ticket assignment logic
  const handleAssignTicket = async (ticketId, techName) => {
    const t = tickets.find(x => x.id === ticketId);
    if (!t) return;
 

    try {
      const res = await fetch(`http://localhost:8081/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...t,
          status: 'ASSIGNED',
          assignedTo: techName
        })
      });

      const data = await res.json();
 
      setTechnicians([...technicians, data]);
      e.target.reset();
    } catch (err) { console.error(err); }
  };

    const handleApproveBooking = async (id) => {
    const b = bookings.find(x => x.id === id);
    if (!b) return;
    try {
      const res = await fetch(`http://localhost:8081/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...b, status: 'APPROVED' })
      });
      const data = await res.json();
      setBookings(bookings.map(x => x.id === id ? data : x));
    } catch (err) { console.error(err); }
  };
   
      const handleRejectBooking = async () => {
    const b = bookings.find(x => x.id === selectedItem.id);
    if (!b) return;
    try {
      const res = await fetch(`http://localhost:8081/api/bookings/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...b, status: 'REJECTED', reason: rejectionReason })
      });
      const data = await res.json();
      setBookings(bookings.map(x => x.id === selectedItem.id ? data : x));
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (err) { console.error(err); }
  };


  const removeLecturer = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/lecturers/${id}`, { method: 'DELETE' });
      setLecturers(lecturers.filter(l => l.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleApproveTech = async (id) => {
    try{
    await fetch(`http://localhost:8081/api/technicians/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify("APPROVED")
    });
    setTechnicians(technicians.map(t => t.id === id ? { ...t, status: 'APPROVED' } : t));
     } catch (err) { console.error(err); }
  };

  const handleRejectTech = async (id) => {
     try {
    await fetch(`http://localhost:8081/api/technicians/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify("REJECTED")
    });
    setTechnicians(technicians.map(t => t.id === id ? { ...t, status: 'REJECTED' } : t));
     } catch (err) { console.error(err); }
  };

  const handleApproveLecturer = async (id) => {
     try {
    await fetch(`http://localhost:8081/api/lecturers/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify("APPROVED")
    });
    setLecturers(lecturers.map(l => l.id === id ? { ...l, status: 'APPROVED' } : l));
     } catch (err) { console.error(err); }
  };

  const handleRejectLecturer = async (id) => {
     try {
    await fetch(`http://localhost:8081/api/lecturers/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify("REJECTED")
    });
    setLecturers(lecturers.map(l => l.id === id ? { ...l, status: 'REJECTED' } : l));
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
      const res = await fetch(`http://localhost:8081/api/notifications/user/ADMIN/read-all`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (err) { console.error(err); }
  };  

 const unreadCount = notifications.filter(n => !n.read).length;

  return (
 
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-gray-800">
       {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-30 shadow-sm">
        <div className="p-8">
           <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShieldAlert size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin<span className="text-emerald-600">Portal</span></h1>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'Overview', icon: <LayoutDashboard size={18} /> },
              { id: 'Catalog', icon: <Building2 size={18} /> },
              { id: 'Bookings', icon: <Calendar size={18} /> },
              { id: 'Ticketing', icon: <Ticket size={18} /> },
              { id: 'Approve Users', icon: <CheckCircle2 size={18} /> },
              { id: 'Users', icon: <Users size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl ${
                  activeTab === tab.id ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="text-sm">{tab.id}</span>
              </button>
            ))}
          </nav>
        </div>

         <div className="mt-auto border-t border-gray-50 flex flex-col p-8">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <p className="text-xs font-bold">{user?.username || user?.name || (typeof user === 'string' ? user : 'Admin User')}</p>
              <p className="text-[10px] text-gray-400">System Administrator</p>
            </div>
          </div>
          <button
            onClick={() => { if (setUser) setUser(null); if (setPage) setPage('login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
          </div>

        </aside>

       {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
           {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div />
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all border shadow-sm relative ${showNotifications ? 'border-emerald-600 ring-4 ring-emerald-50' : 'border-gray-100'}`}
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
                    className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                          <Bell size={16} className={`transition-all ${notificationsEnabled ? 'text-emerald-600' : 'text-gray-300'}`} />
                          Admin Alerts
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
                        <button onClick={handleMarkAllRead} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline whitespace-nowrap">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-[32rem] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-200">
                             <Bell size={20} />
                          </div>
                          <p className="text-sm font-bold text-gray-400 italic">Everything's quiet</p>
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
                                  setActiveTab('Bookings');
                                  setSelectedBuilding(null);
                                  setShowNotifications(false);
                                } else if (type === 'TICKET' || type === 'COMMENTS') {
                                  setActiveTab('Ticketing');
                                  setShowNotifications(false);
                                }
                              }}
                              className={`p-4 hover:bg-indigo-50/30 transition-colors cursor-pointer relative ${!n.read ? 'bg-indigo-50/10' : ''}`}
                            >
                              {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
                              <div className="flex flex-col gap-1 ml-2">
                                <div className="flex items-center justify-between">
                                  <p className={`text-[10px] font-black uppercase tracking-widest ${n.read ? 'text-gray-300' : 'text-emerald-600'}`}>{n.type}</p>
                                  <p className="text-[8px] font-bold text-gray-300 italic">{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
          </div>
        </header>        


        {/* Dynamic Title */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">{activeTab}</h2>
            <p className="text-sm text-gray-400 mt-1">Management dashboard for university facilities and users.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPage && setPage('addresources')}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
            >
              <Plus size={14} /> Add Resources
            </button>
          </div>
        </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >

            {/* 1. OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {stats.map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
                        {s.icon}
                      </div>
                      <p className="text-2xl font-black">{s.value}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
 
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h3 className="font-bold mb-6 flex items-center justify-between">
                      Recent Activity
                      <button className="text-emerald-600 text-[10px] uppercase font-bold tracking-widest">View All</button>
                    </h3>
                    <div className="space-y-6">
                      {[
                        { title: 'New Booking Request', desc: 'Dr. Alan Turing reserved Robotics Lab', time: '5 mins ago', color: 'bg-green-500' },
                        { title: 'Ticket Assigned', desc: 'TC-902 assigned to Tech. Robert Smith', time: '20 mins ago', color: 'bg-teal-500' },
                        { title: 'Resource Updated', desc: 'Main Meeting Room status changed', time: '1 hour ago', color: 'bg-orange-500' },
                      ].map((act, i) => (
                        <div key={i} className="flex gap-4 items-start pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                          <div className={`w-2.5 h-2.5 rounded-full mt-2 ${act.color} ring-4 ring-gray-100`}></div>
                          <div>
                            <p className="text-sm font-bold">{act.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{act.desc}</p>
                            <span className="text-[10px] text-emerald-400 font-medium mt-2 block">{act.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
 
                  {/* Analysis Column */}
                  <div className="space-y-8">
                    {/* Usage Analysis Card */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
                      <h3 className="font-bold mb-8 flex items-center gap-2">
                        <BarChart3 size={20} className="text-emerald-600" />
                        Usage Analysis
                      </h3>
                      
                      {bookings.length > 0 ? (
                        <div className="flex-1 flex flex-col">
                          <div className="bg-emerald-50/50 rounded-3xl p-8 mb-8 text-center border border-emerald-50">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">Most Booked Last Week</p>
                            <h4 className="text-3xl font-black text-gray-900 mb-2">
                              {(() => {
                                const counts = {};
                                bookings.forEach(b => {
                                  counts[b.resource] = (counts[b.resource] || 0) + 1;
                                });
                                const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                                return top ? top[0] : 'N/A';
                              })()}
                            </h4>
                            <p className="text-sm text-gray-400 font-medium">
                              {(() => {
                                const counts = {};
                                bookings.forEach(b => {
                                  counts[b.resource] = (counts[b.resource] || 0) + 1;
                                });
                                const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                                return top ? `${top[1]} bookings in total` : 'No data';
                              })()}
                            </p>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Top Resources</p>
                            {Object.entries(
                              bookings.reduce((acc, b) => {
                                acc[b.resource] = (acc[b.resource] || 0) + 1;
                                return acc;
                              }, {})
                            )
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([name, count], i) => (
                              <div key={i} className="flex items-center gap-4">
                                <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(count / bookings.length) * 100}%` }}
                                    className="h-full bg-emerald-500 rounded-full"
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 w-24 truncate">{name}</span>
                                <span className="text-[10px] font-black text-emerald-600">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                          <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-4">
                            <BarChart3 size={32} />
                          </div>
                          <p className="text-sm font-bold text-gray-400 italic">Collecting data...</p>
                        </div>
                      )}
                    </div>

                    {/* Time Slot Analysis Card */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col">
                      <h3 className="font-bold mb-8 flex items-center gap-2">
                        <Clock size={20} className="text-emerald-600" />
                        Peak Booking Hours
                      </h3>
                      
                      {bookings.length > 0 ? (
                        <div className="flex-1 flex flex-col">
                          <div className="bg-teal-50/50 rounded-3xl p-8 mb-8 text-center border border-teal-50">
                            <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-3">Popular Time Slot</p>
                            <h4 className="text-3xl font-black text-gray-900 mb-2">
                              {(() => {
                                const counts = {};
                                bookings.forEach(b => {
                                  if (b.time) {
                                    counts[b.time] = (counts[b.time] || 0) + 1;
                                  }
                                });
                                const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                                return top ? top[0] : 'N/A';
                              })()}
                            </h4>
                            <p className="text-sm text-gray-400 font-medium">Highest activity detected</p>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Time Distribution</p>
                            {Object.entries(
                              bookings.reduce((acc, b) => {
                                if (b.time) acc[b.time] = (acc[b.time] || 0) + 1;
                                return acc;
                              }, {})
                            )
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([time, count], i) => (
                              <div key={i} className="flex items-center gap-4">
                                <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(count / bookings.length) * 100}%` }}
                                    className="h-full bg-teal-500 rounded-full"
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 w-24 truncate">{time}</span>
                                <span className="text-[10px] font-black text-teal-600">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                          <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-4">
                            <Clock size={32} />
                          </div>
                          <p className="text-sm font-bold text-gray-400 italic">No time data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CATALOG */}
            {activeTab === 'Catalog' && (
              <div className="space-y-8">
                {selectedBuilding ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-4 mb-8">
                      <button onClick={() => setSelectedBuilding(null)} className="p-2 hover:bg-white rounded-xl transition-all">
                        <ChevronRight size={20} className="rotate-180" />
                      </button>
                      <h3 className="text-xl font-bold">{selectedBuilding.name} - Resources</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {resources.filter(r => r.buildingId === selectedBuilding.id).map(r => (
                        <div key={r.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm group">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                              {r.type === 'Lecture Hall' ? <School size={24} /> : r.type === 'Lab Room' ? <Monitor size={24} /> : <Users size={24} />}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${r.status === 'AVAILABLE' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                              {r.status}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold mb-1">{r.name}</h4>
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-6">{r.type} | Floor {r.floor}</p>

                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 p-3 rounded-2xl text-center">
                              <p className="text-[10px] font-bold text-gray-400 mb-1">CAPACITY</p>
                              <p className="text-sm font-bold tracking-tight">{r.capacity}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl text-center">
                              <p className="text-[10px] font-bold text-gray-400 mb-1">WINDOWS</p>
                              <p className="text-sm font-bold tracking-tight">{r.windows}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => { setSelectedItem(r); setShowUpdateModal(true); }}
                              className="flex-1 bg-gray-900 text-white font-bold py-3.5 rounded-2xl text-xs hover:bg-gray-800 transition-all"
                            >
                              Update Details
                            </button>
                            <button
                              onClick={() => { setSelectedItem(r); setShowDeleteModal(true); }}
                              className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {buildings.map(b => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBuilding(b)}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                      >
                        <div className="w-16 h-16 bg-gray-50 rounded-[2rem] flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all mb-8 shadow-inner">
                          <Building2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-1">{b.name}</h3>
                        <p className="text-xs text-gray-400 font-bold mb-10 tracking-wider">CODE: {b.code}</p>

                        <div className="flex items-center justify-end border-t border-gray-50 pt-6">
                          <div className="w-10 h-10 rounded-full border border-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-emerald-50 group-hover:border-emerald-100 group-hover:text-emerald-600 transition-all">
                            <ChevronRight size={18} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

             {/* 3. BOOKINGS */}
            {activeTab === 'Bookings' && (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-3">
                    <ShieldAlert size={18} className="text-emerald-600" />
                    Pending Requests
                  </h3>
                  <div className="flex gap-3">
                    <div className="relative">
                    <button
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className="px-4 py-2 bg-white border rounded-xl text-xs font-bold"
                    >
                      {statusFilter === "ALL" ? "Filter Status" : statusFilter}
                    </button>
                  
                    {showFilterMenu && (
                      <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-lg">
                        {["ALL", "PENDING", "APPROVED", "REJECTED"].map(status => (
                          <div
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setShowFilterMenu(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            {status}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lecturer & ID</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resource</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Schedule</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Refer. Logic</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookings
                          .filter(b => statusFilter === "ALL" || b.status === statusFilter)
                          .map(b => (
                        <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold text-xs">{b.lecturer ? b.lecturer.charAt(0) : 'U'}</div>
                              <div>
                                <p className="text-sm font-bold">{b.lecturer}</p>
                                <p className="text-[10px] text-gray-400 font-medium">#{b.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-bold">{b.resource}</p>
                            <p className="text-[10px] text-gray-400">{b.building}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{b.date}</span>
                              <span className="text-[10px] text-emerald-400 font-bold">{b.time}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight border ${b.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                              b.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' :
                                'bg-red-50 text-red-600 border-red-100'
                              }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 group-hover:scale-105 transition-transform cursor-help">
                              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Conflict Free</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {b.status === 'PENDING' ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApproveBooking(b.id)}
                                  className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                >
                                  <Check size={16} strokeWidth={3} />
                                </button>
                                <button
                                  onClick={() => { setSelectedItem(b); setShowRejectModal(true); }}
                                  className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                  <X size={16} strokeWidth={3} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-gray-300 uppercase italic">Decision Logged</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

               {activeTab === 'Ticketing' && (
              <div className="space-y-8">
                {/* Search Bar */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                    <Search size={18} className="text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search by location, issue, lecturer..." 
                      className="bg-transparent border-none outline-none text-sm w-full font-medium"
                      value={ticketSearchQuery}
                      onChange={(e) => setTicketSearchQuery(e.target.value)}
                    />
                  </div>
                  {ticketSearchQuery && (
                    <button 
                      onClick={() => setTicketSearchQuery('')}
                      className="text-xs font-bold text-emerald-600 hover:underline px-2"
                    >
                      Clear Search
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tickets
                  .filter(t => 
                    t.issue?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                    t.resource?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                    t.lecturer?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                    t.id?.toLowerCase().includes(ticketSearchQuery.toLowerCase())
                  )
                  .map(t => (
                  <div
                    key={t.id}
                    className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] transition-transform duration-700 group-hover:scale-150 rotate-12 -mt-10 -mr-10`}>
                      <Ticket size={128} />
                    </div>

                    <div className="flex justify-between items-center mb-8 relative z-10">
                      <div className="flex gap-2">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${t.priority === 'URGENT' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-teal-50 text-teal-600 border-teal-100'}`}>
                          {t.priority}
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${t.progressStatus === 'Not Started' ? 'bg-gray-50 text-gray-400 border-gray-100' :
                          t.progressStatus === 'Working On' ? 'bg-teal-50 text-teal-500 border-teal-100' :
                            'bg-green-50 text-green-600 border-green-100'
                          }`}>
                          {t.progressStatus || 'Not Started'}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-300">#{t.id}</span>
                    </div>

                    <h4 className="text-xl font-black mb-2 text-gray-900">{t.issue}</h4>
                    <p className="text-xs text-gray-400 font-bold mb-10 flex items-center gap-2">
                      <MapPin size={12} className="text-emerald-400" />
                      {t.resource}
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <User size={14} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-300 uppercase leading-none mb-1">Lecturer</p>
                          <p className="text-xs font-bold">{t.lecturer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <Wrench size={14} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-300 uppercase leading-none mb-1">Assigned Tech</p>
                          <p className="text-xs font-bold text-emerald-600">{t.assignedTo || 'Unassigned'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        onChange={(e) => handleAssignTicket(t.id, e.target.value)}
                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl text-xs outline-none cursor-pointer appearance-none px-6 shadow-xl shadow-gray-200"
                        defaultValue={t.assignedTo || ""}
                      >
                        <option value="" disabled>Assign Technician...</option>
                        {technicians.map(tech => (
                          <option key={tech.id} value={tech.name}>{tech.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                        <ChevronRight size={14} className="rotate-90" />
                      </div>
                    </div>
                    {/* Click hint */}
                    <p 
                      onClick={() => setSelectedTicket(t)}
                      className="relative z-10 text-[10px] text-emerald-600 font-bold mt-4 text-center cursor-pointer hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Click to view & comment →
                    </p>
                  </div>
                ))}
              </div>
              </div>
            )}

            {/* 5. APPROVE USERS */}
            {activeTab === 'Approve Users' && (
              <div className="space-y-8">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                  <h3 className="font-bold flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    Pending Technician Requests
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Technician</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specialization</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Emp ID</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {technicians.filter(t => t.status === 'PENDING').map(t => (
                        <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                                <Wrench size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-bold">{t.name}</p>
                                <p className="text-xs text-gray-400">{t.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-medium">{t.spec}</td>
                          <td className="px-8 py-6 text-sm font-black text-gray-300">{t.empId}</td>
                          <td className="px-8 py-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveTech(t.id)}
                                className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-[10px] uppercase hover:bg-green-600 hover:text-white transition-all shadow-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectTech(t.id)}
                                className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {technicians.filter(t => t.status === 'PENDING').length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-8 py-10 text-center text-gray-400 text-sm">No pending technician requests.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                  <h3 className="font-bold flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-lime-600" />
                    Pending Lecturer Requests
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lecturer</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Emp ID</th>
                        <th className="px-8 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {lecturers.filter(l => l.status === 'PENDING').map(l => (
                        <tr key={l.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-lime-50 rounded-xl flex items-center justify-center text-lime-600 font-bold">
                                <Users size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-bold">{l.name}</p>
                                <p className="text-xs text-gray-400">{l.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-medium">{l.dept || 'N/A'}</td>
                          <td className="px-8 py-6 text-sm font-black text-gray-300">{l.empId || 'N/A'}</td>
                          <td className="px-8 py-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveLecturer(l.id)}
                                className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-[10px] uppercase hover:bg-green-600 hover:text-white transition-all shadow-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectLecturer(l.id)}
                                className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {lecturers.filter(l => l.status === 'PENDING').length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-8 py-10 text-center text-gray-400 text-sm">No pending lecturer requests.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              </div>
            )}

             {/* 6. USERS */}
            {activeTab === 'Users' && (
              <div className="space-y-8">
                {/* Search Bar for Users */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="flex-1 flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                    <Search size={18} className="text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search users by name, email or employee ID..." 
                      className="bg-transparent border-none outline-none text-sm w-full font-medium"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                    />
                  </div>
                  {userSearchQuery && (
                    <button 
                      onClick={() => setUserSearchQuery('')}
                      className="text-xs font-bold text-emerald-600 hover:underline px-2"
                    >
                      Clear Search
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-8">
                  {/* Technician List */}
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                    <h3 className="text-xl font-bold mb-8">Registered Technicians</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {technicians.filter(tech => 
                        tech.status === 'APPROVED' && (
                          (tech.name || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          (tech.email || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          (tech.empId || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          (tech.spec || '').toLowerCase().includes(userSearchQuery.toLowerCase())
                        )
                      ).map(tech => (
                        <div key={tech.id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-50 hover:border-emerald-100 transition-all group">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                              <Wrench size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{tech.name}</p>
                              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{tech.spec}</p>
                            </div>
                          </div>
                          <div className="space-y-1 ml-16">
                            <p className="text-[10px] text-gray-400 font-medium">{tech.email}</p>
                            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{tech.empId}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lecturer Table */}
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                      <h3 className="font-bold">University Lecturers</h3>
                    </div>
                    <div className="overflow-x-auto px-4 pb-4">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-white">
                            <th className="px-6 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dept.</th>
                            <th className="px-6 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Emp ID</th>
                            <th className="px-6 py-6 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {lecturers.filter(l => 
                            (l.status === 'APPROVED' || !l.status) && (
                              (l.name || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                              (l.email || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                              (l.empId || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                              (l.dept || '').toLowerCase().includes(userSearchQuery.toLowerCase())
                            )
                          ).map(l => (
                            <tr key={l.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-6 py-5">
                                <p className="text-sm font-bold">{l.name}</p>
                                <p className="text-[10px] text-gray-300 font-medium">{l.email}</p>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-xs font-bold text-emerald-500">{l.dept}</span>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-xs font-black text-gray-300">{l.empId}</span>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <button onClick={() => removeLecturer(l.id)} className="p-2 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 lg:sticky lg:top-8 hidden">
                  {/* "New Technician" functionality removed based on request */}
                </div>
              </div>
            </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>


         {/* --- MODALS --- */}

         {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 bg-transparent">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl overflow-hidden border border-gray-100">
            <h3 className="text-xl font-bold mb-2">Rejection Reason</h3>
            <p className="text-sm text-gray-400 mb-8">Please provide a valid reason for rejecting Dr. John von Neumann's request.</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Schedule Conflict, Maintenance Scheduled..."
              className="w-full bg-gray-50 border border-gray-50 rounded-2xl p-6 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all text-sm font-medium h-40 resize-none mb-8"
            ></textarea>
            <div className="flex gap-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-4 text-xs font-bold text-gray-400 hover:text-gray-900 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={handleRejectBooking}
                disabled={!rejectionReason}
                className="flex-1 bg-red-600 text-white font-bold py-4 rounded-2xl text-xs hover:bg-red-700 transition-all shadow-xl shadow-red-100 disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Update Resource Modal */}
      {showUpdateModal && selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 bg-transparent">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold mb-8">Update Resource</h3>
            <form onSubmit={handleUpdateResource} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Resource Name</label>
                <input required name="name" defaultValue={selectedItem.name} className="w-full bg-gray-50 border border-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all font-bold text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Seat Capacity</label>
                <input required name="capacity" type="number" defaultValue={selectedItem.capacity} className="w-full bg-gray-50 border border-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all font-bold text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Status</label>
                <select name="status" defaultValue={selectedItem.status} className="w-full bg-gray-50 border border-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all font-bold text-sm">
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="OUT OF SERVICE">OUT OF SERVICE</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowUpdateModal(false)} className="flex-1 py-4 text-xs font-bold text-gray-400">Cancel</button>
                <button type="submit" className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-2xl text-xs hover:bg-opacity-90 transition-all">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}


      {/* Delete/Remove Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 bg-transparent">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Permanent Action</h3>
            <p className="text-sm text-gray-400 mb-10">Are you sure you want to remove this record from the system? This cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-4 text-xs font-bold text-gray-400"
              >
                No, Keep it
              </button>
              <button
                onClick={() => handleDeleteResource(selectedItem.id)}
                className="flex-1 bg-red-600 text-white font-bold py-4 rounded-2xl text-xs shadow-xl shadow-red-100"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
        
                
      {/* ── Ticket Detail Modal ── */}
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            currentUser={user?.name || (typeof user === 'string' ? user : 'Admin')}
            currentRole="ADMIN"
            onClose={() => setSelectedTicket(null)}
            onTicketUpdate={(updated) => {
              setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
              setSelectedTicket(updated);
            }}
          />
        )}
      </AnimatePresence>
    </div>
 
  );
  
};

export default AdminDashboard;