import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {assets} from "../assets/assets"
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useEffect } from 'react'

const Navbar = () => {

    

    const {token,setToken,userData}=useContext(AppContext)
  
    const navigate=useNavigate();
    const [showMenu,setShowMenu]=useState(false);
    
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken(false)
    }

    useEffect(()=>{
        navigate('/')
    },[token])

  return (
    <div className='flex item-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        
        <img className='w-44 cursor-pointer' src={assets.MlogoT1} alt=""/>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to="/">
                <li className='py-1'>Home</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to="/doctors">
                <li className='py-1'>All Doctors</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to="/about">
                <li className='py-1'>About</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to="/contact">
                <li className='py-1'>Contacts</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            
        </ul>

        <div className='flex flex-center gap-4'>
            {
                token && userData ? 
                <div className='flex item-center gap-2 cursor-pointer group relative '>
                    <img className='w-8 rounded-full' src={userData.image} alt=""></img>
                    <img className='w-2.5' src={assets.dropdown_icon} alt=""></img>

                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                            <p className='hover:text-black cursor-pointer ' onClick={()=>{navigate("/my-profile")}}>My Profile</p>
                            <p className='hover:text-black cursor-pointer ' onClick={()=>{navigate("/my-appointments")}}>My Appointments</p>
                            <p className='hover:text-black cursor-pointer ' onClick={logout}>Logout</p>
                        </div>
                    </div>

                </div> 
                :<button className='bg-primary  px-8 py-3 rounded-full font-light md:block' onClick={()=>{
                navigate("/login")
            }}>Create Account</button>
            }
            <img onClick={()=>{setShowMenu(true)}} className='w-6 md:hidden' src={assets.menu_icon} />
            {/* Mobile Menu */}
            <div className={`${showMenu?'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.MlogoT1}/>
                    <img onClick={()=>{setShowMenu(false)}} className='w-7' src={assets.cross_icon}/>
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink onClick={()=>{setShowMenu(false)}} to='/'> <p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
                    <NavLink onClick={()=>{setShowMenu(false)}} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
                    <NavLink onClick={()=>{setShowMenu(false)}} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
                    <NavLink onClick={()=>{setShowMenu(false)}} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contacts</p></NavLink>
                </ul>
            </div>
        </div>

    </div>
  )
}

export default Navbar