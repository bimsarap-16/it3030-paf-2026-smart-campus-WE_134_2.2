import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Bell,
  User,
  Trash2,
  Edit2,
  X,
  ChevronRight,
  ShieldAlert,
  Layers,
  MapPin,
  Monitor,
  School,
  Mic,
  Zap,
  Users,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Main Component ──────────────────────────────────────────────────────────
const AddResources = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState('buildings');

  // ── Buildings State ─────────────────────────────────────────────────────────
  const [buildings, setBuildings] = useState([]);

  // ── Resources State ─────────────────────────────────────────────────────────
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/buildings')
      .then(res => res.json())
      .then(data => setBuildings(data))
      .catch(err => console.error(err));
    fetch('http://localhost:8081/api/resources')
      .then(res => res.json())
      .then(data => setResources(data))
      .catch(err => console.error(err));
  }, []);

  // ── Modals ──────────────────────────────────────────────────────────────────
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState(''); // Added to track selection for dynamic floor logic
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [editType, setEditType] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

    const getBuildingName = (id) => buildings.find(b => b.id === id)?.name || 'Unknown';

  // ── Building Actions ────────────────────────────────────────────────────────
  const handleAddBuilding = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newBuilding = {
      name: fd.get('name'),
      code: fd.get('code'),
      floors: parseInt(fd.get('floors')),
      resources: 0,
    };
    try {
      const res = await fetch('http://localhost:8081/api/buildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBuilding)
      });
      const data = await res.json();
      setBuildings(prev => [...prev, data]);
      setShowAddBuilding(false);
      showSuccess(`"${data.name}" has been added successfully!`);
      e.target.reset();
    } catch (err) { console.error('Failed to add building', err); }
  };

   const handleEditBuilding = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const updated = {
      name: fd.get('name'),
      code: fd.get('code'),
      floors: parseInt(fd.get('floors')),
      resources: editTarget.resources
    };
    try {
      const res = await fetch(`http://localhost:8081/api/buildings/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setBuildings(prev => prev.map(b => (b.id === editTarget.id ? data : b)));
      setShowEditModal(false);
      showSuccess('Building updated successfully!');
    } catch (err) { console.error(err); }
  };

  const handleDeleteBuilding = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/buildings/${id}`, { method: 'DELETE' });
      setBuildings(prev => prev.filter(b => b.id !== id));
      setResources(prev => prev.filter(r => r.buildingId !== id));
      setShowDeleteModal(false);
      showSuccess('Building removed successfully.');
    } catch (err) { console.error(err); }
  };

  // ── Resource Actions ────────────────────────────────────────────────────────
  const handleAddResource = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const features = Array.from(e.target.querySelectorAll('input[name="features"]:checked'))
      .map(cb => cb.value)
      .join(', ');

    const newResource = {
      buildingId: fd.get('buildingId'),
      name: fd.get('name'),
      type: fd.get('type'),
      floor: fd.get('floor'),
      capacity: parseInt(fd.get('capacity')),
      windows: parseInt(fd.get('windows')),
      features: features,
      status: 'AVAILABLE',
    };
    try {
      const res = await fetch('http://localhost:8081/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource)
      });
      const data = await res.json();
      setResources(prev => [...prev, data]);

      // Simple pseudo increment for UI unless we want to patch the building
      setBuildings(prev => prev.map(b => b.id === data.buildingId ? { ...b, resources: b.resources + 1 } : b));
      setShowAddResource(false);
      showSuccess(`"${data.name}" has been added!`);
      e.target.reset();
    } catch (err) { console.error(err); }
  };

  const handleEditResource = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const features = Array.from(e.target.querySelectorAll('input[name="features"]:checked'))
      .map(cb => cb.value)
      .join(', ');

    const updated = {
      buildingId: editTarget.buildingId,
      name: fd.get('name'),
      type: fd.get('type'),
      floor: fd.get('floor'),
      capacity: parseInt(fd.get('capacity')),
      windows: parseInt(fd.get('windows')),
      features: features,
      status: fd.get('status')
    };
    try {
      const res = await fetch(`http://localhost:8081/api/resources/${editTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      setResources(prev => prev.map(r => r.id === editTarget.id ? data : r));
      setShowEditModal(false);
      showSuccess('Resource updated!');
    } catch (err) { console.error(err); }
  };

  const handleDeleteResource = async (id) => {
    const res = resources.find(r => r.id === id);
    try {
      await fetch(`http://localhost:8081/api/resources/${id}`, { method: 'DELETE' });
      setResources(prev => prev.filter(r => r.id !== id));
      if (res) {
        setBuildings(prev => prev.map(b => b.id === res.buildingId ? { ...b, resources: Math.max(0, b.resources - 1) } : b));
      }
      setShowDeleteModal(false);
      showSuccess('Resource removed.');
    } catch (err) { console.error(err); }
  };

  // ── Filtered data ──────────────────────────────────────────────────────────
  const q = searchQuery.toLowerCase();
  const filteredBuildings = buildings.filter(b => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q));
  const filteredResources = resources.filter(r => r.name.toLowerCase().includes(q) || r.type.toLowerCase().includes(q));

  // ── Status helper ─────────────────────────────────────────────────────────
  const statusStyle = (s) => {
    if (s === 'AVAILABLE') return 'bg-green-50 text-green-600 border-green-100';
    if (s === 'OCCUPIED') return 'bg-orange-50 text-orange-600 border-orange-100';
    return 'bg-red-50 text-red-600 border-red-100';
  };

  const resourceIcon = (type) => {
    if (type === 'Lecture Hall') return <School size={20} />;
    if (type === 'Lab Room') return <Monitor size={20} />;
    if (type === 'Meeting Room') return <Mic size={20} />;
    return <Layers size={20} />;
  };

  // ── Input class ───────────────────────────────────────────────────────────
  const inputCls = 'w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all placeholder:text-gray-300';
  const labelCls = 'text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block';

   return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-800">

      {/* ── Header Bar ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* Left: back + title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage && setPage('admin')}
              className="p-2.5 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-emerald-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Add Resources</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Buildings & Facility Management</p>
            </div>
          </div>

          {/* Right: search + profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100 min-w-[300px]">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search buildings or resources..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
            <button className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-all border border-gray-100 shadow-sm relative">
              <Bell size={18} />
            </button>
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <User size={18} />
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Success Banner */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-5 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700 shadow-lg shadow-green-500/5"
            >
              <CheckCircle2 size={20} />
              <p className="text-sm font-bold">{successMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

         {/* ── Action Buttons ─────────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => { setActiveTab('buildings'); setShowAddBuilding(true); }}
            className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all text-sm"
          >
            <Building2 size={18} />
            Add New Building
          </button>
          <button
            onClick={() => { setActiveTab('resources'); setShowAddResource(true); }}
            className="flex items-center gap-3 px-8 py-4 bg-white text-emerald-600 font-bold rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all text-sm"
          >
            <Plus size={18} />
            Add New Resources
          </button>

          {/* Tab toggle */}
          <div className="ml-auto flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            {['buildings', 'resources'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                  : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Buildings List ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === 'buildings' && (
            <motion.div
              key="buildings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Buildings</h2>
                  <p className="text-sm text-gray-400 mt-1">Manage university buildings and facilities.</p>
                </div>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{filteredBuildings.length} Buildings</span>
              </div>

              <div className="space-y-4">
                {filteredBuildings.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 flex flex-col items-center text-center">
                    <Building2 size={36} className="text-gray-200 mb-3" />
                    <p className="text-gray-400 font-bold text-sm">No buildings found</p>
                    <p className="text-gray-300 text-xs mt-1">Add your first building to get started.</p>
                  </div>
                ) : (
                  filteredBuildings.map((b, idx) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm px-8 py-6 flex items-center justify-between group hover:shadow-md hover:border-emerald-100 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          <Building2 size={22} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{b.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">CODE: {b.code}</span>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{b.floors} Floors</span>
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{b.resources} Resources</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditTarget(b); setEditType('building'); setShowEditModal(true); }}
                          className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => { setDeleteTarget(b); setDeleteType('building'); setShowDeleteModal(true); }}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}


          {/* ── Resources List ─────────────────────────────────────────── */}
          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Resources</h2>
                  <p className="text-sm text-gray-400 mt-1">All lecture halls, labs, and meeting rooms.</p>
                </div>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{filteredResources.length} Resources</span>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/40 grid grid-cols-12 gap-4">
                  <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Resource</div>
                  <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Building</div>
                  <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type & Floor</div>
                  <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Capacity</div>
                  <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Windows</div>
                  <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Features</div>
                  <div className="col-span-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</div>
                  <div className="col-span-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-50">
                  {filteredResources.length === 0 ? (
                    <div className="py-20 flex flex-col items-center text-center">
                      <Layers size={36} className="text-gray-200 mb-3" />
                      <p className="text-gray-400 font-bold text-sm">No resources found</p>
                    </div>
                  ) : (
                    filteredResources.map((r) => (
                      <div key={r.id} className="px-8 py-5 grid grid-cols-12 gap-4 items-center hover:bg-gray-50/60 transition-colors group">
                        {/* Name */}
                        <div className="col-span-2 flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                            {resourceIcon(r.type)}
                          </div>
                          <p className="text-[13px] font-bold text-gray-900">{r.name}</p>
                        </div>

                        {/* Building */}
                        <div className="col-span-1">
                          <p className="text-[11px] font-bold text-gray-600 flex items-center gap-1">
                            <MapPin size={10} className="text-emerald-500" />
                            {getBuildingName(r.buildingId)}
                          </p>
                        </div>

                        {/* Type & Floor */}
                        <div className="col-span-2">
                          <p className="text-[11px] font-bold text-gray-700">{r.type}</p>
                          <p className="text-[9px] text-gray-400">{r.floor}</p>
                        </div>

                        {/* Capacity */}
                        <div className="col-span-1">
                          <div className="flex items-center gap-1.5">
                            <Users size={12} className="text-gray-300" />
                            <span className="text-[11px] font-bold text-gray-700">{r.capacity}</span>
                          </div>
                        </div>

                        {/* Windows */}
                        <div className="col-span-1">
                          <span className="text-[11px] font-bold text-gray-700">{r.windows}</span>
                        </div>

                        {/* Features */}
                        <div className="col-span-2">
                          <div className="flex flex-wrap gap-1">
                            {r.features ? r.features.split(', ').map((f, i) => (
                              <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md text-[8px] font-bold border border-gray-100 whitespace-nowrap">
                                {f.replace('With ', '').replace('with ', '')}
                              </span>
                            )) : <span className="text-[8px] text-gray-300">None</span>}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-1">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${statusStyle(r.status)}`}>
                            {r.status}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditTarget(r); setEditType('resource'); setShowEditModal(true); }}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => { setDeleteTarget(r); setDeleteType('resource'); setShowDeleteModal(true); }}
                            className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>










       

       




       </div>
       

       
    
    );
  
};

export default AddResources;