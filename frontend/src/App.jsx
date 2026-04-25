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
}

export default App;
