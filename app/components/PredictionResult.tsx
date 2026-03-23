'use client';

import { useState } from 'react';
import { TrendingUp, Target, BarChart2, CheckCircle2, FileDown, MessageCircle, Truck } from 'lucide-react';
import dynamic from 'next/dynamic';

const ChatModal = dynamic(() => import('./ChatModal'), { ssr: false });

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ReferenceBaseline {
  family_avg: number;
  subfamily_avg: number;
  brand_avg: number;
  region_avg: number;
  storesize_avg: number;
  combined_avg: number;
}

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
    reference_baseline?: ReferenceBaseline;
  };
  inputData?: { family: string; brand: string };
}

export default function PredictionResult({ result, inputData }: PredictionResultProps) {
  const [showChat, setShowChat] = useState(false);
  // Persistent chat history — survives modal open/close until page reload
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { predicted_weekly_sales: pred, confidence_score: score } = result;

  const getConfidenceLevel = (s: number) => {
    if (s >= 90) return { label: 'Very High', color: 'text-green-600' };
    if (s >= 75) return { label: 'High', color: 'text-blue-600' };
    if (s >= 60) return { label: 'Moderate', color: 'text-yellow-600' };
    if (s >= 45) return { label: 'Low', color: 'text-orange-600' };
    return { label: 'Very Low', color: 'text-red-600' };
  };

  const confidenceLevel = getConfidenceLevel(score);
  const lower = result.confidence_interval_lower ?? pred * (score / 100);
  const upper = result.confidence_interval_upper ?? pred * (2 - score / 100);

  const barMax = upper * 1.15;
  const lowerPct = barMax > 0 ? (lower / barMax) * 100 : 0;
  const predPct = barMax > 0 ? (pred / barMax) * 100 : 50;
  const upperPct = barMax > 0 ? (upper / barMax) * 100 : 100;

  const exportJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prediction_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const blue: [number, number, number] = [0, 153, 255];
    const dark: [number, number, number] = [44, 44, 44];
    const gray: [number, number, number] = [102, 102, 102];

    // Header
    doc.setFillColor(...blue);
    doc.rect(0, 0, 210, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales Prediction Report', 14, 14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }), 140, 14);

    // Prediction block
    doc.setTextColor(...dark);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Predicted Weekly Sales', 14, 36);
    doc.setFontSize(26);
    doc.setTextColor(...blue);
    doc.text(`${pred.toFixed(2)} units/week`, 14, 48);

    // Confidence
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(`Confidence: ${score.toFixed(1)}% (${confidenceLevel.label})`, 14, 58);
    doc.text(`Range: ${lower.toFixed(2)} – ${upper.toFixed(2)} units/week`, 14, 65);

    // Model info
    doc.setTextColor(...dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Model', 14, 76);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(result.model_used, 14, 83);
    doc.text(`RMSE ${result.model_rmse.toFixed(4)}   R² ${(result.model_r2 * 100).toFixed(2)}%   Cold-Start: ${result.cold_start_detected ? 'Yes' : 'No'}`, 14, 90);

    // Baseline
    let y = 101;
    if (result.reference_baseline) {
      doc.setFillColor(230, 245, 255);
      doc.rect(10, 95, 190, 32, 'F');
      doc.setTextColor(...dark);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('N-1 Reference Baseline (last year)', 14, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...gray);
      doc.setFontSize(9);
      const b = result.reference_baseline;
      doc.text(`Family: ${b.family_avg.toFixed(2)}   Brand: ${b.brand_avg.toFixed(2)}   Region: ${b.region_avg.toFixed(2)}   Store: ${b.storesize_avg.toFixed(2)}`, 14, y);
      y += 7;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...blue);
      doc.text(`Combined Reference: ${b.combined_avg.toFixed(2)} units/week`, 14, y);
      y += 12;
    }

    // Insights
    if (result.recommendations?.length) {
      doc.setTextColor(...dark);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Logistics Insights', 14, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...gray);
      doc.setFontSize(9);
      for (const rec of result.recommendations) {
        const lines = doc.splitTextToSize(`• ${rec}`, 182);
        if (y + lines.length * 5 > 285) { doc.addPage(); y = 20; }
        doc.text(lines, 14, y);
        y += lines.length * 5 + 2;
      }
    }

    doc.save(`prediction_report_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Export buttons */}
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={exportJSON}
          className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-[#E5001A] bg-white border border-[#E5001A] rounded-lg hover:bg-[#FFE6E9] transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export JSON</span>
        </button>
        <button
          onClick={exportPDF}
          className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-[#0099FF] bg-white border border-[#0099FF] rounded-lg hover:bg-[#E6F5FF] transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Main Prediction Card */}
      <div className="bg-gradient-to-br from-[#0099FF] to-[#0066CC] rounded-2xl shadow-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">Predicted Weekly Sales</p>
            <h2 className="text-5xl font-bold">{pred.toFixed(2)}</h2>
            <p className="text-sm opacity-75 mt-2">units per week</p>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Target className="w-8 h-8" />
          </div>
        </div>
        {result.cold_start_detected && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
            <span className="text-sm font-medium">New Product — No Sales History</span>
          </div>
        )}
      </div>

      {/* Confidence + CI Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-[#E6F5FF] rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#0099FF]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#2C2C2C]">Confidence Interval</h3>
            <p className="text-xs text-[#666666]">
              ±{(100 - score).toFixed(1)}% of prediction &nbsp;·&nbsp; confidence&nbsp;
              <span className={`font-semibold ${confidenceLevel.color}`}>
                {score.toFixed(1)}% ({confidenceLevel.label})
              </span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#E6F5FF] rounded-lg p-4">
            <p className="text-xs text-[#666666] mb-1">Lower Bound</p>
            <p className="text-2xl font-bold text-[#0099FF]">{lower.toFixed(2)}</p>
          </div>
          <div className="bg-[#E6F5FF] rounded-lg p-4">
            <p className="text-xs text-[#666666] mb-1">Upper Bound</p>
            <p className="text-2xl font-bold text-[#0099FF]">{upper.toFixed(2)}</p>
          </div>
        </div>
        <div className="relative h-10 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-[#0099FF]/30 to-[#0099FF]/60 rounded-full"
            style={{ left: `${lowerPct}%`, width: `${upperPct - lowerPct}%` }}
          />
          <div
            className="absolute top-1/2 w-1 h-7 bg-[#E5001A] rounded-full"
            style={{ left: `${predPct}%`, transform: 'translateX(-50%) translateY(-50%)' }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#666666] mt-1 px-1">
          <span>{lower.toFixed(1)}</span>
          <span className="font-medium text-[#E5001A]">{pred.toFixed(1)}</span>
          <span>{upper.toFixed(1)}</span>
        </div>
      </div>

      {/* Model info */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#666666] mb-1">Model Used</p>
            <p className="font-semibold text-[#2C2C2C]">{result.model_used}</p>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-[#888888]">RMSE: {result.model_rmse.toFixed(4)}</p>
              <p className="text-xs text-[#888888]">R²: {(result.model_r2 * 100).toFixed(2)}%</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#666666] mb-1">Confidence</p>
            <p className="font-semibold text-2xl text-[#0099FF]">{score.toFixed(1)}%</p>
            <p className={`text-xs font-medium mt-1 ${confidenceLevel.color}`}>{confidenceLevel.label}</p>
          </div>
        </div>
      </div>

      {/* Logistics Insights */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg p-6 border border-amber-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2C2C2C]">Logistics Insights</h3>
              <p className="text-xs text-[#666666]">AI-generated · based on prediction and last-year data</p>
            </div>
          </div>
          <ul className="space-y-2 mb-4">
            {result.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start space-x-2 text-sm text-[#2C2C2C] bg-white p-3 rounded-lg border border-amber-200"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowChat(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#0099FF] to-[#0066CC] text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Discuss with Model</span>
          </button>
        </div>
      )}

      {/* N-1 Reference Baseline */}
      {result.reference_baseline && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-[#E6F5FF] rounded-lg flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-[#0099FF]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2C2C2C]">N-1 Reference Baseline</h3>
              <p className="text-xs text-[#666666]">Last-year group averages from warm-start training data</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Family', value: result.reference_baseline.family_avg },
              { label: 'Brand', value: result.reference_baseline.brand_avg },
              { label: 'Region', value: result.reference_baseline.region_avg },
              { label: 'Store Size', value: result.reference_baseline.storesize_avg },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-[#666666] mb-1">{label}</p>
                <p className="text-lg font-semibold text-[#2C2C2C]">{value.toFixed(2)}</p>
              </div>
            ))}
            <div className="col-span-2 bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-[#0066CC] mb-1 font-medium">Combined Weighted Reference</p>
              <p className="text-xl font-bold text-[#0099FF]">{result.reference_baseline.combined_avg.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal — messages persist until page reload */}
      {showChat && (
        <ChatModal
          onClose={() => setShowChat(false)}
          messages={chatHistory}
          setMessages={setChatHistory}
          predictionContext={{
            predicted_weekly_sales: result.predicted_weekly_sales,
            confidence_score: result.confidence_score,
            family: inputData?.family ?? '',
            brand: inputData?.brand ?? '',
            cold_start_detected: result.cold_start_detected,
          }}
        />
      )}
    </div>
  );
}
