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
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      {/* Header */}
      <header className="bg-white shadow-material-16 border-b-8 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-2xl flex items-center justify-center shadow-material-16 transform -rotate-6 border-3 border-blue-400">
                <TrendingUp className="w-9 h-9 text-white transform rotate-6" strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                  Sales Prediction Platform
                </h1>
                <p className="text-sm text-gray-600 mt-1 font-bold uppercase tracking-wide">
                  AI-Powered Forecasting • Real-Time Analytics
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-green-50 to-green-100 px-5 py-3 rounded-2xl border-3 border-green-400 shadow-material-8">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-sm font-black text-green-700 uppercase tracking-widest">
                Live
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-material-8 border-b-4 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`
                    flex items-center space-x-3 px-8 py-5 font-black text-base
                    border-b-4 transition-all duration-300 whitespace-nowrap
                    ${isActive
                      ? 'text-blue-700 border-blue-600 bg-gradient-to-t from-blue-50 to-transparent shadow-material-4 scale-105'
                      : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50 hover:border-gray-400'
                    }
                  `}
                >
                  <Icon className="w-6 h-6" strokeWidth={2.5} />
                  <span className="uppercase tracking-wide">{item.label}</span>
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
              <h3 className="text-base font-medium text-gray-900 mb-3">
                About the Platform
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Advanced machine learning platform for retail sales forecasting,
                optimized for cold-start products and new product launches.
              </p>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">
                Key Features
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Cold-start product prediction</li>
                <li>✓ 95% confidence intervals</li>
                <li>✓ Business recommendations</li>
                <li>✓ Baseline comparison</li>
                <li>✓ Batch processing</li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-3">
                Technical Info
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Model: Enhanced CatBoost</li>
                <li>Test RMSE: 0.3247</li>
                <li>Test R²: 0.9682</li>
                <li>Features: 82</li>
                <li>Version: 4.0</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © 2026 Sales Prediction Platform • Final Stretch Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
