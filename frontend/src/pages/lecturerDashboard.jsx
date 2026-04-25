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


const lecturerDashboard = ({ setPage, user, setUser, setSelectedBooking, setResourcesList }) => {
  const userName = user?.name || (typeof user === 'string' ? user : 'Guest Lecturer');
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

  useEffect(() => {
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

    </div>
  );
};

export default lecturerDashboard;
