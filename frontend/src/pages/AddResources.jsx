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