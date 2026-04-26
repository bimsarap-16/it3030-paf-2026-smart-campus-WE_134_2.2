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

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
 
 
 
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const [lecturers, setLecturers] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  //  Added ticket state management
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');

  // --- Dummy dara ---

  const [buildings, setBuildings] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
 
    fetch('http://localhost:8081/api/buildings').then(res => res.json()).then(setBuildings).catch(console.error);
    fetch('http://localhost:8081/api/resources').then(res => res.json()).then(setResources).catch(console.error);
    
    
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
      setTickets(tickets.map(x => x.id === ticketId ? data : x));
    } catch (err) {
      console.error(err);
    }
  };

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
        
 
    <div className="min-h-screen flex">

       
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
      
         
     
                    


                    


      
           </motion.div>
           </AnimatePresence>
        </div>
      </div>

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

    </div>

     
    
  );
  
};

export default AdminDashboard;