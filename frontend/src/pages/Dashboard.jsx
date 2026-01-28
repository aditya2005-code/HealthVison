export default function Dashboard() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome to HealthVision</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-semibold text-blue-600 mb-2">Upload Report</h3>
                    <p className="text-gray-600 mb-4">Analyze medical reports using AI.</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload Now</button>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-semibold text-green-600 mb-2">Book Appointment</h3>
                    <p className="text-gray-600 mb-4">Consult with top doctors.</p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded">Book Now</button>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">Symptom Chat</h3>
                    <p className="text-gray-600 mb-4">Check symptoms instantly.</p>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded">Start Chat</button>
                </div>
            </div>
        </div>
    );
}
