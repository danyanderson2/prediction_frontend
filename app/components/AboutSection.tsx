'use client';

import { Brain, Zap, Shield, Target, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const features = [
    {
      icon: Brain,
      title: 'Gradient-boosted tree models',
      description:
        'The best-performing model is XGBoost on SHAP-selected features (RMSE 0.8866, R² 76.3%). CatBoost and linear baselines are also available for comparison.',
      color: 'from-[#0099FF] to-[#0066CC]',
    },
    {
      icon: Zap,
      title: 'Works for new products too',
      description:
        'The core problem here is cold-start: predicting sales for a product that has never been sold in a given store. The model handles this using product and store characteristics instead of historical data.',
      color: 'from-[#E5001A] to-red-700',
    },
    {
      icon: Shield,
      title: 'Confidence intervals on every prediction',
      description:
        'Each prediction comes with a lower and upper bound so you can size your order around the realistic range, not just the point estimate.',
      color: 'from-green-600 to-green-800',
    },
    {
      icon: Target,
      title: 'AI-assisted logistics notes',
      description:
        'After each prediction, Gemini generates practical order-quantity guidance based on the result, the confidence range, and last-year group averages for the same sub-category and brand.',
      color: 'from-amber-500 to-amber-700',
    },
  ];

  // Real numbers from the best model on the actual evaluation set
  const metrics = [
    { label: 'Test RMSE', value: '0.8866', description: 'Best model (XGBoost SHAP)' },
    { label: 'Test MAE', value: '0.6033', description: 'Mean absolute error' },
    { label: 'Test R²', value: '76.3%', description: 'Variance explained' },
    { label: 'MAPE', value: '~23%', description: 'Mean abs. % error' },
  ];

  const capabilities = [
    'Single product prediction with logistics insights',
    'Batch prediction for up to 100 products at once',
    'No historical sales data required (cold-start ready)',
    'N-1 reference baseline from last-year group averages',
    'Switchable model zoo (50+ trained models)',
    'AI chat powered by Gemini with optional Pinecone RAG',
    'Export predictions to JSON or PDF',
    'Confidence intervals on every prediction',
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0099FF] to-[#0066CC] rounded-2xl shadow-2xl p-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Sales Prediction Platform
          </h1>
          <p className="text-base opacity-90 mb-2 leading-relaxed">
            Built for one specific problem: predicting how many units a store will sell in a week, especially for products that have never been on those shelves before.
          </p>
          <p className="text-sm opacity-75 mb-6 leading-relaxed">
            The dataset covers grocery products across French Carrefour stores. Most products appear in only one or two stores, which makes classical time-series forecasting impractical. Instead, we predict from product and store characteristics alone.
          </p>
          <div className="flex flex-wrap gap-2">
            {['XGBoost · CatBoost', 'Cold-Start', 'Gemini AI', 'Pinecone RAG', 'FastAPI · Next.js'].map((tag) => (
              <span key={tag} className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium">
                {tag}
              </span>
            ))}
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
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-semibold text-[#2C2C2C] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Model Performance Metrics */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 border-t-4 border-t-[#0099FF]">
        <h2 className="text-xl font-semibold text-[#2C2C2C] mb-2">Best model performance</h2>
        <p className="text-sm text-[#666666] mb-6">
          Numbers below are from the held-out test set. The best model is XGBoost trained on SHAP-selected features with no resampling. A 23% MAPE on cold-start products is honest — these are genuinely hard to predict without any history.
        </p>
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
        <h2 className="text-xl font-semibold text-[#2C2C2C] mb-6">What the platform does</h2>
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
        <h2 className="text-xl font-semibold text-[#2C2C2C] mb-6">Technology stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-[#2C2C2C] mb-3">Backend</h3>
            <ul className="space-y-2 text-sm text-[#666666]">
              {[
                'Python · FastAPI',
                'XGBoost · CatBoost · scikit-learn',
                'TensorFlow / Keras (neural nets)',
                'Pandas · NumPy · SciPy',
                'Gemini AI (google-generativeai)',
                'Pinecone (vector RAG index)',
              ].map((item) => (
                <li key={item} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-[#0099FF] rounded-full flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2C2C2C] mb-3">Frontend</h3>
            <ul className="space-y-2 text-sm text-[#666666]">
              {[
                'Next.js 16 · React 19',
                'TypeScript · Tailwind CSS',
                'Recharts (performance charts)',
                'jsPDF (PDF export)',
                'Axios · react-hot-toast',
              ].map((item) => (
                <li key={item} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-[#E5001A] rounded-full flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2C2C2C] mb-3">Model training</h3>
            <ul className="space-y-2 text-sm text-[#666666]">
              {[
                'Pearson + Cramér feature filtering',
                'SHAP feature importance selection',
                '4 cold-start sampling strategies',
                'Hyperparameter optimisation (Optuna)',
                '50+ trained model variants',
              ].map((item) => (
                <li key={item} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-[#E6F5FF] rounded-2xl shadow-lg p-8 border border-[#0099FF]/20">
        <h2 className="text-xl font-semibold text-[#2C2C2C] mb-6">When to use this</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#0099FF] transition-all">
            <h4 className="font-semibold text-[#2C2C2C] mb-2 text-sm">New product launches</h4>
            <p className="text-sm text-[#666666]">
              You need an opening order quantity for a product that has never been stocked. The model gives you a weekly estimate and an honest confidence range.
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#E5001A] transition-all">
            <h4 className="font-semibold text-[#2C2C2C] mb-2 text-sm">Inventory planning</h4>
            <p className="text-sm text-[#666666]">
              You want a weekly sales baseline for replenishment planning, especially for stores that have not carried a product before.
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-green-600 transition-all">
            <h4 className="font-semibold text-[#2C2C2C] mb-2 text-sm">Store expansion</h4>
            <p className="text-sm text-[#666666]">
              A product sells well in large stores in Île-de-France. You want to know whether it is worth listing it in medium stores in Bretagne.
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-[#0099FF] transition-all">
            <h4 className="font-semibold text-[#2C2C2C] mb-2 text-sm">Assortment decisions</h4>
            <p className="text-sm text-[#666666]">
              You have ten candidate products for a limited shelf slot. Run batch prediction to rank them by expected volume before committing to a listing.
            </p>
          </div>
        </div>
      </div>

      {/* Team placeholder */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {/* TODO: add team info */}
      </div>
    </div>
  );
}
