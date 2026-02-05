import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import ReportCard from '../components/ReportCard';
import reportService from '../services/report.service';
import toast from 'react-hot-toast';

const Reports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await reportService.getUserReports();
            setReports(response.reports || []);
        } catch (err) {
            setError(err.message || 'Failed to load reports');
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async (reportId) => {
        try {
            setAnalyzingId(reportId);
            const response = await reportService.analyzeReport(reportId);

            if (response.mlApiAvailable === false) {
                toast.error('ML service is currently unavailable. Please try again later.');
            } else {
                toast.success('Report analyzed successfully!');
            }

            // Refresh reports to get updated status
            await fetchReports();
        } catch (err) {
            const errorMessage = err.message || 'Failed to analyze report';
            toast.error(errorMessage);
            console.error('Analysis error:', err);
        } finally {
            setAnalyzingId(null);
        }
    };

    const handleView = (reportId) => {
        navigate(`/reports/${reportId}`);
    };

    const handleDelete = async (reportId) => {
        if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            return;
        }

        try {
            await reportService.deleteReport(reportId);
            toast.success('Report deleted successfully');
            await fetchReports();
        } catch (err) {
            toast.error(err.message || 'Failed to delete report');
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your reports...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Reports</h1>
                    <p className="text-gray-600">
                        Manage and analyze your medical reports
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchReports}
                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                    <button
                        onClick={() => navigate('/reports/upload')}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-semibold flex items-center transition-all shadow-md hover:shadow-lg"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Report
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start">
                        <AlertCircle className="w-6 h-6 text-red-600 mt-1 mr-3" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Error Loading Reports</h3>
                            <p className="text-gray-600">{error}</p>
                            <button
                                onClick={fetchReports}
                                className="mt-3 text-red-600 hover:text-red-700 font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reports List */}
            {!error && reports.length === 0 ? (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200 p-12 text-center">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <FileText className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Reports Yet</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Upload your first medical report to get started with AI-powered analysis and insights.
                    </p>
                    <button
                        onClick={() => navigate('/reports/upload')}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center transition-all shadow-md hover:shadow-lg"
                    >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Your First Report
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reports.map((report) => (
                        <ReportCard
                            key={report._id}
                            report={report}
                            onAnalyze={handleAnalyze}
                            onView={handleView}
                            onDelete={handleDelete}
                            isAnalyzing={analyzingId === report._id}
                        />
                    ))}
                </div>
            )}

            {/* Info Section */}
            {reports.length > 0 && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">About Report Analysis</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span>Click "Analyze Report" to process your medical report with AI</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span>Analysis uses advanced OCR and machine learning to extract insights</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span>View detailed analysis results including recommendations and key findings</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span>All reports are securely stored and only accessible to you</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Reports;
