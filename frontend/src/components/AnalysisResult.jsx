import React from 'react';
import { FileText, Brain, Lightbulb, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const AnalysisResult = ({ report }) => {
    const { analysisResult, extractedText } = report;

    if (!analysisResult) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Analysis Available</h3>
                <p className="text-gray-600">This report hasn't been analyzed yet.</p>
            </div>
        );
    }

    // Handle error state
    if (analysisResult.error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start">
                    <XCircle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis Failed</h3>
                        <p className="text-gray-600 mb-3">{analysisResult.error}</p>
                        {!analysisResult.mlApiAvailable && (
                            <p className="text-sm text-gray-500">
                                The ML service is currently unavailable. Please try again later.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Extracted Text Section */}
            {extractedText && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-50 p-2 rounded-lg mr-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Extracted Text</h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <p className="text-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                            {extractedText}
                        </p>
                    </div>
                </div>
            )}

            {/* Analysis Section */}
            {analysisResult.analysis && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm border border-purple-200 p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
                            <Brain className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">AI Analysis</h3>
                    </div>
                    <div className="bg-white rounded-lg p-5 shadow-sm">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {analysisResult.analysis}
                        </p>
                    </div>
                </div>
            )}

            {/* Insights Section */}
            {analysisResult.insights && analysisResult.insights.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-green-50 p-2 rounded-lg mr-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Key Insights</h3>
                    </div>
                    <div className="space-y-3">
                        {analysisResult.insights.map((insight, index) => (
                            <div
                                key={index}
                                className="flex items-start bg-green-50 rounded-lg p-4 border border-green-100"
                            >
                                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                </div>
                                <p className="text-gray-700 flex-1">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations Section */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm border border-amber-200 p-6">
                    <div className="flex items-center mb-4">
                        <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
                            <Lightbulb className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Recommendations</h3>
                    </div>
                    <div className="space-y-3">
                        {analysisResult.recommendations.map((recommendation, index) => (
                            <div
                                key={index}
                                className="flex items-start bg-white rounded-lg p-4 shadow-sm"
                            >
                                <div className="bg-amber-100 rounded-full p-1 mr-3 mt-0.5">
                                    <Lightbulb className="w-4 h-4 text-amber-600" />
                                </div>
                                <p className="text-gray-700 flex-1">{recommendation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Analysis Timestamp */}
            {analysisResult.analyzedAt && (
                <div className="text-center text-sm text-gray-500">
                    Analysis completed on {new Date(analysisResult.analyzedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            )}
        </div>
    );
};

export default AnalysisResult;
