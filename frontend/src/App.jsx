import React, { useState } from 'react';
import AdminDashboard from './pages/adminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import LoginPage from './pages/loginPage';
import LandingPage from './pages/LandingPage';
import LecturerDashboard from './pages/lecturerDashboard';



function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      {currentPage === 'landing' && <LandingPage setPage={setCurrentPage} />}
      {currentPage === 'login' && <LoginPage setPage={setCurrentPage} setUser={setUser} />}
      {currentPage === 'admin' && <AdminDashboard setPage={setCurrentPage} user={user} setUser={setUser} />}
      {currentPage === 'technician' && <TechnicianDashboard setPage={setCurrentPage} user={user} setUser={setUser} />}

      {currentPage === 'lecturer' && (
        <LecturerDashboard 
          setPage={setCurrentPage} 
          user={user} 
          setUser={setUser} 

      
          />
      )}
      
      </div>
  );
}
export default App;