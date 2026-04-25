import React, { useState, useEffect } from 'react';

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

  const [activeTab, setActiveTab] = useState('Approve Users');

  const [notifications, setNotifications] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
   
  const [bookings, setBookings] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [technicians, setTechnicians] = useState([]);

<<<<<<< HEAD

  const stats = [
    { label: 'Total Users', value: lecturers.length + technicians.length, icon: <Users />, color: 'text-lime-600', bg: 'bg-lime-50' },
  ];

  useEffect(() => {
    fetch('http://localhost:8081/api/bookings').then(res => res.json()).then(setBookings).catch(console.error);
    fetch('http://localhost:8081/api/lecturers').then(res => res.json()).then(setLecturers).catch(console.error);
    fetch('http://localhost:8081/api/technicians').then(res => res.json()).then(setTechnicians).catch(console.error);
=======
  //  Added ticket state management
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');

  useEffect(() => {
>>>>>>> origin/feature/dias/ticket-management

    fetch('http://localhost:8081/api/lecturers')
      .then(res => res.json())
      .then(setLecturers)
      .catch(console.error);

    fetch('http://localhost:8081/api/technicians')
      .then(res => res.json())
      .then(setTechnicians)
      .catch(console.error);

    // Fetch ticket data from backend
    fetch('http://localhost:8081/api/tickets')
      .then(res => res.json())
      .then(setTickets)
      .catch(console.error);

  }, []);

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
<<<<<<< HEAD
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
=======
      setTickets(tickets.map(x => x.id === ticketId ? data : x));
    } catch (err) {
      console.error(err);
>>>>>>> origin/feature/dias/ticket-management
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <nav className="space-y-2">

          <button onClick={() => setActiveTab('Approve Users')}>
            Approve Users
          </button>

          <button onClick={() => setActiveTab('Users')}>
            Users
          </button>

          {/* Added Ticketing tab */}
          <button onClick={() => setActiveTab('Ticketing')}>
            Ticketing
          </button>

        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6">

        <h2>{activeTab}</h2>

        {/* ---------------- TICKETING UI ---------------- */}

        {/* Ticket search + UI */}
        {activeTab === 'Ticketing' && (
          <div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search tickets..."
              value={ticketSearchQuery}
              onChange={(e) => setTicketSearchQuery(e.target.value)}
            />

            {/* Ticket Cards */}
            <div>

              {tickets
                .filter(t =>
                  t.issue?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                  t.resource?.toLowerCase().includes(ticketSearchQuery.toLowerCase())
                )
                .map(t => (

                  <div key={t.id}>

                    <h3>{t.issue}</h3>
                    <p>{t.resource}</p>

                    <p>Lecturer: {t.lecturer}</p>
                    <p>Assigned: {t.assignedTo || 'None'}</p>

                    {/* Assign Technician */}
                    <select
                      onChange={(e) => handleAssignTicket(t.id, e.target.value)}
                    >
                      <option>Assign Tech</option>
                      {technicians.map(tech => (
                        <option key={tech.id} value={tech.name}>
                          {tech.name}
                        </option>
                      ))}
                    </select>

                    {/* Open modal */}
                    <button onClick={() => setSelectedTicket(t)}>
                      View Ticket
                    </button>

                  </div>

                ))}
            </div>

          </div>
        )}

      </div>

<<<<<<< HEAD


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
=======
      {/*Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            currentUser={user?.name || 'Admin'}
            currentRole="ADMIN"
            onClose={() => setSelectedTicket(null)}
            onTicketUpdate={(updated) => {
              setTickets(prev =>
                prev.map(t => t.id === updated.id ? updated : t)
              );
              setSelectedTicket(updated);
            }}
          />
        )}
      </AnimatePresence>

>>>>>>> origin/feature/dias/ticket-management
    </div>
    
    


  );
};

export default AdminDashboard;