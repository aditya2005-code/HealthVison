import { User } from "../models/user.model.js";
export const getCurrentUser=async(req,res,next)=>{
    try {
        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message:"User not found."});
        }
        return res.status(200).json({
            message:"User fetched successfully.",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                phone:user.phone,
                dateOfBirth:user.dateOfBirth,
                gender:user.gender,
                address:user.address,
                bloodGroup:user.bloodGroup,
                height:user.height,
                weight:user.weight,
                allergies:user.allergies,
                medicalHistory:user.medicalHistory,
                currentMedications:user.currentMedications,
                emergencyContact:user.emergencyContact,
                insurance:user.insurance,
                avatarUrl:user.avatarUrl
            }
        });
    } catch (error) {
        next(error);
    }
}