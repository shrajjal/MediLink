import React, { useContext, useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import {toast} from 'react-toastify'

const Appointment = () => {

  const {doctors,currencySymbol,token,backendUrl,getDoctorsData}=useContext(AppContext);
  const navigate=useNavigate()

  const daysOfWeek=['MON','TUE','WED','THRU','FRI','SAT','SUN'];

  const {docId}=useParams()
  // console.log(docId)
  const[docInfo,setDocInfo]=useState(null);

  const [docSlots,setDocSlots]=useState([])
  const [slotIndex,setSlotIndex]=useState(0)
  const [slotTime,setSlotTime]=useState('')

  const bookAppointment = async () => {
      if (!token) {
        toast.warn("Login to book appointment");
        return navigate("/login");
      }

      try {
        const date = docSlots[slotIndex][0].datetime;

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        const slotDate = day + "_" + month + "_" + year;

        // console.log(slotDate)

        const { data } = await axios.post(
          backendUrl + "/api/user/book-appointment",
          { docId, slotDate, slotTime },
          { headers: { token } }
        );
        if (data.success) {
          toast.success(data.message);
          getDoctorsData();
          navigate("/my-appointments");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

  const fetchDocInfo=  ()=>{
    
    const docInfo=  doctors.find(doc => doc._id == docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }

  const getAvailableSlots = async () => {
  setDocSlots([]); // Clear previous slots

  let today = new Date();

  for (let i = 0; i < 7; i++) {
    // Create date for the day
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    // Set end time to 9 PM of that day
    let endTime = new Date();
    endTime.setDate(today.getDate() + i);
    endTime.setHours(21, 0, 0, 0); // 9:00:00 PM

    // Set starting time
    if (today.getDate() === currentDate.getDate()) {
      // For today — start from the next valid half-hour slot after current time or 10:00 AM
      let hour = currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10;
      let minutes = currentDate.getMinutes() > 30 ? 30 : 0;
      currentDate.setHours(hour);
      currentDate.setMinutes(minutes);
    } else {
      // For future days — start at 10:00 AM
      currentDate.setHours(10);
      currentDate.setMinutes(0);
    }

    let timeSlots = [];

    // Generate 30-minute slots till 9:00 PM
    while (currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          // add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    // Add today's slots to all slots
    setDocSlots(prev => [...prev, timeSlots]);
    }
  };


  useEffect(()=>{
    fetchDocInfo()
  },[doctors,docId]
  )

  useEffect(()=>{
    if (docInfo && docInfo.slots_booked) {
    getAvailableSlots();
  }
  },[docInfo])


  useEffect(()=>{
    console.log(docSlots);
    
  },[docSlots])

  

  return docInfo && (
    <div>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image}></img>
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} 
            <img className='w-5' src={assets.verified_icon}></img>
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full '>{docInfo.experience}</button>
          </div>



          <div className=''>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon}></img></p>
            <p className='text-sm text-gray-500 mt-1 max-w-[700px]'>{docInfo.about}</p>
          </div>
          

         <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span> </p>


        </div>

      </div>

      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index)=>(
              <div onClick={()=>{setSlotIndex(index)}} className= {`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ? 'bg-primary text-white' :'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex item-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots[slotIndex] && docSlots[slotIndex].map((item,index)=>(
            <p onClick={()=>{setSlotTime(item.time)}} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time ===slotTime ? 'bg-primary text-white' :'text-gray-400 border border-gray-300'}`} key={index}>{item.time.toLowerCase()}</p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
      </div>


      <RelatedDoctors speciality={docInfo.speciality} docId={docInfo._id}/>



    </div>
  )
}

export default Appointment


