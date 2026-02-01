import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, description }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            {description && (
                <p className="text-sm text-gray-400 mt-4">{description}</p>
            )}
        </div>
    );
};

export default StatCard;
