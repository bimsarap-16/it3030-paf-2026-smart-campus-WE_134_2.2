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


    return (
         );
         };

export default AddResources;