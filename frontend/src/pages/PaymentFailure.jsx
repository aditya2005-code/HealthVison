import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-6 border-4 border-white shadow-lg">
                <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-8 mt-2 max-w-md">
                We couldn't process your payment. Please try again or use a different payment method.
            </p>
            <button
                onClick={() => navigate('/appointments')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
                Return to Appointments
            </button>
        </div>
    );
};

export default PaymentFailure;
