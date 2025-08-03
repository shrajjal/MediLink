import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({speciality,docId}) => {

    const {doctors}=useContext(AppContext);
    const [relDocs,setRelDocs]=useState([]);
    const navigate=useNavigate()

    useEffect(()=>{

        if(doctors.length >0 && speciality){
            const doctorsData=doctors.filter((doc)=> doc.speciality===speciality && doc._id !=docId)
            setRelDocs(doctorsData)
        }
    },[speciality,docId,doctors])

  return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>Related Doctors</h1>
        <p className='w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>

        <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>

            {relDocs.slice(0,5).map((item,index)=>(
                <div onClick={()=>{
                    navigate(`/appointment/${item._id}`);scrollTo(0,0)
                }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 ' key={index}>
                    <img className='bg-[#adeded]' src={item.image} alt=''></img>
                    <div className='p-4'>
                        <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                            <p className={`w-2 h-2 rounded-full ${item.available? 'bg-green-500':'bg-red-500'}`}></p>{item.available?<p className='text-green-500'>Available</p>:<p className='text-red-500'>Not Available</p>}
                        </div>
                        <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                        <p className='text-gray-600 text-sm'>{item.speciality}</p>
                    </div>
                </div>
            ))}

        </div>
        {/* <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className='bg-blue-50  text-gray-600 px-12 py-3 rounded-full mt-10'>more</button> */}
    </div>
  )
}

export default RelatedDoctors