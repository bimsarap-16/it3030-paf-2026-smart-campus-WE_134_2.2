import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Building2,
  Calendar,
  Ticket,
  Users,
  Search,
  Bell,
  User,
  LayoutDashboard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Filter,
  MapPin,
  Clock,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ShieldAlert,
  Wrench,
  Check,
  X,
  History,
  Monitor,
  School,
  Mic,
  LogOut,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = ({ setPage, user, setUser }) => {

  const [activeTab, setActiveTab] = useState('Approve Users');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const [lecturers, setLecturers] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const stats = [
    { label: 'Total Users', value: lecturers.length + technicians.length, icon: <Users />, color: 'text-lime-600', bg: 'bg-lime-50' },
  ];

  // --- Dummy dara ---

  const [buildings, setBuildings] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/buildings').then(res => res.json()).then(setBuildings).catch(console.error);
    fetch('http://localhost:8081/api/resources').then(res => res.json()).then(setResources).catch(console.error);
    fetch('http://localhost:8081/api/lecturers').then(res => res.json()).then(setLecturers).catch(console.error);
    fetch('http://localhost:8081/api/technicians').then(res => res.json()).then(setTechnicians).catch(console.error);

    const fetchNotifications = () => {
      fetch('http://localhost:8081/api/notifications/user/ADMIN')
        .then(res => res.json())
        .then(setNotifications)
        .catch(console.error);
    };

    fetchNotifications();
    const nInterval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(nInterval);
  }, []);

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

    try {
      const res = await fetch('http://localhost:8081/api/technicians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTech)
      });
      const data = await res.json();
      setTechnicians([...technicians, data]);
      e.target.reset();
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

          <nav className="space-y-2">
            {[
              { id: 'Overview', icon: <LayoutDashboard size={18} /> },
              { id: 'Catalog', icon: <Building2 size={18} /> },
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
                {tab.id}
              </button>
            ))}
          </nav>
        </div>
        
      </aside>

      <div className="flex-1 ml-64 p-8">

        <header className="flex items-center justify-between mb-8"></header>

        <AnimatePresence>
          <motion.div>

            {activeTab === 'Approve Users' && (
              <div className="space-y-8">
                {/* unchanged content */}
              </div>
            )}

            {activeTab === 'Users' && (
              <div className="space-y-8">
                {/* unchanged content */}
              </div>
            )}

          </motion.div>
        </AnimatePresence>


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


                    


                    


      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;