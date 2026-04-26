import React, { useState, useEffect, useRef } from 'react';
import {
  X, Send, Pencil, Trash2, Check, ChevronRight,
  MessageSquare, User, Wrench, Shield, Clock, MapPin,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roleConfig = {
  LECTURER:   { color: 'bg-emerald-100 text-emerald-700',   icon: <User size={10} />,    label: 'Lecturer'   },
  TECHNICIAN: { color: 'bg-teal-100 text-teal-700',   icon: <Wrench size={10} />,  label: 'Technician' },
  ADMIN:      { color: 'bg-lime-100 text-lime-700',icon: <Shield size={10} />,  label: 'Admin'      },
};

const priorityColors = {
  Urgent: 'bg-red-100 text-red-600',
  High:   'bg-orange-100 text-orange-600',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low:    'bg-emerald-100 text-emerald-600',
};

const statusColors = {
  OPEN:        'bg-emerald-50 text-emerald-600 border-emerald-100',
  ASSIGNED:    'bg-teal-50 text-teal-600 border-teal-100',
  'IN PROGRESS':'bg-yellow-50 text-yellow-600 border-yellow-100',
  RESOLVED:    'bg-green-50 text-green-600 border-green-100',
};

const progressStatusColors = {
  'Not Started': 'bg-gray-100 text-gray-600 border-gray-200',
  'Working On': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Resolved': 'bg-green-50 text-green-600 border-green-100',
};

function formatTs(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return ts; }
}

function initials(name) {
  return (name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

const BASE = 'http://localhost:8081/api/tickets';

export default function TicketDetailModal({ ticket: initialTicket, currentUser, currentRole, onClose, onTicketUpdate }) {
  const [ticket, setTicket]       = useState(initialTicket);
  const [commentText, setCommentText] = useState('');
  const [editingId, setEditingId]  = useState(null);
  const [editText, setEditText]    = useState('');
  const [loading, setLoading]      = useState(false);
  const bottomRef                  = useRef(null);

  // Sync with initial ticket and FETCH LATEST on mount
  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE}/${initialTicket.id}`);
        if (res.ok) {
          const data = await res.json();
          setTicket(data);
        }
      } catch (err) { console.error('Failed to fetch ticket:', err); }
      setLoading(false);
    };
    fetchLatest();
  }, [initialTicket.id]);

  // Auto-scroll to bottom when comments change
  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [ticket?.comments]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const refresh = async () => {
    try {
      const res = await fetch(`${BASE}/${ticket.id}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
        if (onTicketUpdate) onTicketUpdate(data);
      }
    } catch (err) { console.error('Refresh failed:', err); }
  };

  // ── Add comment ────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!commentText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/${ticket.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: currentUser,
          authorRole: currentRole.toUpperCase(),
          text: commentText.trim(),
        }),
      });
      if (res.ok) {
        setCommentText('');
        await refresh();
      } else {
        const errorText = await res.text();
        console.error('Failed to add comment', errorText);
        alert("Failed to send comment. Please ensure the Backend is restarted! \nError: " + errorText);
      }
    } catch (err) {
      console.error(err);
      alert("Connection error. Is the backend running on port 8081?");
    }
    setLoading(false);
  };

  // ── Edit comment ───────────────────────────────────────────────────────
  const handleEdit = async (commentId) => {
    if (!editText.trim()) return;
    try {
      await fetch(`${BASE}/${ticket.id}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: currentUser, text: editText.trim() }),
      });
      setEditingId(null);
      await refresh();
    } catch (err) { console.error(err); }
  };

  // ── Delete comment ─────────────────────────────────────────────────────
  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await fetch(`${BASE}/${ticket.id}/comments/${commentId}?authorName=${encodeURIComponent(currentUser)}`, {
        method: 'DELETE',
      });
      await refresh();
    } catch (err) { console.error(err); }
  };

  // ── Update progress status ─────────────────────────────────────────────
  const handleUpdateProgress = async (newProgress) => {
    try {
      const updated = { ...ticket, progressStatus: newProgress };
      if (newProgress === 'Resolved') updated.status = 'RESOLVED';
      if (newProgress === 'Working On' && (updated.status === 'ASSIGNED' || updated.status === 'OPEN')) {
        updated.status = 'IN PROGRESS';
      }

      const res = await fetch(`${BASE}/${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
        if (onTicketUpdate) onTicketUpdate(data);
      }
    } catch (err) { console.error(err); }
  };

  const comments = ticket?.comments || [];
  const sColor   = statusColors[ticket?.status] || statusColors.OPEN;
  const pColor   = priorityColors[ticket?.priority] || priorityColors.Low;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-start justify-between shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-black border px-3 py-1 rounded-full ${sColor}`}>
                {ticket?.status}
              </span>
              <span className={`text-[10px] font-black px-2 py-1 rounded-md ${pColor}`}>
                {ticket?.priority}
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-black border px-3 py-1 rounded-full ${progressStatusColors[ticket?.progressStatus || 'Not Started']}`}>
                Progress: {ticket?.progressStatus || 'Not Started'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 truncate">{ticket?.issue || 'Ticket Detail'}</h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1"><MapPin size={12} className="text-primary"/>{ticket?.resource}</span>
              <span className="flex items-center gap-1"><User size={12}/>{ticket?.lecturer}</span>
              {ticket?.assignedTo && (
                <span className="flex items-center gap-1"><Wrench size={12} className="text-teal-500"/>{ticket.assignedTo}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Issue detail ── */}
        {ticket?.issueDesc && (
          <div className="px-8 py-4 bg-gray-50/60 border-b border-gray-100 shrink-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">{ticket.issueDesc}</p>
          </div>
        )}

        {/* ── Technician Progress Control ── */}
        {currentRole?.toUpperCase() === 'TECHNICIAN' && (
          <div className="px-8 py-4 bg-teal-50/30 border-b border-gray-100 flex items-center justify-between shrink-0">
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2">
              <Wrench size={12} /> Update Progress
            </p>
            <div className="flex gap-2">
              {Object.keys(progressStatusColors).map(st => (
                <button
                  key={st}
                  onClick={() => handleUpdateProgress(st)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${ticket?.progressStatus === st
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white border border-gray-100 text-gray-400 hover:border-teal-200 hover:text-teal-600'
                    }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Comment thread ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={12} /> Comments ({comments.length})
          </p>

          <AnimatePresence initial={false}>
            {comments.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-10 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-3xl flex items-center justify-center mb-3 text-gray-200">
                  <MessageSquare size={24} />
                </div>
                <p className="text-gray-400 text-sm font-medium">No comments yet.</p>
                <p className="text-gray-300 text-xs mt-1">Be the first to leave a comment!</p>
              </motion.div>
            )}

            {comments.map((c) => {
              const role   = roleConfig[c.authorRole] || roleConfig.LECTURER;
              const isOwn  = c.authorName === currentUser;
              const isEdit = editingId === c.id;

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${role.color}`}>
                    {initials(c.authorName)}
                  </div>

                  <div className={`flex flex-col max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
                    {/* Meta */}
                    <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs font-bold text-gray-800">{c.authorName}</span>
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${role.color}`}>
                        {role.icon} {role.label}
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-gray-300 font-medium">
                        <Clock size={9}/> {formatTs(c.timestamp)}
                      </span>
                    </div>

                    {/* Bubble */}
                    {isEdit ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          autoFocus
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleEdit(c.id)}
                          className="flex-1 bg-gray-50 border border-primary/30 rounded-2xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button onClick={() => handleEdit(c.id)} className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-opacity-90">
                          <Check size={14}/>
                        </button>
                        <button onClick={() => setEditingId(null)} className="w-8 h-8 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center hover:bg-gray-200">
                          <X size={14}/>
                        </button>
                      </div>
                    ) : (
                      <div className={`relative group rounded-[1.25rem] px-4 py-3 ${isOwn ? 'bg-primary text-white rounded-tr-sm' : 'bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-sm'}`}>
                        <p className="text-sm font-medium leading-relaxed">{c.text}</p>

                        {/* Own-comment actions */}
                        {isOwn && (
                          <div className="absolute -top-2 -left-2 hidden group-hover:flex items-center gap-1 bg-white border border-gray-100 rounded-xl shadow-md px-2 py-1">
                            <button
                              onClick={() => { setEditingId(c.id); setEditText(c.text); }}
                              className="text-gray-400 hover:text-primary transition-colors p-1"
                              title="Edit"
                            >
                              <Pencil size={11}/>
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              title="Delete"
                            >
                              <Trash2 size={11}/>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* ── Add Comment Input ── */}
        <div className="px-8 pb-8 pt-4 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${(roleConfig[currentRole?.toUpperCase()] || roleConfig.LECTURER).color}`}>
              {initials(currentUser)}
            </div>
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleAdd()}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-700 placeholder:text-gray-300"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={loading || !commentText.trim()}
              className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
            >
              <Send size={14}/>
            </button>
          </div>
          <p className="text-[10px] text-gray-300 font-medium mt-2 ml-1">
            Commenting as <span className="text-primary font-bold">{currentUser}</span> · {currentRole}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
