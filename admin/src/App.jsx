import React from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AddDoctor from './pages/Admin/AddDoctor';
import AllApointments from './pages/Admin/AllApointments';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';

const App = () => {

  const {aToken}=useContext(AdminContext)
  const {dToken}=useContext(DoctorContext)

  return aToken || dToken ?(
    <div className='bg-[#C8A2C8]'>
      <ToastContainer/>
      <NavBar/>
      
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/* Routes for Admin */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/all-apointments' element={<AllApointments/>} />
          <Route path='/doctor-list' element={<DoctorsList/>} />

          {/* Routes for Doctor */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ):(
    <>
      <Login/>
      <ToastContainer/>
    </>
    )
  }
  


export default App
