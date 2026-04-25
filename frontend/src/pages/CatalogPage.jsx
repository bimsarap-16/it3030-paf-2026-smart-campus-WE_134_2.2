import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import {
  School,
  Users,
  Monitor,
  X,
  Info,
  MapPin,
  Cpu,
  Printer,
  Video,
  Wifi,
  Wind,
  ShieldCheck,
  Zap,
  Mic,
  Camera,
  Layers,
  Settings2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import SubCategoryCard from '../components/SubCategoryCard';

const CatalogPage = ({ setPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const categories = [
    {
      id: 'lecturer-halls',
      title: 'Lecturer Halls',
      description: 'Spacious halls equipped for large-scale academic presentations and interactive learning.',
      icon: <School size={28} />,
      subcategories: [
        { id: 1, name: 'Lecturer Hall with Multimedia Projector', icon: <Video size={18} /> },
        { id: 2, name: 'Lecturer Hall with Recording Cameras', icon: <Camera size={18} /> },
        { id: 3, name: 'Lecturer Hall with Smart Screen', icon: <Monitor size={18} /> },
        { id: 4, name: 'Lecturer Hall with All Equipment', icon: <Layers size={18} /> },
      ]
    },
    {
      id: 'meeting-rooms',
      title: 'Meeting Rooms',
      description: 'Professional spaces designed for collaborative meetings, workshops, and executive discussions.',
      icon: <Users size={28} />,
      subcategories: [
        { id: 5, name: 'Meeting Room with Projector', icon: <Zap size={18} /> },
        { id: 6, name: 'Meeting Room with Video Conferencing', icon: <Mic size={18} /> },
        { id: 7, name: 'Meeting Room with Smart Screen', icon: <Monitor size={18} /> },
        { id: 8, name: 'Meeting Room with all Equipments', icon: <Layers size={18} /> },
      ]
    },
    {
      id: 'lab-halls',
      title: 'LAB Halls',
      description: 'Specialized laboratories with cutting-edge technology for practical research and development.',
      icon: <Monitor size={28} />,
      subcategories: [
        { id: 9, name: 'LAB Room with Projector ', icon: <Cpu size={18} /> },
        { id: 10, name: 'LAB Room with Smart Screen', icon: <Wifi size={18} /> },
        { id: 11, name: 'LAB Room with Video Conferencing', icon: <Monitor size={18} /> },
        { id: 12, name: 'LAB Room with All Equipments', icon: <Zap size={18} /> },
      ]
    }
  ];

  const filteredCategories = categories.map(cat => ({
    ...cat,
    subcategories: cat.subcategories.filter(sub =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.subcategories.length > 0 || cat.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSubCategoryClick = (sub) => {
    setSelectedSubCategory(sub);
  };

 



};

  export default CatalogPage;
