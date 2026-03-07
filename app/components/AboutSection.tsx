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
      <div className="bg-gradient-to-br from-[#0099FF] to-[#0066CC] rounded-2xl shadow-2xl p-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            📈 Sales Prediction Platform
          </h1>
          <p className="text-lg opacity-90 mb-6 leading-relaxed">
            Advanced AI-powered forecasting solution optimized for retail sales
            prediction, with special focus on cold-start products and new launches.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
              Machine Learning
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
              CatBoost
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
              Cold-Start Optimized
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
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
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Model Performance Metrics */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 border-t-4 border-t-[#0099FF]">
        <h2 className="text-2xl font-semibold text-[#2C2C2C] mb-6 flex items-center">
          🎯 Model Performance Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-[#E6F5FF] rounded-lg p-4 border border-[#0099FF]/20 text-center"
            >
              <p className="text-xs text-[#666666] mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-[#0099FF] mb-1">{metric.value}</p>
              <p className="text-xs text-[#888888]">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Capabilities */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 border-t-4 border-t-[#E5001A]">
        <h2 className="text-2xl font-semibold text-[#2C2C2C] mb-6 flex items-center">
          ✨ Platform Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-[#E6F5FF] rounded-lg border border-[#0099FF]/20"
            >
              <CheckCircle2 className="w-5 h-5 text-[#0099FF] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#2C2C2C]">{capability}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-[#2C2C2C] mb-6 flex items-center">
          🛠️ Technology Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-base font-semibold text-[#2C2C2C] mb-3">🐍 Backend</h3>
            <ul className="space-y-2 text-sm text-[#666666]">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#0099FF] rounded-full"></span>
                <span>Python FastAPI</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#0099FF] rounded-full"></span>
                <span>CatBoost ML</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#0099FF] rounded-full"></span>
                <span>Pandas & NumPy</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#2C2C2C] mb-3">🎨 Frontend</h3>
            <ul className="space-y-2 text-sm text-[#666666]">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#E5001A] rounded-full"></span>
                <span>Next.js 16</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#E5001A] rounded-full"></span>
                <span>React 19</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#E5001A] rounded-full"></span>
                <span>Tailwind CSS</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#2C2C2C] mb-3">✨ Features</h3>
            <ul className="space-y-2 text-sm text-[#666666]">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span>RESTful API</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span>TypeScript</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span>Recharts Viz</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-[#E6F5FF] rounded-2xl shadow-lg p-8 border border-[#0099FF]/20">
        <h2 className="text-2xl font-semibold text-[#2C2C2C] mb-6 flex items-center">
          🎯 Ideal Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#0099FF] transition-all">
            <h4 className="font-semibold text-[#2C2C2C] mb-2">🚀 New Product Launches</h4>
            <p className="text-sm text-[#666666]">
              Predict sales for products without any historical data using store and product characteristics.
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#E5001A] transition-all">
            <h4 className="font-semibold text-[#2C2C2C] mb-2">📦 Inventory Planning</h4>
            <p className="text-sm text-[#666666]">
              Get accurate weekly sales forecasts to optimize stock levels and reduce waste.
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-green-600 transition-all">
            <h4 className="font-semibold text-[#2C2C2C] mb-2">🏪 Store Expansion</h4>
            <p className="text-sm text-[#666666]">
              Evaluate product performance across different store sizes and regions.
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#0099FF] transition-all">
            <h4 className="font-semibold text-[#2C2C2C] mb-2">📋 Assortment Optimization</h4>
            <p className="text-sm text-[#666666]">
              Compare predictions across multiple products to optimize your product mix.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
