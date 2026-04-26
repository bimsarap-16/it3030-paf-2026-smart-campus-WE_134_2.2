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
}

export default App
