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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const [lecturers, setLecturers] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const stats = [
    { label: 'Total Users', value: lecturers.length + technicians.length, icon: <Users />, color: 'text-lime-600', bg: 'bg-lime-50' },
  ];

  useEffect(() => {
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

      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-30 shadow-sm">
        <div className="p-8">

          <nav className="space-y-2">
            {[
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
    </div>
    
  );
  
};

export default AdminDashboard;