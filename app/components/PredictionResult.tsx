'use client';

import { TrendingUp, TrendingDown, Target, Lightbulb, BarChart2, CheckCircle2 } from 'lucide-react';

interface PredictionResultProps {
  result: {
    predicted_weekly_sales: number;
    confidence_interval_lower?: number;
    confidence_interval_upper?: number;
    confidence_score: number;
    model_used: string;
    model_rmse: number;
    model_r2: number;
    cold_start_detected: boolean;
    recommendations: string[];
    baseline?: {
      family_avg: number;
      subfamily_avg: number;
      brand_avg: number;
      region_avg: number;
      storesize_avg: number;
      combined_avg: number;
    };
  };
}

export default function PredictionResult({ result }: PredictionResultProps) {
  const confidence = result.confidence_score;

  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (score >= 80) return { label: 'High', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (score >= 70) return { label: 'Moderate', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
    if (score >= 60) return { label: 'Low', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    return { label: 'Very Low', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const confidenceLevel = getConfidenceLevel(confidence);

  return (
    <div className="space-y-4">
      {/* Main Prediction Card */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-3xl shadow-material-16 p-10 text-white relative overflow-hidden border-4 border-blue-500">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white opacity-10 rounded-full -mr-36 -mt-36 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-red-500 opacity-15 rounded-full -ml-28 -mb-28"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-white/10 rounded-full"></div>
        <div className="relative z-10 flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="inline-flex items-center space-x-2 mb-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border-2 border-white/40">
              <Target className="w-5 h-5" />
              <p className="text-sm font-bold uppercase tracking-widest">
                Weekly Sales Forecast
              </p>
            </div>
            <h2 className="text-8xl font-black mb-3 tracking-tighter drop-shadow-2xl">
              {result.predicted_weekly_sales.toFixed(2)}
            </h2>
            <p className="text-xl opacity-95 font-bold uppercase tracking-wide">units per week</p>
          </div>
          <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center border-4 border-white/40 shadow-material-8">
            <Target className="w-14 h-14" strokeWidth={2.5} />
          </div>
        </div>

        {result.cold_start_detected && (
          <div className="relative z-10 bg-red-600 rounded-xl px-6 py-3 inline-flex items-center space-x-2 shadow-material-8 border-2 border-red-400 animate-pulse">
            <span className="text-base font-black uppercase tracking-widest">🆕 Cold-Start Product</span>
          </div>
        )}
      </div>

      {/* Confidence Interval */}
      <div className="bg-white rounded-2xl shadow-material-8 p-8 border-l-8 border-blue-600 hover:shadow-material-16 transition-all">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center border-2 border-blue-400 shadow-material-4">
            <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">
              95% Confidence Interval
            </h3>
            <p className="text-sm text-gray-600 font-bold">Prediction uncertainty range</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
            <p className="text-xs text-gray-700 mb-1 font-bold uppercase tracking-wide">Lower Bound</p>
            <p className="text-2xl font-bold text-blue-600">
              {result.confidence_interval_lower?.toFixed(2) ?? 'N/A'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
            <p className="text-xs text-gray-700 mb-1 font-bold uppercase tracking-wide">Upper Bound</p>
            <p className="text-2xl font-bold text-blue-600">
              {result.confidence_interval_upper?.toFixed(2) ?? 'N/A'}
            </p>
          </div>
        </div>

        {/* Range Visualization */}
        <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 rounded-xl"
            style={{
              left: '10%',
              right: '10%',
            }}
          ></div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-10 bg-red-600 rounded-full shadow-lg"
            style={{
              left: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2 font-semibold">
          <span>{result.confidence_interval_lower?.toFixed(1) ?? 'N/A'}</span>
          <span className="font-bold text-red-600">
            🎯 {result.predicted_weekly_sales.toFixed(1)}
          </span>
          <span>{result.confidence_interval_upper?.toFixed(1) ?? 'N/A'}</span>
        </div>
      </div>

      {/* Model Info & Confidence */}
      <div className="bg-white rounded-xl shadow-material-4 p-6 border-l-4 border-red-600">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1 font-bold uppercase tracking-wide">Model Used</p>
            <p className="text-base font-bold text-gray-900 mb-3">{result.model_used}</p>
            <div className="space-y-1 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-600">
                RMSE: <span className="font-bold text-gray-900">{result.model_rmse.toFixed(4)}</span>
              </p>
              <p className="text-xs text-gray-600">
                R²: <span className="font-bold text-gray-900">{(result.model_r2 * 100).toFixed(2)}%</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1 font-bold uppercase tracking-wide">Confidence Score</p>
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {confidence.toFixed(1)}%
            </p>
            <div className={`inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-bold border-2 ${confidenceLevel.bgColor} ${confidenceLevel.color} ${confidenceLevel.borderColor}`}>
              {confidenceLevel.label}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Based on model metrics
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-material-4 p-6 border-2 border-amber-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center shadow-material-2">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                💡 Recommendations
              </h3>
              <p className="text-xs text-gray-600 font-medium">AI-generated insights</p>
            </div>
          </div>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-800 bg-white p-3 rounded-lg border border-amber-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Baseline Comparison */}
      {result.baseline && (
        <div className="bg-white rounded-lg shadow-material-4 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">
                Baseline Comparisons
              </h3>
              <p className="text-xs text-gray-600">Historical averages</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Family Average</p>
              <p className="text-lg font-medium text-gray-900">
                {result.baseline.family_avg.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Brand Average</p>
              <p className="text-lg font-medium text-gray-900">
                {result.baseline.brand_avg.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Region Average</p>
              <p className="text-lg font-medium text-gray-900">
                {result.baseline.region_avg.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded p-3 border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Store Size Average</p>
              <p className="text-lg font-medium text-gray-900">
                {result.baseline.storesize_avg.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
