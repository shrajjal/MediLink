import express from 'express'
import { appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList, doctorProfile, loginDoctor, updateDoctorProfile } from '../controllers/doctorController.js';
import doctorModel from '../models/doctorModel.js';
import authDoctor from '../middlewares/authDoctor.js';
import { appointmentCancel } from '../controllers/adminController.js';


const doctorRouter=express.Router();


doctorRouter.get('/list',doctorList)
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/appointments",authDoctor,appointmentsDoctor);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);


// this API is used to update the mongodb database because of change in schema
doctorRouter.get('/migrate-slots', async (req, res) => {
  try {
    const result = await doctorModel.updateMany(
      { slot_booked: { $exists: true } },
      [
        { $set: { slots_booked: "$slot_booked" } },
        { $unset: "slot_booked" }
      ]
    );

    res.json({ success: true, message: "Migration completed", result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




export default doctorRouter