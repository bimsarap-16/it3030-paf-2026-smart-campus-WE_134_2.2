import React, { useState, useEffect } from 'react';
import { AlertTriangle, LogOut } from 'lucide-react';
import TicketDetailModal from '../components/TicketDetailModal';

import {
  Wrench,
  Bell,
  User,
  Search,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  Send,
  Filter,
  CheckCheck,
  Loader2,
  MessageSquare,
  History,  
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

// ─── Main Component
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
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('techNotificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

   useEffect(() => {
    localStorage.setItem('techNotificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);
  const [resources, setResources] = useState([]);

//Added API integration 
  useEffect(() => {
    fetch('http://localhost:8081/api/tickets')
      .then(res => res.json())
      .then(setRequests)
      .catch(console.error);

      fetch('http://localhost:8081/api/resources')
      .then(res => res.json())
      .then(setResources)
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
  }, [notificationsEnabled]);

   // Stats
   // Added ticket calculations:
  // counts, date extraction,
  // search filtering and tab filtering logic
  const openCount = requests.filter(r => r.status === 'OPEN').length;
  const inProgressCount = requests.filter(r => r.status === 'IN PROGRESS').length;
  const resolvedCount = requests.filter(r => r.status === 'RESOLVED').length;
  const urgentCount = requests.filter(r => r.priority === 'URGENT' && r.status !== 'RESOLVED').length;

    // Helper to get date and time from MongoDB ObjectId
  const getTicketDate = id => {
    try {
      if (id && id.length === 24) {
        const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
        const dateObj = new Date(timestamp);
        return {
          time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        };
      }
    } catch (e) {}
    return { time: '--:--', date: '---' };
  };

  const getResolutionTime = (req) => {
    try {
      if (!req.resolvedAt) return null;
      const raisedTime = req.id && req.id.length === 24 
        ? parseInt(req.id.substring(0, 8), 16) * 1000 
        : null;
      
      if (!raisedTime) return null;
      
      const resolvedTime = new Date(req.resolvedAt).getTime();
      const diffMs = resolvedTime - raisedTime;
      
      if (diffMs < 0) return null;
      
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHrs > 0) return `${diffHrs}h ${diffMins}m`;
      return `${diffMins}m`;
    } catch (e) {
      return null;
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (r.resource || '').toLowerCase().includes(q) ||
      (r.issue || '').toLowerCase().includes(q) ||
      (r.lecturer || '').toLowerCase().includes(q) ||
      (r.id || '').toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

// Tab counts for display
  const tabRequests = activeTab === 'Requests'
    ? filteredRequests.filter(r => r.status === 'OPEN')
    : activeTab === 'Ongoing'
      ? filteredRequests.filter(r => r.status === 'IN PROGRESS' || r.status === 'ASSIGNED' || r.status === 'OPEN')
      : activeTab === 'Out Of Service'
        ? resources.filter(res => res.status === 'OUT OF SERVICE' || res.status === 'OUT_OF_SERVICE')
      : filteredRequests.filter(r => r.status === 'RESOLVED');


      // Open response modal
  const openRespond = req => {
    setSelectedRequest(req);
    setResponseText(req.response || '');
    setShowResponseModal(true);
  };

   // Submit response
  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return;
    try {
      const updated = {
        ...selectedRequest,
        response: responseText,
        status: 'IN PROGRESS',
      };
      const res = await fetch(`http://localhost:8081/api/tickets/${selectedRequest.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? data : r));
      setShowResponseModal(false);
      setShowSuccessBanner(true);
      setTimeout(() => setShowSuccessBanner(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark as resolved
  const handleMarkResolved = async id => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    try {
      const updated = {
        ...req,
        status: 'RESOLVED',
      };
      const res = await fetch(`http://localhost:8081/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      setRequests(prev => prev.map(r => String(r.id) === String(id) ? data : r));
    } catch (err) {
      console.error(err);
    }
  };

  // Update progress status
  const handleUpdateProgress = async (id, newProgress) => {
    const req = requests.find(r => String(r.id) === String(id));
    if (!req) return;
    try {
      const updated = { ...req, progressStatus: newProgress };
      // If progress is 'Resolved', also mark system status as 'RESOLVED'
      if (newProgress === 'Resolved') updated.status = 'RESOLVED';
      // If progress is 'Working On', ensure system status is 'IN PROGRESS'
      if (newProgress === 'Working On' && (updated.status === 'ASSIGNED' || updated.status === 'OPEN')) {
        updated.status = 'IN PROGRESS';
      }

      const res = await fetch(`http://localhost:8081/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
       if (res.ok) {
        const data = await res.json();
        setRequests(prev => prev.map(r => String(r.id) === String(id) ? data : r));
      } else {
        console.error('Failed to update progress', await res.text());
      }
    } catch (err) { console.error('Progress Update Error:', err); }
  };

  // Update main status
  const handleUpdateStatus = async (id, newStatus) => {
    const req = requests.find(r => String(r.id) === String(id));
    if (!req) return;
    try {
      const updated = { ...req, status: newStatus };

      // If status is 'RESOLVED', set progress to 'Resolved'
      if (newStatus === 'RESOLVED') updated.progressStatus = 'Resolved';
      // If status is 'IN PROGRESS' and progress is 'Not Started', set progress to 'Working On'
      if (newStatus === 'IN PROGRESS' && (!updated.progressStatus || updated.progressStatus === 'Not Started')) {
        updated.progressStatus = 'Working On';
      }

      const res = await fetch(`http://localhost:8081/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(prev => prev.map(r => String(r.id) === String(id) ? data : r));
      } else {
        console.error('Failed to update status', await res.text());
      }
    } catch (err) { console.error('Status Update Error:', err); }
  };

      const handleUpdateResourceTime = async (id, time) => {
    const resrc = resources.find(r => String(r.id) === String(id));
    if (!resrc) return;
    setSavingId(id);
    try {
      const updated = { ...resrc, estimatedResolveTime: time };
      console.log('Saving resource recovery time:', updated);
      const res = await fetch(`http://localhost:8081/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Successfully saved:', data);
        setResources(prev => prev.map(r => String(r.id) === String(id) ? data : r));
        setSavedId(id);
        setTimeout(() => setSavedId(null), 3000);
      } else {
        console.error('Failed to save resource time:', await res.text());
      }
    } catch (err) { console.error('Resource Update Error:', err); }
    finally { setSavingId(null); }
  };


  const handleMarkRead = async id => {
    try {
      const res = await fetch(`http://localhost:8081/api/notifications/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/notifications/user/TECHNICIAN/read-all`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-gray-800">
      
      {/* ── Sidebar  */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-30 shadow-sm"> 
        <div className="p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Wrench size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Tech<span className="text-emerald-600">Portal</span>
            </h1>
          </div>

          {/* Nav */}
          <nav className="space-y-2">
            {[
              { id: 'Requests', icon: <AlertCircle size={18} />, label: 'Requests' },
              { id: 'Ongoing', icon: <Clock size={18} />, label: 'Ongoing Tickets' },
              { id: 'Out Of Service', icon: <AlertTriangle size={18} />, label: 'Out Of Service' },
              { id: 'History', icon: <History size={18} />, label: 'History' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-600 font-bold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {tab.icon}
                <span className="text-sm whitespace-nowrap">{tab.label}</span>
                {tab.id === 'Requests' && openCount > 0 && (
                  <span className="ml-auto bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {openCount}
                  </span>
                )}
                {tab.id === 'Ongoing' && inProgressCount > 0 && (
                  <span className="ml-auto bg-yellow-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {inProgressCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

         {/* Profile footer */}
        <div className="mt-auto border-t border-gray-50">
          <div className="p-8 flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <div>
              <p className="text-xs font-bold">{user?.name || (typeof user === 'string' ? user : 'Tech. Robert Smith')}</p>
              <p className="text-[10px] text-gray-400">Network Administrator</p>
            </div>
          </div>
          <div className="px-8 pb-8">
            <button onClick={() => { if (setUser) setUser(null); if (setPage) setPage('login'); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium">
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content */} 
       <div className="flex-1 ml-64 p-8">



  {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 min-w-[380px]">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by location, issue, lecturer..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-12 h-12 flex items-center justify-center bg-white border rounded-2xl text-gray-400 hover:text-emerald-600 transition-all relative ${
                  showNotifications ? 'border-emerald-600 ring-4 ring-emerald-50' : 'border-gray-100'
                }`}
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
                          <Bell size={16} className={`transition-all ${notificationsEnabled ? 'text-emerald-600' : 'text-gray-300'}`} />
                          Technician Alerts
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

         {/* Success Banner */}
          <AnimatePresence>
          {showSuccessBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 text-emerald-700 shadow-lg shadow-emerald-500/5"
            >
              <CheckCircle2 size={22} />
              <div>
                <p className="font-bold text-sm">Response Submitted!</p>
                <p className="text-xs opacity-75">The ticket has been updated to "In Progress".</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

         {/* Stats Row */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Open', value: openCount, icon: <AlertCircle size={20} />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
            { label: 'In Progress', value: inProgressCount, icon: <Loader2 size={20} />, bg: 'bg-yellow-50', text: 'text-yellow-600' },
            { label: 'Resolved', value: resolvedCount, icon: <CheckCheck size={20} />, bg: 'bg-green-50', text: 'text-green-600' },
            { label: 'Urgent', value: urgentCount, icon: <AlertTriangle size={20} />, bg: 'bg-red-50', text: 'text-red-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 ${s.bg} ${s.text} rounded-2xl flex items-center justify-center mb-4`}>
                {s.icon}
              </div>
              <p className="text-2xl font-black mb-1">{s.value}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
   
        {/* Tab Header */}
         <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            {['Requests', 'Ongoing', 'Out Of Service', 'History'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                  : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-3">
            <Filter size={14} className="text-gray-400" />
            <div className="flex gap-2">
              {['ALL', 'OPEN', 'IN PROGRESS'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${filterStatus === f
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white border border-gray-100 text-gray-400 hover:border-gray-300'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>


         {/* ── Requests Table  */} 
         <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Page Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight">
                {activeTab === 'Requests' ? 'Maintenance Requests' : activeTab === 'Ongoing' ? 'Ongoing Tickets' : activeTab === 'Out Of Service' ? 'Resources Out Of Service' : 'Resolved History'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === 'Requests'
                  ? 'Review and respond to new issues reported by lecturers.'
                  : activeTab === 'Ongoing'
                    ? 'Tickets currently in progress and being worked on by you.'
                    : activeTab === 'Out Of Service'
                      ? 'List of resources currently marked as out of service for repair.'
                      : 'All resolved maintenance tickets you have handled.'}
              </p>
            </div>

            {(activeTab === 'Ongoing' || activeTab === 'Out Of Service') ? (
              tabRequests.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-4 text-gray-300">
                    {activeTab === 'Out Of Service' ? <AlertTriangle size={28} /> : <Wrench size={28} />}
                  </div>
                  <p className="text-gray-400 font-bold text-sm">
                    {activeTab === 'Out Of Service' ? 'No Out of Service resources found' : 'No ongoing tickets found'}
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    {activeTab === 'Out Of Service' ? 'All facilities are currently operational.' : 'Everything is currently under control!'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tabRequests.map((item, idx) => {
                    if (activeTab === 'Out Of Service') {
                      return (
                        <div
                          key={item.id}
                          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1 transition-all group overflow-hidden flex flex-col h-full relative"
                        >
                          {/* Decorative Corner */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-bl-[4rem] -mr-6 -mt-6 group-hover:bg-red-600 transition-all duration-500"></div>

                          <div className="relative z-10 flex-grow">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                                <AlertTriangle size={20} />
                              </div>
                              <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Out Of Service
                              </span>
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-xs font-bold text-gray-400 mb-4">{item.type}</p>
                            
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-6">
                              <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-red-500" />
                                Floor {item.floor || 'N/A'}
                              </div>
                            </div>
                          </div>

                          {/* Divider & Status */}
                          <div className="relative z-10 border-t border-gray-100 pt-5 mt-auto">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg">
                                ID: {item.id?.substring(item.id.length - 6) || item.id}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black text-red-600 uppercase">Under Maintenance</span>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 group-hover:border-red-100 transition-all">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Est. Recovery Date & Time</label>
                                {savingId === item.id && <span className="text-[8px] font-black text-amber-500 animate-pulse uppercase">Saving...</span>}
                                {savedId === item.id && <span className="text-[8px] font-black text-emerald-500 uppercase">Saved!</span>}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-red-400" />
                                <input 
                                  type="datetime-local"
                                  defaultValue={item.estimatedResolveTime || ''}
                                  id={`time-input-${item.id}`}
                                  className="bg-transparent border-none outline-none text-xs font-bold text-gray-700 w-full cursor-pointer"
                                />
                                <button 
                                  onClick={() => {
                                    const val = document.getElementById(`time-input-${item.id}`).value;
                                    handleUpdateResourceTime(item.id, val);
                                  }}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    const req = item;
                    return (
                      <div
                        key={req.id}
                        onClick={() => setSelectedTicket(req)}
                        className="cursor-pointer bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1 transition-all group overflow-hidden flex flex-col h-full relative"
                      >
                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/5 rounded-bl-[4rem] -mr-6 -mt-6 group-hover:bg-teal-600 transition-all duration-500"></div>

                        <div className="relative z-10 flex-grow">
                          <h3 className="text-lg font-black text-gray-900 mb-2">Ticket {String(idx + 1).padStart(2, '0')}</h3>
                          <p className="text-sm font-bold text-gray-400 mb-4 truncate">{req.issue}</p>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-6">
                            <MapPin size={14} className="text-emerald-600" />
                            {req.resource}
                          </div>
                        </div>

                        {/* Divider & Status */}
                        <div className="relative z-10 border-t border-gray-100 pt-5 mt-auto flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg">
                            ID: {req.id?.substring(req.id.length - 6) || req.id}
                          </span>
                          {/* Editable Status */}
                          <select
                            value={req.status}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                            className={`appearance-none px-4 py-1 rounded-full text-[10px] font-black border outline-none cursor-pointer ${statusConfig[req.status]?.bg || 'bg-gray-50'} ${statusConfig[req.status]?.text || 'text-gray-600'} ${statusConfig[req.status]?.border || 'border-gray-100'}`}
                          >
                            {Object.keys(statusConfig).map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>

                          {/* Editable Progress */}
                          <select
                            value={req.progressStatus || 'Not Started'}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleUpdateProgress(req.id, e.target.value)}
                            className={`appearance-none px-4 py-1 rounded-full text-[10px] font-black border outline-none cursor-pointer ${(progressStatusConfig[req.progressStatus] || progressStatusConfig['Not Started']).bg} ${(progressStatusConfig[req.progressStatus] || progressStatusConfig['Not Started']).text} ${(progressStatusConfig[req.progressStatus] || progressStatusConfig['Not Started']).border}`}
                          >
                            {Object.keys(progressStatusConfig).map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                        {/* Click hint */}
                        <p className="relative z-10 text-[10px] text-teal-600 font-bold mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">Click to view & comment →</p>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="min-w-[1024px]">
                    {/* Table header */}
                    <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/40 grid grid-cols-12 gap-4">
                      {activeTab === 'Out Of Service' ? (
                        <>
                          <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resource ID</div>
                          <div className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resource Name</div>
                          <div className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</div>
                          <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Floor</div>
                          <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</div>
                        </>
                      ) : (
                        <>
                          <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</div>
                          <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</div>
                          <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issue</div>
                          <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lecturer</div>
                          <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</div>
                          <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Priority</div>
                          <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</div>
                          <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</div>
                          <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</div>
                        </>
                      )}
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-gray-50">
                      {tabRequests.length === 0 ? (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-4 text-gray-300">
                            <Wrench size={28} />
                          </div>
                          <p className="text-gray-400 font-bold text-sm">No requests found</p>
                          <p className="text-gray-300 text-xs mt-1">Try adjusting your filters</p>
                        </div>
                      ) : (
                        tabRequests.map((item) => {
                          if (activeTab === 'Out Of Service') {
                            return (
                              <div key={item.id} className="px-8 py-6 grid grid-cols-12 gap-4 items-center hover:bg-gray-50/50 transition-colors group">
                                <div className="col-span-2">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg">
                                    {item.id?.substring(item.id.length - 6) || item.id}
                                  </span>
                                </div>
                                <div className="col-span-3">
                                  <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                </div>
                                <div className="col-span-3">
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase">
                                    {item.type}
                                  </span>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-sm text-gray-500 font-medium">{item.floor || 'N/A'}</p>
                                </div>
                                <div className="col-span-2 text-right">
                                  <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-black uppercase">
                                    Out Of Service
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          const req = item;
                          const pStyle = priorityConfig[req.priority] || priorityConfig.LOW;
                          const sStyle = statusConfig[req.status] || statusConfig.OPEN;
                          const { time, date } = req.time ? req : getTicketDate(req.id);
                          return (
                            <div
                              key={req.id}
                              className="px-8 py-5 grid grid-cols-12 gap-4 items-center hover:bg-gray-50/60 transition-colors group"
                            >
                              {/* ID */}
                              <div className="col-span-1">
                                <span className="text-xs font-black text-gray-400" title={req.id}>
                                  #{req.id?.substring(req.id.length - 6) || req.id}
                                </span>
                              </div>

                              {/* Location */}
                              <div className="col-span-1">
                                <div className="flex items-start gap-1.5">
                                  <MapPin size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">{req.resource || 'Unknown Location'}</p>
                                    <p className="text-[10px] text-gray-400">{req.building || 'Campus'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Issue */}
                              <div className="col-span-2">
                                <p className="text-sm font-bold text-gray-700">{req.issue}</p>
                                <p className="text-[10px] text-gray-400 truncate mt-0.5">{(req.issueDesc || req.description || '').substring(0, 38)}…</p>
                              </div>

                              {/* Lecturer */}
                              <div className="col-span-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 font-bold text-[10px] shrink-0">
                                    {(req.lecturer || 'U').charAt(0)}
                                  </div>
                                  <p className="text-xs font-bold text-gray-700 leading-tight truncate">{req.lecturer}</p>
                                </div>
                              </div>

                              {/* Time */}
                              <div className="col-span-1">
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Clock size={12} className="shrink-0" />
                                  <span className="text-[10px] font-bold">{time}</span>
                                </div>
                                <p className="text-[10px] text-gray-300 ml-4">{date}</p>
                              </div>

                              {/* Priority */}
                              <div className="col-span-1">
                                <span className={`inline-flex items-center whitespace-nowrap gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
                                  {req.priority}
                                </span>
                              </div>

                              <div className="col-span-1">
                                <select
                                  value={req.status}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                                  className={`appearance-none px-4 py-1 rounded-lg text-[10px] font-black border outline-none cursor-pointer ${sStyle.bg} ${sStyle.text} ${sStyle.border}`}
                                >
                                  {Object.keys(statusConfig).map(st => (
                                    <option key={st} value={st}>{st}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Progress Status */}
                              <div className="col-span-2">
                                <select
                                  value={req.progressStatus || 'Not Started'}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => handleUpdateProgress(req.id, e.target.value)}
                                  className={`appearance-none px-4 py-1 rounded-lg text-[10px] font-black border outline-none cursor-pointer ${(progressStatusConfig[req.progressStatus] || progressStatusConfig['Not Started']).bg} ${(progressStatusConfig[req.progressStatus] || progressStatusConfig['Not Started']).text} ${(progressStatusConfig[req.progressStatus] || progressStatusConfig['Not Started']).border}`}
                                >
                                  {Object.keys(progressStatusConfig).map(st => (
                                    <option key={st} value={st}>{st}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Actions */}
                              <div className="col-span-2 flex items-center justify-end gap-2">
                                {req.status !== 'RESOLVED' && (
                                  <>
                                    <button
                                      onClick={() => openRespond(req)}
                                      className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-100 group-hover:scale-105"
                                    >
                                      <MessageSquare size={13} />
                                      Respond
                                    </button>
                                    {req.response && (
                                      <button
                                        onClick={() => handleMarkResolved(req.id)}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 border border-green-100 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all"
                                      >
                                        <CheckCircle2 size={13} />
                                        Resolve
                                      </button>
                                    )}
                                  </>
                                )}
                                {req.status === 'RESOLVED' && (
                                  <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                      Completed
                                    </span>
                                    {getResolutionTime(req) && (
                                      <span className="text-[9px] font-bold text-gray-300 italic mt-0.5">
                                        Resolved in {getResolutionTime(req)}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Response preview cards (for responded requests) */}
            {activeTab === 'Ongoing' && tabRequests.some(r => r.response) && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Your Responses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tabRequests.filter(r => r.response && r.status !== 'RESOLVED').map(req => {
                    const pStyle = priorityConfig[req.priority] || priorityConfig.LOW;
                    return (
                      <div key={req.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex gap-5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${pStyle.bg} ${pStyle.text}`}>
                          <Wrench size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold">{req.issue}</p>
                            <span className="text-[10px] font-bold text-gray-400">#{req.id}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 mb-3 flex items-center gap-1">
                            <MapPin size={10} className="text-teal-500" /> {req.resource || req.location}
                          </p>
                          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-50">
                            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                              <Send size={10} /> Your Response
                            </p>
                            <p className="text-xs text-gray-700 font-medium leading-relaxed">{req.response}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

       {/* ── Response Modal- */}
        <AnimatePresence>
        {showResponseModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl border border-gray-100"
            >
              {/* Modal header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                    <Wrench size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedRequest.issue}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-teal-500" />
                      {selectedRequest.resource || selectedRequest.location} · {selectedRequest.building || 'Campus'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Issue details */}
              <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Issue Description</p>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">{selectedRequest.issueDesc || selectedRequest.description}</p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-600">{selectedRequest.lecturer}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-600">{selectedRequest.time || getTicketDate(selectedRequest.id).time}</span>
                  </div>
                  <span className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-black border ${(priorityConfig[selectedRequest.priority] || priorityConfig.LOW).bg
                    } ${(priorityConfig[selectedRequest.priority] || priorityConfig.LOW).text
                    } ${(priorityConfig[selectedRequest.priority] || priorityConfig.LOW).border
                    }`}>
                    {selectedRequest.priority}
                  </span>
                </div>
              </div>

              {/* Response textarea */}
              <div className="mb-6">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                  Your Response / Action Taken
                </label>
                <textarea
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  placeholder="Describe the steps you are taking or have taken to fix the issue..."
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all text-sm font-medium resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="flex-1 py-4 text-xs font-bold text-gray-400 hover:text-gray-700 transition-all rounded-2xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitResponse}
                  disabled={!responseText.trim()}
                  className="flex-1 bg-teal-600 text-white font-bold py-4 rounded-2xl text-xs hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  Submit Response
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Ticket Detail Modal ── */}
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            currentUser={user?.name || (typeof user === 'string' ? user : 'Tech. Robert Smith')}
            currentRole="TECHNICIAN"
            onClose={() => setSelectedTicket(null)}
            onTicketUpdate={(updated) => {
              setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
              setSelectedTicket(updated);
            }}
          />
        )}
      </AnimatePresence>

        {/* Scrollbar styles */}
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

export default TechnicianDashboard;