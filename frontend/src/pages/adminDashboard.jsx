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
   
  const [bookings, setBookings] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [technicians, setTechnicians] = useState([]);


  const stats = [
    { label: 'Total Users', value: lecturers.length + technicians.length, icon: <Users />, color: 'text-lime-600', bg: 'bg-lime-50' },
  ];

  useEffect(() => {
    fetch('http://localhost:8081/api/bookings').then(res => res.json()).then(setBookings).catch(console.error);
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

      </div>
    </div>
  );
};

export default AdminDashboard;