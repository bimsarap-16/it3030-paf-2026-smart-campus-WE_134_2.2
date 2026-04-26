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
  X,
  Send,
  Filter,
  CheckCheck,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const priorityConfig = {
  URGENT: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', dot: 'bg-red-500' },
  HIGH: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-500' },
  MEDIUM: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100', dot: 'bg-yellow-400' },
  LOW: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', dot: 'bg-green-500' },
};

const statusConfig = {
  OPEN: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  ASSIGNED: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' },
  'IN PROGRESS': { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
  RESOLVED: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
};

const progressStatusConfig = {
  'Not Started': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  'Working On': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  Resolved: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
};
//Added state management for tickets
const TechnicianDashboard = ({ setPage, user, setUser }) => {
   const [activeTab, setActiveTab] = useState('Requests');
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

//Added API integration : fetch tickets
  useEffect(() => {
    fetch('http://localhost:8081/api/tickets')
      .then(res => res.json())
      .then(setRequests)
      .catch(console.error);

    const fetchNotifications = () => {
      fetch('http://localhost:8081/api/notifications/user/TECHNICIAN')
        .then(res => res.json())
        .then(setNotifications)
        .catch(console.error);
    };

     fetch('http://localhost:8081/api/resources')
      .then(res => res.json())
      .then(setResources)
      .catch(console.error);

    fetchNotifications();
    const nInterval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(nInterval);
  }, []);

   // Added ticket calculations:
  // counts, date extraction,
  // search filtering and tab filtering logic
  const openCount = requests.filter(r => r.status === 'OPEN').length;
  const inProgressCount = requests.filter(r => r.status === 'IN PROGRESS').length;
  const resolvedCount = requests.filter(r => r.status === 'RESOLVED').length;

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

  const tabRequests =
    activeTab === 'Requests'
      ? filteredRequests.filter(r => r.status === 'OPEN')
      : activeTab === 'Ongoing'
      ? filteredRequests.filter(r => r.status === 'IN PROGRESS' || r.status === 'ASSIGNED')
      : filteredRequests.filter(r => r.status === 'RESOLVED');

  const openRespond = req => {
    setSelectedRequest(req);
    setResponseText(req.response || '');
    setShowResponseModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return;

    try {
      const updated = {
        ...selectedRequest,
        response: responseText,
        status: 'IN PROGRESS',
        progressStatus: 'Working On',
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

  const handleMarkResolved = async id => {
    const req = requests.find(r => r.id === id);
    if (!req) return;

    try {
      const updated = {
        ...req,
        status: 'RESOLVED',
        progressStatus: 'Resolved',
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

  const handleUpdateProgress = async (id, newProgress) => {
    const req = requests.find(r => String(r.id) === String(id));
    if (!req) return;

    try {
      const updated = { ...req, progressStatus: newProgress };

      if (newProgress === 'Resolved') updated.status = 'RESOLVED';
      if (newProgress === 'Working On') updated.status = 'IN PROGRESS';

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

  const handleUpdateStatus = async (id, newStatus) => {
    const req = requests.find(r => String(r.id) === String(id));
    if (!req) return;

    try {
      const updated = { ...req, status: newStatus };

      if (newStatus === 'RESOLVED') updated.progressStatus = 'Resolved';
      if (newStatus === 'IN PROGRESS') updated.progressStatus = 'Working On';

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

  // Tab counts for display
  const tabRequests = activeTab === 'Requests'
    ? filteredRequests.filter(r => r.status === 'OPEN')
    : activeTab === 'Ongoing'
      ? filteredRequests.filter(r => r.status === 'IN PROGRESS' || r.status === 'ASSIGNED' || r.status === 'OPEN')
      : activeTab === 'Out Of Service'
        ? resources.filter(res => res.status === 'OUT OF SERVICE' || res.status === 'OUT_OF_SERVICE')
      : filteredRequests.filter(r => r.status === 'RESOLVED');


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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-gray-800">
      <div className="flex-1 ml-64 p-8">
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
                    <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Bell size={16} className="text-emerald-600" />
                        Technician Alerts
                      </h4>

                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[30rem] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <Bell size={20} className="mx-auto text-gray-300 mb-3" />
                          <p className="text-sm font-bold text-gray-400 italic">No alerts right now</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                if (!n.read) handleMarkRead(n.id);
                                setActiveTab('Requests');
                                setShowNotifications(false);
                              }}
                              className={`p-4 hover:bg-teal-50/30 transition-colors cursor-pointer relative ${
                                !n.read ? 'bg-teal-50/10' : ''
                              }`}
                            >
                              <p className={`text-[10px] font-black uppercase tracking-widest ${
                                n.read ? 'text-gray-300' : 'text-emerald-600'
                              }`}>
                                {n.type}
                              </p>
                              <p className={`text-xs leading-relaxed ${
                                n.read ? 'text-gray-400 font-medium' : 'text-gray-700 font-bold'
                              }`}>
                                {n.message}
                              </p>
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

        {showSuccessBanner && (
          <div className="mb-6 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4 text-emerald-700">
            <CheckCircle2 size={22} />
            <div>
              <p className="font-bold text-sm">Response Submitted!</p>
              <p className="text-xs opacity-75">The ticket has been updated to In Progress.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <AlertCircle className="text-emerald-600 mb-3" />
            <p className="text-2xl font-black">{openCount}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Open</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className="text-yellow-600 mb-3" />
            <p className="text-2xl font-black">{inProgressCount}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">In Progress</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <CheckCheck className="text-green-600 mb-3" />
            <p className="text-2xl font-black">{resolvedCount}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Resolved</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            {['Requests', 'Ongoing', 'History'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === tab ? 'bg-emerald-600 text-white' : 'text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Filter size={14} className="text-gray-400" />
            {['ALL', 'OPEN', 'IN PROGRESS', 'RESOLVED'].map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black ${
                  filterStatus === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-100 text-gray-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1024px]">
              <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/40 grid grid-cols-12 gap-4">
                <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase">ID</div>
                <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase">Location</div>
                <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase">Issue</div>
                <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase">Lecturer</div>
                <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase">Time</div>
                <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase">Priority</div>
                <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase">Status</div>
                <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase">Progress</div>
                <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase text-right">Actions</div>
              </div>

              <div className="divide-y divide-gray-50">
                {tabRequests.length === 0 ? (
                  <div className="py-24 flex flex-col items-center justify-center text-center">
                    <Wrench size={28} className="text-gray-300 mb-4" />
                    <p className="text-gray-400 font-bold text-sm">No requests found</p>
                  </div>
                ) : (
                  tabRequests.map(req => {
                    const pStyle = priorityConfig[req.priority] || priorityConfig.LOW;
                    const sStyle = statusConfig[req.status] || statusConfig.OPEN;
                    const { time, date } = getTicketDate(req.id);

                    return (
                      <div key={req.id} className="px-8 py-5 grid grid-cols-12 gap-4 items-center hover:bg-gray-50/60">
                        <div className="col-span-1 text-xs font-black text-gray-400">
                          #{req.id?.substring(req.id.length - 6)}
                        </div>

                        <div className="col-span-2">
                          <p className="text-sm font-bold text-gray-900">{req.resource || 'Unknown'}</p>
                          <p className="text-[10px] text-gray-400">{req.building || 'Campus'}</p>
                        </div>

                        <div className="col-span-2">
                          <p className="text-sm font-bold text-gray-700">{req.issue}</p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {(req.issueDesc || req.description || '').substring(0, 38)}...
                          </p>
                        </div>

                        <div className="col-span-1 text-xs font-bold text-gray-700">
                          {req.lecturer}
                        </div>

                        <div className="col-span-1">
                          <p className="text-[10px] font-bold text-gray-500">{time}</p>
                          <p className="text-[10px] text-gray-300">{date}</p>
                        </div>

                        <div className="col-span-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
                            {req.priority}
                          </span>
                        </div>

                        <div className="col-span-1">
                          <select
                            value={req.status}
                            onChange={e => handleUpdateStatus(req.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black border ${sStyle.bg} ${sStyle.text} ${sStyle.border}`}
                          >
                            {Object.keys(statusConfig).map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-1">
                          <select
                            value={req.progressStatus || 'Not Started'}
                            onChange={e => handleUpdateProgress(req.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-black border ${
                              (progressStatusConfig[req.progressStatus] || progressStatusConfig['Not Started']).bg
                            }`}
                          >
                            {Object.keys(progressStatusConfig).map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2 flex justify-end gap-2">
                          {req.status !== 'RESOLVED' && (
                            <>
                              <button
                                onClick={() => openRespond(req)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
                              >
                                <MessageSquare size={13} />
                                Respond
                              </button>

                              {req.response && (
                                <button
                                  onClick={() => handleMarkResolved(req.id)}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 border border-green-100 rounded-xl text-xs font-bold"
                                >
                                  <CheckCircle2 size={13} />
                                  Resolve
                                </button>
                              )}
                            </>
                          )}

                          {req.status === 'RESOLVED' && (
                            <span className="text-[10px] font-black text-emerald-600 uppercase">
                              Completed
                            </span>
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
      </div>

      <AnimatePresence>
        {showResponseModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl border border-gray-100"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">{selectedRequest.issue}</h3>
                  <p className="text-xs text-gray-400">
                    {selectedRequest.resource || selectedRequest.location}
                  </p>
                </div>

                <button onClick={() => setShowResponseModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <textarea
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                placeholder="Describe the action taken..."
                rows={5}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 outline-none text-sm resize-none mb-6"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="flex-1 py-4 text-xs font-bold text-gray-400"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitResponse}
                  disabled={!responseText.trim()}
                  className="flex-1 bg-teal-600 text-white font-bold py-4 rounded-2xl text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  Submit Response
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnicianDashboard;