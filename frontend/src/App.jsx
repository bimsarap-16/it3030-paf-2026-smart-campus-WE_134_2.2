<<<<<<< HEAD
import { useState } from 'react'
import AdminDashboard from './pages/adminDashboard';
import CatalogPage from './pages/CatalogPage';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AddResources from './pages/AddResources';
import LecturerDashboard from './pages/lecturerDashboard';

import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  
  const [resources, setResources] = useState([]);

  return (
    
      
        <div className="hero">
            {currentPage === 'catalog' && <CatalogPage setPage={setCurrentPage} user={user} />}
            {currentPage === 'admin' && <AdminDashboard setPage={setCurrentPage} user={user} setUser={setUser} />}
            {currentPage === 'technician' && <TechnicianDashboard setPage={setCurrentPage} user={user} setUser={setUser} />}
            {currentPage === 'addresources' && <AddResources setPage={setCurrentPage} user={user} setUser={setUser} />}
             </div>
  )
=======
import React, { useState } from 'react';
import AdminDashboard from './pages/adminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import LecturerDashboard from './pages/lecturerDashboard';


function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [resources, setResources] = useState([]); // Share resources across pages

  return (
    <div className="App">

      {currentPage === 'filter' && <FilterPage setPage={setCurrentPage} user={user} />}
      {currentPage === 'admin' && <AdminDashboard setPage={setCurrentPage} user={user} setUser={setUser} />}
      {currentPage === 'technician' && <TechnicianDashboard setPage={setCurrentPage} user={user} setUser={setUser} />}
      {currentPage === 'lecturer' && (
        <LecturerDashboard 
          setPage={setCurrentPage} 
          user={user} 
          setUser={setUser} 
          setSelectedBooking={setSelectedBooking}
          setResources={setResources}
        />
      )}
      {currentPage === 'booking-detail' && (
        <BookingDetail 
          booking={selectedBooking} 
          setPage={setCurrentPage} 
          resources={resources} 
        />
      )}
    </div>
  );
>>>>>>> feature/dias/ticket-management
}

export default App;
