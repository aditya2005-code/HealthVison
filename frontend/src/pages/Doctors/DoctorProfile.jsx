import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Activity, Save, Camera, ArrowLeft, GraduationCap, Briefcase, IndianRupee, Notebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/user.service';
import doctorService from '../../services/doctor.service';
import Avatar from '../../components/ui/Avatar';
import CropModal from '../../components/ui/CropModal';
import toast from 'react-hot-toast';

export default function DoctorProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [formData, setFormData] = useState({
        name: { first: '', last: '' },
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        },
        avatarUrl: ''
    });

    const [doctorData, setDoctorData] = useState({
        specialization: '',
        experience: '',
        about: '',
        qualifications: '',
        location: '',
        registration: '',
        contact: '',
        fee: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await userService.getCurrentUser();
            if (response.user) {
                const data = response.user;
                setFormData(prev => ({
                    ...prev,
                    ...data,
                    name: {
                        first: data.name?.first || '',
                        last: data.name?.last || ''
                    },
                    address: {
                        street: data.address?.street || '',
                        city: data.address?.city || '',
                        state: data.address?.state || '',
                        zipCode: data.address?.zipCode || '',
                        country: data.address?.country || ''
                    }
                }));

                const docProfile = await doctorService.getMyProfile();
                if (docProfile && docProfile.data) {
                    setDoctorData(prev => ({
                        ...prev,
                        ...docProfile.data
                    }));
                }
            }
        } catch (error) {
            console.error('Fetch profile error:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id.includes('.')) {
            const [parent, child] = id.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleDoctorChange = (e) => {
        const { id, value } = e.target;
        setDoctorData(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size must be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageToCrop(reader.result);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleCropComplete = (croppedImage) => {
        setFormData(prev => ({ ...prev, avatarUrl: croppedImage }));
        setImageToCrop(null);
    };

    const handleCropCancel = () => {
        setImageToCrop(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updates = { ...formData };
            delete updates.email;
            delete updates.role;
            delete updates._id;
            delete updates.id;

            await userService.updateProfile(updates);
            await doctorService.updateMyProfile(doctorData);

            toast.success('Professional profile updated successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Professional Dashboard</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        Basic Information
                    </h2>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative group">
                            <Avatar src={formData.avatarUrl} alt={formData.name.first} className="w-32 h-32 border-4 border-indigo-50 shadow-sm" />
                            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 shadow-md transition-all group-hover:scale-110">
                                <Camera className="w-5 h-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input id="name.first" value={formData.name.first} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input id="name.last" value={formData.name.last} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input id="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select id="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input id="dateOfBirth" type="date" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        Professional Credentials
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                            <input id="specialization" value={doctorData.specialization} onChange={handleDoctorChange} placeholder="e.g. Cardiologist" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                            <input id="qualifications" value={doctorData.qualifications} onChange={handleDoctorChange} placeholder="e.g. MBBS, MD" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                            <input id="experience" type="number" value={doctorData.experience} onChange={handleDoctorChange} placeholder="5" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                            <input id="registration" value={doctorData.registration} onChange={handleDoctorChange} placeholder="MCI/123456" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-orange-600" />
                        Consultation Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <IndianRupee className="w-4 h-4" /> Consultation Fee
                            </label>
                            <input id="fee" type="number" value={doctorData.fee} onChange={handleDoctorChange} placeholder="500" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Location</label>
                            <input id="location" value={doctorData.location} onChange={handleDoctorChange} placeholder="Kanpur, Uttar Pradesh" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Contact Info</label>
                            <input id="contact" value={doctorData.contact} onChange={handleDoctorChange} placeholder="Clinic Phone or Email" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <Notebook className="w-4 h-4" /> About Your Practice
                            </label>
                            <textarea id="about" value={doctorData.about} onChange={handleDoctorChange} rows="4" placeholder="Tell your patients about your expertise and background..." className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Office/Home Address */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        Administrative Address
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input id="address.street" value={formData.address.street} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input id="address.city" value={formData.address.city} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input id="address.state" value={formData.address.state} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                            <input id="address.zipCode" value={formData.address.zipCode} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input id="address.country" value={formData.address.country} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                    </div>
                </div>
            </form>

            {imageToCrop && (
                <CropModal
                    image={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </div>
    );
}
