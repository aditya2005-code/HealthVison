import { Doctor } from "../models/doctor.model";
import { Timeslot } from "../models/timeslot.models";
//Searched for the doctors from the list of available doctors and if th doctor is available(free) at that timeslot than making its avaliability false for that timeslot 
const createTimeslot = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;
        const doctor=await Doctor.findById(doctorId);
        if(!doctor){
            return res.status(404).json({ message: "Doctor not found" });
        }
        if(doctor.availability==false){
            return res.status(400).json({ message: "Doctor is not available" });
        }
        const timeslot = await Timeslot.create({ doctorId, date, time });
        res.status(201).json(timeslot);
        doctor.availability=false;
        await doctor.save();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTimeslots = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const timeslots = await Timeslot.find({ doctorId });
        res.status(200).json(timeslots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default { createTimeslot, getTimeslots };
