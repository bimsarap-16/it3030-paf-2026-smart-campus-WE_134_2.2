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

  const [lecturers, setLecturers] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  //  Added ticket state management
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');

  useEffect(() => {

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
      setTickets(tickets.map(x => x.id === ticketId ? data : x));
    } catch (err) {
      console.error(err);
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