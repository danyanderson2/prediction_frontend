'use client';

import { Brain, Zap, Shield, Target, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Forecasting',
      description:
        'Advanced CatBoost machine learning model trained on retail sales data with 96.8% R² score.',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Zap,
      title: 'Cold-Start Optimized',
      description:
        'Predict sales for new products without historical data using product and store characteristics.',
      color: 'from-red-600 to-red-800',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      icon: Shield,
      title: 'Confidence Intervals',
      description:
        'Get 95% confidence intervals for every prediction to understand uncertainty and risk.',
      color: 'from-green-600 to-green-800',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Target,
      title: 'Business Recommendations',
      description:
        'AI-generated insights for optimal stocking, pricing, and merchandising strategies.',
      color: 'from-blue-800 to-blue-900',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-800',
    },
  ];

  const metrics = [
    { label: 'Test RMSE', value: '0.324', description: 'Root Mean Squared Error' },
    { label: 'Test MAE', value: '0.190', description: 'Mean Absolute Error' },
    { label: 'Test R²', value: '0.968', description: 'Variance Explained' },
    { label: 'Features', value: '14', description: 'Cold-Start Ready' },
  ];

  const capabilities = [
    'Single product prediction with detailed insights',
    'Batch prediction for up to 100 products',
    'No historical sales data required',
    'Native categorical feature handling',
    'Real-time prediction API',
    'Model performance statistics',
    'Export predictions to JSON',
    'Responsive modern UI',
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-3xl shadow-material-24 p-14 text-white relative overflow-hidden border-4 border-blue-500">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full -mr-40 -mt-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600 opacity-15 rounded-full -ml-32 -mb-32"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 border-4 border-white/10 rounded-full"></div>
        <div className="max-w-3xl relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-5 drop-shadow-2xl">
            📈 Sales Prediction Platform
          </h1>
          <p className="text-xl opacity-95 mb-8 leading-relaxed font-bold">
            Advanced AI-powered forecasting solution optimized for retail sales
            prediction, with special focus on cold-start products and new launches.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-base font-black border-3 border-white/40 shadow-material-8 hover:scale-110 transition-transform">
              Machine Learning
            </span>
            <span className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-base font-black border-3 border-white/40 shadow-material-8 hover:scale-110 transition-transform">
              CatBoost
            </span>
            <span className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-base font-black border-3 border-white/40 shadow-material-8 hover:scale-110 transition-transform">
              Cold-Start Optimized
            </span>
            <span className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-base font-black border-3 border-white/40 shadow-material-8 hover:scale-110 transition-transform">
              Real-Time API
            </span>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-material-4 p-6 border-2 border-gray-200 hover:shadow-material-8 hover:scale-105 transition-all transform"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 shadow-material-8 border-2 border-white`}
              >
                <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Model Performance Metrics */}
      <div className="bg-white rounded-2xl shadow-material-4 p-8 border-2 border-gray-200 border-t-8 border-t-blue-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          🎯 Model Performance Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-300 text-center transform hover:scale-110 transition-transform"
            >
              <p className="text-xs text-blue-700 mb-1 font-bold uppercase tracking-wider">{metric.label}</p>
              <p className="text-3xl font-bold text-blue-900 mb-1">{metric.value}</p>
              <p className="text-xs text-gray-600 font-medium">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Capabilities */}
      <div className="bg-white rounded-2xl shadow-material-4 p-8 border-2 border-gray-200 border-t-8 border-t-red-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          ✨ Platform Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border-2 border-blue-200 hover:border-blue-600 hover:scale-105 transition-all transform"
            >
              <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <span className="text-sm text-gray-800 font-bold">{capability}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white rounded-2xl shadow-material-4 p-8 border-2 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          🛠️ Technology Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">🐍 Backend</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                <span className="font-bold">Python FastAPI</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                <span className="font-bold">CatBoost ML</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                <span className="font-bold">Pandas & NumPy</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">🎨 Frontend</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                <span className="font-bold">Next.js 16</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                <span className="font-bold">React 19</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                <span className="font-bold">Tailwind CSS</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide">✨ Features</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                <span className="font-bold">RESTful API</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                <span className="font-bold">TypeScript</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                <span className="font-bold">Recharts Viz</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-material-4 p-8 border-2 border-blue-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          🎯 Ideal Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-blue-600 hover:scale-105 transition-all transform shadow-material-2">
            <h4 className="font-bold text-gray-900 mb-2 text-base">🚀 New Product Launches</h4>
            <p className="text-sm text-gray-700 font-medium">
              Predict sales for products without any historical data using store and product characteristics.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-red-600 hover:scale-105 transition-all transform shadow-material-2">
            <h4 className="font-bold text-gray-900 mb-2 text-base">📦 Inventory Planning</h4>
            <p className="text-sm text-gray-700 font-medium">
              Get accurate weekly sales forecasts to optimize stock levels and reduce waste.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-green-600 hover:scale-105 transition-all transform shadow-material-2">
            <h4 className="font-bold text-gray-900 mb-2 text-base">🏪 Store Expansion</h4>
            <p className="text-sm text-gray-700 font-medium">
              Evaluate product performance across different store sizes and regions.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-blue-800 hover:scale-105 transition-all transform shadow-material-2">
            <h4 className="font-bold text-gray-900 mb-2 text-base">📋 Assortment Optimization</h4>
            <p className="text-sm text-gray-700 font-medium">
              Compare predictions across multiple products to optimize your product mix.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
