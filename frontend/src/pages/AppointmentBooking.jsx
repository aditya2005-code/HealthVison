import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, User, CheckCircle } from 'lucide-react';
import DoctorSelection from '../components/Appointment/DoctorSelection';
import TimeslotSelection from '../components/Appointment/TimeslotSelection';
import BookingConfirmation from '../components/Appointment/BookingConfirmation';
import appointmentService from '../services/appointment.service';
import paymentService from '../services/payment.service';
import authService from '../services/auth.service';
import toast from 'react-hot-toast';

const AppointmentBooking = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleConfirmBooking = async () => {
        try {
            setLoading(true);
            const bookingData = {
                doctorId: selectedDoctor._id,
                date: selectedSlot.date,
                time: selectedSlot.time,
                doctorName: selectedDoctor.name,
                status: 'confirmed'
            };

            // 1. Create Appointment
            const appointmentRes = await appointmentService.bookAppointment(bookingData);
            const appointmentId = appointmentRes.data?._id;

            if (!appointmentId) {
                throw new Error("Failed to retrieve appointment ID");
            }

            // 2. Initiate Payment (Create Order on Backend)
            const fee = selectedDoctor.fee || selectedDoctor.fees || 500;
            const paymentRes = await paymentService.createPayment(fee, appointmentId);
            const order = paymentRes.order;

            // 3. Open Razorpay Checkout Modal
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mock_key", // Fallback for dev if not set
                amount: order.amount,
                currency: order.currency,
                name: "HealthVision",
                description: `Consultation with Dr. ${selectedDoctor.name}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 4. Verify Payment on Backend
                        toast.loading('Verifying payment...', { id: 'payment-verify' });
                        await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        toast.success('Payment successful & Appointment confirmed!', { id: 'payment-verify' });
                        navigate('/payment/success');
                    } catch (error) {
                        toast.error(error.response?.data?.message || 'Payment verification failed', { id: 'payment-verify' });
                        console.error("Payment Verification Error:", error);
                        navigate('/payment/failure');
                    }
                },
                prefill: {
                    name: authService.getCurrentUser()?.name || authService.getCurrentUser()?.name?.first || "Patient",
                    email: authService.getCurrentUser()?.email || "patient@example.com",
                    contact: authService.getCurrentUser()?.phone || "9999999999"
                },
                theme: {
                    color: "#2563eb"
                }
            };

            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', function (response) {
                toast.error(`Payment Failed: ${response.error.description || 'An error occurred'}`);
                console.error("Payment Failed:", response.error);
                navigate('/payment/failure');
            });

            rzp.open();

        } catch (error) {
            console.error('Booking/Payment failed:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Select Doctor', icon: User },
        { number: 2, title: 'Choose Slot', icon: Calendar },
        { number: 3, title: 'Confirm', icon: CheckCircle }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => {
                        if (step > 1) setStep(step - 1);
                        else navigate(-1);
                    }}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Book Appointment</h1>
                <p className="text-gray-600 mt-1">Schedule a consultation with our specialists</p>
            </div>

            {/* Stepper */}
            <div className="mb-10">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 transition-all duration-300 -z-10"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>

                    {steps.map((s) => (
                        <div key={s.number} className="flex flex-col items-center bg-white px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= s.number
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'bg-white border-gray-300 text-gray-400'
                                }`}>
                                {step > s.number ? <Check className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                            </div>
                            <span className={`mt-2 text-xs font-semibold uppercase tracking-wider ${step >= s.number ? 'text-blue-600' : 'text-gray-400'
                                }`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 min-h-[400px]">
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold mb-6">Choose a Specialist</h2>
                        <DoctorSelection
                            onSelect={handleDoctorSelect}
                            selectedDoctorId={selectedDoctor?._id}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-xl font-bold">Select Date & Time</h2>
                            <TimeslotSelection
                                doctorId={selectedDoctor?._id}
                                onSelect={handleSlotSelect}
                                selectedSlot={selectedSlot}
                            />

                            <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!selectedSlot}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                                >
                                    Continue to Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <BookingConfirmation
                            doctor={selectedDoctor}
                            date={selectedSlot?.date}
                            time={selectedSlot?.time}
                            onConfirm={handleConfirmBooking}
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentBooking;
