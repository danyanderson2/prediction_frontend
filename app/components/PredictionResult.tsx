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
    if (score >= 90) return { label: 'Very High', color: 'text-green-600' };
    if (score >= 80) return { label: 'High', color: 'text-blue-600' };
    if (score >= 70) return { label: 'Moderate', color: 'text-yellow-600' };
    if (score >= 60) return { label: 'Low', color: 'text-orange-600' };
    return { label: 'Very Low', color: 'text-red-600' };
  };

  const confidenceLevel = getConfidenceLevel(confidence);

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <div className="bg-gradient-to-br from-[#0099FF] to-[#0066CC] rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">
              Predicted Weekly Sales
            </p>
            <h2 className="text-5xl font-bold">
              {result.predicted_weekly_sales.toFixed(2)}
            </h2>
            <p className="text-sm opacity-75 mt-2">units per week</p>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Target className="w-8 h-8" />
          </div>
        </div>

        {result.cold_start_detected && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
            <span className="text-sm font-medium">🆕 Cold-Start Product</span>
          </div>
        )}
      </div>

      {/* Confidence Interval */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-[#E6F5FF] rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#0099FF]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#2C2C2C]">
              95% Confidence Interval
            </h3>
            <p className="text-xs text-[#666666]">Prediction uncertainty range</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#E6F5FF] rounded-lg p-4">
            <p className="text-xs text-[#666666] mb-1">Lower Bound</p>
            <p className="text-2xl font-bold text-[#0099FF]">
              {result.confidence_interval_lower?.toFixed(2) ?? 'N/A'}
            </p>
          </div>
          <div className="bg-[#E6F5FF] rounded-lg p-4">
            <p className="text-xs text-[#666666] mb-1">Upper Bound</p>
            <p className="text-2xl font-bold text-[#0099FF]">
              {result.confidence_interval_upper?.toFixed(2) ?? 'N/A'}
            </p>
          </div>
        </div>

        {/* Range Visualization */}
        <div className="relative h-12 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-[#0099FF]/30 to-[#0099FF]/60 rounded-full"
            style={{
              left: '10%',
              right: '10%',
            }}
          ></div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-[#E5001A] rounded-full"
            style={{
              left: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-[#666666] mt-2">
          <span>{result.confidence_interval_lower?.toFixed(1) ?? 'N/A'}</span>
          <span className="font-medium text-[#E5001A]">
            {result.predicted_weekly_sales.toFixed(1)}
          </span>
          <span>{result.confidence_interval_upper?.toFixed(1) ?? 'N/A'}</span>
        </div>
      </div>

      {/* Model Info & Confidence */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#666666] mb-1">Model Used</p>
            <p className="font-semibold text-[#2C2C2C]">{result.model_used}</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-[#888888]">
                RMSE: {result.model_rmse.toFixed(4)}
              </p>
              <p className="text-xs text-[#888888]">
                R²: {(result.model_r2 * 100).toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#666666] mb-1">Confidence</p>
            <p className="font-semibold text-2xl text-[#0099FF]">
              {confidence.toFixed(1)}%
            </p>
            <p className={`text-xs font-medium mt-1 ${confidenceLevel.color}`}>
              {confidenceLevel.label}
            </p>
            <p className="text-xs text-[#888888] mt-1">
              Based on model metrics
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg p-6 border border-amber-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2C2C2C]">
                💡 Recommendations
              </h3>
              <p className="text-xs text-[#666666]">AI-generated insights</p>
            </div>
          </div>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-[#2C2C2C] bg-white p-3 rounded-lg border border-amber-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Baseline Comparison */}
      {result.baseline && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-[#E6F5FF] rounded-lg flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-[#0099FF]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2C2C2C]">
                Baseline Comparisons
              </h3>
              <p className="text-xs text-[#666666]">Historical averages</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-[#666666] mb-1">Family Average</p>
              <p className="text-lg font-semibold text-[#2C2C2C]">
                {result.baseline.family_avg.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-[#666666] mb-1">Brand Average</p>
              <p className="text-lg font-semibold text-[#2C2C2C]">
                {result.baseline.brand_avg.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-[#666666] mb-1">Region Average</p>
              <p className="text-lg font-semibold text-[#2C2C2C]">
                {result.baseline.region_avg.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-[#666666] mb-1">Store Size Average</p>
              <p className="text-lg font-semibold text-[#2C2C2C]">
                {result.baseline.storesize_avg.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
