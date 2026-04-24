import React, { useState, useEffect } from 'react';

import {
  Wrench,
  Bell,
  User,
  Search,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  X,
  Send,
  LogOut,
  LayoutDashboard,
  History,
  Filter,
  AlertTriangle,
  CheckCheck,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Priority and Status configs remain same...

const priorityConfig = {
  URGENT: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', dot: 'bg-red-500' },
  HIGH: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-500' },
  MEDIUM: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', dot: 'bg-yellow-400' },
  LOW: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', dot: 'bg-green-500' },
};

const statusConfig = {
  OPEN: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  ASSIGNED: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' },

};

const progressStatusConfig = {
  'Not Started': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', icon: <Clock size={12} /> },
  'Working On': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: <Loader2 size={12} /> },
  'Resolved': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', icon: <CheckCircle2 size={12} /> },
};

// ─── Main Component ────────────────────────────────────────────────────────────
const TechnicianDashboard = ({ setPage, user, setUser }) => {
  const [activeTab, setActiveTab] = useState('Requests');
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8081/api/tickets')
      .then(res => res.json())
      .then(setRequests)
      .catch(console.error);

    // Notifications polling for TECHNICIAN
    const fetchNotifications = () => {
      fetch('http://localhost:8081/api/notifications/user/TECHNICIAN')
        .then(res => res.json())
        .then(setNotifications)
        .catch(console.error);
    };

    fetchNotifications();
    const nInterval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(nInterval);
  }, []);

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
      const res = await fetch(`http://localhost:8081/api/notifications/user/TECHNICIAN/read-all`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-gray-800">

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 ml-64 p-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-12 h-12 flex items-center justify-center bg-white border rounded-2xl text-gray-400 hover:text-emerald-600 transition-all relative ${showNotifications ? 'border-emerald-600 ring-4 ring-emerald-50' : 'border-gray-100'}`}
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
                        <Bell size={16} className="text-emerald-600" />
                        Technician Alerts
                      </h4>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllRead} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-[30rem] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-200">
                            <Bell size={20} />
                          </div>
                          <p className="text-sm font-bold text-gray-400 italic">No alerts right now</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                if (!n.read) handleMarkRead(n.id);
                                const type = n.type?.toUpperCase();
                                if (type === 'TICKET' || type === 'COMMENTS') {
                                  setActiveTab('Requests');
                                  setShowNotifications(false);
                                }
                              }}
                              className={`p-4 hover:bg-teal-50/30 transition-colors cursor-pointer relative ${!n.read ? 'bg-teal-50/10' : ''}`}
                            >
                              {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-teal-600 rounded-full"></div>}
                              <div className="flex flex-col gap-1 ml-2">
                                <div className="flex items-center justify-between">
                                  <p className={`text-[10px] font-black uppercase tracking-widest ${n.read ? 'text-gray-300' : 'text-emerald-600'}`}>{n.type}</p>
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
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <User size={20} />
            </div>
          </div>
        </header>

      </div>
    </div>
  );
};

export default TechnicianDashboard;
