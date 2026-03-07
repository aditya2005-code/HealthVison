import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Activity, ShieldAlert, Heart, Plus, Save, Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user.service';
import Avatar from '../components/ui/Avatar';
import CropModal from '../components/ui/CropModal';
import toast from 'react-hot-toast';

export default function Profile() {
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
            country: ''
        },
        location: '',
        bloodGroup: '',
        height: '',
        weight: '',
        allergies: [],
        medicalHistory: [],
        currentMedications: [],
        emergencyContact: {
            name: '',
            phone: '',
            relation: ''
        },
        avatarUrl: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await userService.getCurrentUser();
            if (response.user) {
                const data = response.user;

                // Properly merge and handle nested objects to avoid overrides
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
                    },
                    emergencyContact: {
                        name: data.emergencyContact?.name || '',
                        phone: data.emergencyContact?.phone || '',
                        relation: data.emergencyContact?.relation || ''
                    },
                    // Convert objects to strings for the simple list UI if needed
                    allergies: Array.isArray(data.allergies) ? data.allergies : [],
                    medicalHistory: Array.isArray(data.medicalHistory)
                        ? data.medicalHistory.map(item => typeof item === 'object' ? (item.condition || '') : item)
                        : [],
                    currentMedications: Array.isArray(data.currentMedications)
                        ? data.currentMedications.map(item => typeof item === 'object' ? (item.name || '') : item)
                        : []
                }));
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

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
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
        // Reset the input so the same file can be selected again if needed
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
            // Format arrays for backend if they were converted to strings in UI
            if (updates.medicalHistory) {
                updates.medicalHistory = updates.medicalHistory.map(h => typeof h === 'string' ? { condition: h } : h);
            }
            if (updates.currentMedications) {
                updates.currentMedications = updates.currentMedications.map(m => typeof m === 'string' ? { name: m } : m);
            }

            // Remove non-updatable fields
            delete updates.email;
            delete updates.role;
            delete updates._id;
            delete updates.id;

            await userService.updateProfile(updates);
            toast.success('Profile updated successfully');
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
                    <h1 className="text-3xl font-bold text-gray-900">Manage Profile</h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Avatar Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Personal Information
                    </h2>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative group">
                            <Avatar src={formData.avatarUrl} alt={formData.name.first} className="w-32 h-32 border-4 border-blue-50 shadow-sm" />
                            <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-all group-hover:scale-110">
                                <Camera className="w-5 h-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input id="name.first" value={formData.name.first} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input id="name.last" value={formData.name.last} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (+91)</label>
                                <input id="phone" value={formData.phone} onChange={handleChange} placeholder="98765 43210" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select id="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input id="dateOfBirth" type="date" value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-600" />
                        Address Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input id="address.street" value={formData.address.street} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input id="address.city" value={formData.address.city} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                            <input id="address.state" value={formData.address.state} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                            <input id="address.zipCode" value={formData.address.zipCode} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input id="address.country" value={formData.address.country} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">General Location (shown on dashboard)</label>
                            <input id="location" value={formData.location} onChange={handleChange} placeholder="e.g., Kanpur, UP" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        Medical Vitals
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <select id="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                                <option value="">Select</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                            <input id="height" type="number" value={formData.height} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                            <input id="weight" type="number" value={formData.weight} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                        </div>
                    </div>
                </div>

                {/* Medical History Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-red-600" />
                                Allergies
                            </span>
                            <button type="button" onClick={() => addArrayItem('allergies')} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                        </h2>
                        <div className="space-y-3">
                            {formData.allergies.map((allergy, index) => (
                                <div key={index} className="flex gap-2">
                                    <input value={allergy} onChange={(e) => handleArrayChange('allergies', index, e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Peanuts" />
                                    <button type="button" onClick={() => removeArrayItem('allergies', index)} className="text-gray-400 hover:text-red-600 p-2">✕</button>
                                </div>
                            ))}
                            {formData.allergies.length === 0 && <p className="text-gray-400 text-sm italic">No allergies listed</p>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-600" />
                                Medications
                            </span>
                            <button type="button" onClick={() => addArrayItem('currentMedications')} className="text-blue-600 hover:bg-blue-50 p-1 rounded-full transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                        </h2>
                        <div className="space-y-3">
                            {formData.currentMedications.map((med, index) => (
                                <div key={index} className="flex gap-2">
                                    <input value={med} onChange={(e) => handleArrayChange('currentMedications', index, e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Paracetamol" />
                                    <button type="button" onClick={() => removeArrayItem('currentMedications', index)} className="text-gray-400 hover:text-red-600 p-2">✕</button>
                                </div>
                            ))}
                            {formData.currentMedications.length === 0 && <p className="text-gray-400 text-sm italic">No medications listed</p>}
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-600" />
                        Emergency Contact
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input id="emergencyContact.name" value={formData.emergencyContact.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (+91)</label>
                            <input id="emergencyContact.phone" value={formData.emergencyContact.phone} onChange={handleChange} placeholder="98765 43210" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                            <input id="emergencyContact.relation" value={formData.emergencyContact.relation} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500" />
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
