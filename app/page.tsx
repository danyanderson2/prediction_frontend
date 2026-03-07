'use client';

import { useState } from 'react';
import { TrendingUp, BarChart3, Settings, Info } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import PredictionForm from './components/PredictionForm';
import BatchPrediction from './components/BatchPrediction';
import ModelStats from './components/ModelStats';
import AboutSection from './components/AboutSection';

type View = 'predict' | 'batch' | 'stats' | 'about';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('predict');

  const navigation = [
    { id: 'predict' as View, label: 'Single Prediction', icon: TrendingUp },
    { id: 'batch' as View, label: 'Batch Prediction', icon: BarChart3 },
    { id: 'stats' as View, label: 'Model Statistics', icon: Settings },
    { id: 'about' as View, label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Toaster position="top-right" />
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-[#0099FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0099FF] to-[#0066CC] rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#2C2C2C]">
                  Sales Prediction Platform
                </h1>
                <p className="text-sm text-[#666666] mt-1">
                  AI-Powered Forecasting • Cold-Start Optimized
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-[#E6F5FF] px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-[#0099FF] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#0066CC]">
                Model Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-4 font-medium text-sm
                    border-b-3 transition-all duration-200
                    ${isActive
                      ? 'text-[#0099FF] border-[#0099FF] bg-[#E6F5FF]'
                      : 'text-[#666666] border-transparent hover:text-[#0099FF] hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {activeView === 'predict' && <PredictionForm />}
          {activeView === 'batch' && <BatchPrediction />}
          {activeView === 'stats' && <ModelStats />}
          {activeView === 'about' && <AboutSection />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-3">
                About the Platform
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Advanced machine learning platform for retail sales forecasting,
                optimized for cold-start products and new product launches.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-3">
                Key Features
              </h3>
              <ul className="text-sm text-[#666666] space-y-2">
                <li>✓ Cold-start product prediction</li>
                <li>✓ 95% confidence intervals</li>
                <li>✓ Business recommendations</li>
                <li>✓ Baseline comparison</li>
                <li>✓ Batch processing</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-3">
                Technical Info
              </h3>
              <ul className="text-sm text-[#666666] space-y-2">
                <li>Model: Enhanced CatBoost</li>
                <li>Test RMSE: 0.3247</li>
                <li>Test R²: 0.9682</li>
                <li>Features: 82</li>
                <li>Version: 4.0</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-[#666666]">
              © 2026 Sales Prediction Platform • Final Stretch Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
