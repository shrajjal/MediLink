import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import userModel from "../models/userModel.js"
import appointmentModel from "../models/appointmentModel.js"
import jwt from 'jsonwebtoken'






// API to create doctor
const addDoctor=async (req,res)=>{
    try {
        
        const {name,email,password,speciality,degree,experience,about,fees,address}=req.body
        const imageFile=req.file
        
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address ){
            res.json({success:false,message:"Missing details"})
        }
        // validating email
        if(!validator.isEmail(email)){
            res.json({success:false,message:"Please add valid email"})
        }
        // validating strong password
        if(password.length<8){
            res.json({success:false,message:"Please enter strong password"})
        }

        // bcrypt the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt)


        // Parse address
        let parsedAddress
        try {
        parsedAddress = JSON.parse(address)
        } catch (err) {
        return res.json({ success: false, message: "Invalid address JSON format" })
        }

        // upload image to cloudinary
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl=imageUpload.secure_url

        const doctorData= {
            name,
            image:imageUrl,
            email,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:parsedAddress,
            date:Date.now()
        }

        // saving data in our database

        const newDoctor= new doctorModel(doctorData)
        await newDoctor.save()
        res.json({success:true,message:"Doctor added"})

        // console.log({name,email,password,speciality,degree,experience,about,fees,address},imageFile)
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// API for admin login

const loginAdmin = async (req,res)=>{
    try {

        const {email,password}=req.body
        // const navigate=useNavigate()
        console.log("NHI aaya na",email,password);

        if(email==process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid credentials"})
        }

        
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// API to get all doctor list for admin panel

const allDoctors = async (req,res)=>{

    try {

        const doctors= await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
        
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard}