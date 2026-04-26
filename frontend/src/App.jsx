 
import { useState } from 'react'
import AdminDashboard from './pages/adminDashboard';
import CatalogPage from './pages/CatalogPage';
import TechnicianDashboard from './pages/TechnicianDashboard';
import LoginPage from './pages/loginPage';
import AddResources from './pages/AddResources';
import LandingPage from './pages/LandingPage';
import LecturerDashboard from './pages/lecturerDashboard';

import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [resources, setResources] = useState([]); // Share resources across pages

  return (
    
      
        <div className="hero">
            {currentPage === 'catalog' && <CatalogPage setPage={setCurrentPage} user={user} />}
            {currentPage === 'admin' && <AdminDashboard setPage={setCurrentPage} user={user} setUser={setUser} />}
            {currentPage === 'technician' && <TechnicianDashboard setPage={setCurrentPage} user={user} setUser={setUser} />}
            {currentPage === 'addresources' && <AddResources setPage={setCurrentPage} user={user} setUser={setUser} />}
            {currentPage === 'filter' && <FilterPage setPage={setCurrentPage} user={user} />}
            {currentPage === 'admin' && <AdminDashboard setPage={setCurrentPage} user={user} setUser={setUser} />}
            {currentPage === 'technician' && <TechnicianDashboard setPage={setCurrentPage} user={user} setUser={setUser} />}
            {currentPage === 'landing' && <LandingPage setPage={setCurrentPage} />}
            {currentPage === 'login' && <LoginPage setPage={setCurrentPage} setUser={setUser} />}
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
} 
 

export default App;
 
