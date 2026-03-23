'use client';

import { useState, useEffect } from 'react';
import { Award, Clock, TrendingUp, Loader2, CheckCircle, Cpu } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ModelStat {
  model_name: string;
  test_rmse: number;
  test_mae: number;
  test_r2: number;
  test_mape?: number;
  training_time: number;
}

interface StatsData {
  models: ModelStat[];
  best_rmse_model: string;
  best_r2_model: string;
  currently_deployed: string;
}

interface AvailableModels {
  catboost_models: string[];
  xgboost_models: string[];
  deep_learning_models: string[];
  linear_models: {
    ridge: string[];
    lasso: string[];
    elasticnet: string[];
    total: number;
  };
  totals: {
    catboost: number;
    xgboost: number;
    linear: number;
    deep_learning: number;
    all: number;
  };
}

// ---------------------------------------------------------------------------
// Model name parser
// ---------------------------------------------------------------------------
function parseModelInfo(modelName: string): {
  featLabel: string;
  stratLabel: string;
  stratColor: string;
  tooltip: string;
} {
  const lower = modelName.toLowerCase();

  // Feature set
  let featLabel: string;
  if (lower.includes('enhanced') && (lower.includes('shap') || lower.includes('top20'))) {
    featLabel = 'SHAP top-20';
  } else if (lower.includes('enhanced') && lower.includes('top_features')) {
    featLabel = 'Top features';
  } else if (lower.includes('enhanced')) {
    featLabel = 'Enhanced';
  } else if (lower.includes('pca')) {
    featLabel = 'PCA';
  } else if (lower.includes('top20')) {
    featLabel = 'SHAP top-20';
  } else if (lower.includes('linear_') || lower.startsWith('linear')) {
    featLabel = 'Raw';
  } else if (lower.includes('optimized')) {
    featLabel = 'Optimized';
  } else {
    featLabel = 'Base';
  }

  // Sampling / training strategy
  let stratLabel: string;
  let stratColor: string;
  let stratTip: string;
  if (lower.includes('warmcold') && lower.endsWith('_warm')) {
    stratLabel = 'Warm-only'; stratColor = 'bg-orange-100 text-orange-700';
    stratTip = 'Trained exclusively on products with prior sales history (warm-start subset)';
  } else if (lower.includes('warmcold') && lower.endsWith('_cold')) {
    stratLabel = 'Cold-only'; stratColor = 'bg-sky-100 text-sky-700';
    stratTip = 'Trained exclusively on new products with no prior sales history (cold-start subset)';
  } else if (lower.includes('random_oversampling')) {
    stratLabel = 'Oversampled'; stratColor = 'bg-purple-100 text-purple-700';
    stratTip = 'Cold-start rows were duplicated randomly to balance the warm/cold ratio';
  } else if (lower.includes('weighted_sampling') || lower.includes('sample_weighted')) {
    stratLabel = 'Weighted'; stratColor = 'bg-yellow-100 text-yellow-700';
    stratTip = 'Cold-start products received higher training weight (inverse-frequency)';
  } else if (lower.includes('with_coldstart_feature')) {
    stratLabel = 'CS flag'; stratColor = 'bg-teal-100 text-teal-700';
    stratTip = 'A binary cold-start indicator was added as an explicit input feature';
  } else if (lower.includes('_compact')) {
    stratLabel = 'Compact'; stratColor = 'bg-indigo-100 text-indigo-700';
    stratTip = 'Compact neural network: 3 hidden layers [256, 128, 64]';
  } else if (lower.includes('_standard')) {
    stratLabel = 'Standard'; stratColor = 'bg-indigo-100 text-indigo-700';
    stratTip = 'Standard neural network: 4 hidden layers [256, 128, 64, 32]';
  } else if (lower.includes('_deep')) {
    stratLabel = 'Deep'; stratColor = 'bg-indigo-100 text-indigo-700';
    stratTip = 'Deep neural network: 5 hidden layers [256, 128, 64, 32, 16]';
  } else {
    stratLabel = 'No resampling'; stratColor = 'bg-gray-100 text-gray-600';
    stratTip = 'Trained on original class distribution without any rebalancing';
  }

  const tooltip = `Feature set: ${featLabel}. Strategy: ${stratTip}.`;
  return { featLabel, stratLabel, stratColor, tooltip };
}

// ---------------------------------------------------------------------------
// ModelCard
// ---------------------------------------------------------------------------
const ModelCard = ({
  modelName,
  isCurrent,
  onSwitch,
  switchingModel,
  stat,
}: {
  modelName: string;
  isCurrent: boolean;
  onSwitch: (name: string) => void;
  switchingModel: string | null;
  stat?: ModelStat;
}) => {
  const { featLabel, stratLabel, stratColor, tooltip } = parseModelInfo(modelName);

  return (
    <div className="relative group">
      <button
        onClick={() => onSwitch(modelName)}
        disabled={switchingModel !== null}
        className={`
          relative w-full text-left p-3.5 rounded-xl border-2 transition-all
          ${isCurrent
            ? 'border-[#0099FF] bg-blue-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-[#0099FF]/40 hover:shadow-sm'
          }
          ${switchingModel === modelName ? 'opacity-50' : ''}
          disabled:cursor-not-allowed
        `}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Left: strategy + feature set */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              {isCurrent && <CheckCircle className="w-3.5 h-3.5 text-[#0099FF] flex-shrink-0" />}
              {switchingModel === modelName
                ? <Loader2 className="w-3.5 h-3.5 text-[#0099FF] animate-spin flex-shrink-0" />
                : null}
              <span className={`text-xs font-bold truncate ${isCurrent ? 'text-[#0066CC]' : 'text-gray-800'}`}>
                {stratLabel}
              </span>
            </div>
            <span className={`inline-block text-xs px-1.5 py-0.5 rounded font-medium ${stratColor}`}>
              {featLabel}
            </span>
          </div>

          {/* Right: actual metrics */}
          {stat ? (
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold text-[#0099FF]">{stat.test_rmse.toFixed(4)}</p>
              <p className="text-xs text-gray-400">R² {(stat.test_r2 * 100).toFixed(1)}%</p>
            </div>
          ) : (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-300">—</p>
            </div>
          )}
        </div>
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-0 right-0 mb-1.5 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl leading-relaxed">
          <p className="font-mono text-gray-400 text-[10px] mb-1">{modelName}</p>
          {tooltip}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ModelStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [availableModels, setAvailableModels] = useState<AvailableModels | null>(null);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [switchingModel, setSwitchingModel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'selection' | 'stats'>('selection');

  useEffect(() => {
    fetchStats();
    fetchAvailableModels();
    fetchCurrentModel();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/models/stats`);
      setStats(response.data);
    } catch (error: unknown) {
      toast.error('Failed to load model statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableModels = async () => {
    try {
      const response = await axios.get(`${API_URL}/models/available`);
      setAvailableModels(response.data);
    } catch (error: unknown) {
      console.error('Failed to fetch available models:', error);
    }
  };

  const fetchCurrentModel = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      setCurrentModel(response.data.model_name || '');
    } catch (error: unknown) {
      console.error('Failed to fetch current model:', error);
    }
  };

  const handleModelSwitch = async (modelName: string) => {
    setSwitchingModel(modelName);
    try {
      await axios.post(`${API_URL}/models/select/${modelName}`);
      setCurrentModel(modelName);
      toast.success(`Switched to ${modelName}`);
      await fetchStats();
    } catch (error: unknown) {
      toast.error(`Failed to switch to ${modelName}`);
      console.error(error);
    } finally {
      setSwitchingModel(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#0099FF] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading model statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-[#E5001A]">
        <p className="text-gray-600 font-bold text-lg">Failed to load statistics</p>
      </div>
    );
  }

  // Stat lookup map: model_name → ModelStat
  const statMap: Record<string, ModelStat> = {};
  stats.models.forEach((m) => { statMap[m.model_name] = m; });

  // Top 5 by RMSE (lower is better)
  const top5 = [...stats.models].sort((a, b) => a.test_rmse - b.test_rmse).slice(0, 5);

  // Short labels for charts
  const shortLabel = (name: string) => {
    const lower = name.toLowerCase();
    const algo = lower.includes('catboost') ? 'CB' : lower.includes('xgboost') ? 'XG' : lower.includes('ridge') ? 'Ridge' : lower.includes('lasso') ? 'Lasso' : lower.includes('elasticnet') ? 'EN' : 'Model';
    const feat = lower.includes('shap') ? 'SHAP' : lower.includes('enhanced') ? 'Enh' : lower.includes('optimized') ? 'Opt' : 'Raw';
    const strat = lower.includes('random_oversampling') ? 'ROS' : lower.includes('weighted') ? 'WS' : lower.includes('coldstart_feature') ? 'CS' : 'Orig';
    return `${algo}-${feat}-${strat}`;
  };

  const errorChartData = top5.map((m) => ({
    name: shortLabel(m.model_name),
    RMSE: parseFloat(m.test_rmse.toFixed(4)),
    MAE: parseFloat(m.test_mae.toFixed(4)),
  }));

  const r2ChartData = top5.map((m) => ({
    name: shortLabel(m.model_name),
    r2: parseFloat((m.test_r2 * 100).toFixed(2)),
    isBest: m.model_name === stats.best_r2_model,
  }));

  const hasMape = stats.models.some((m) => m.test_mape !== undefined && m.test_mape !== null);

  return (
    <div className="space-y-6">
      {/* Tab Navigation — Model Selection first */}
      <div className="bg-white rounded-xl shadow-sm p-1.5 border border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('selection')}
            className={`
              flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg font-bold text-sm transition-all
              ${activeTab === 'selection'
                ? 'bg-[#0099FF] text-white shadow-md'
                : 'text-gray-600 hover:bg-blue-50'
              }
            `}
          >
            <Cpu className="w-5 h-5" />
            <span>Model Selection</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`
              flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg font-bold text-sm transition-all
              ${activeTab === 'stats'
                ? 'bg-[#0099FF] text-white shadow-md'
                : 'text-gray-600 hover:bg-blue-50'
              }
            `}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Performance Statistics</span>
          </button>
        </div>
      </div>

      {/* Model Selection Tab */}
      {activeTab === 'selection' && availableModels && (
        <div className="space-y-6">
          {/* Current Model Display */}
          <div className="bg-gradient-to-br from-[#0099FF] via-[#0077DD] to-[#0066CC] rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-24 -mt-24" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-1 uppercase tracking-wider font-semibold">Currently Active Model</p>
                <p className="text-xl font-bold">{currentModel ? `${parseModelInfo(currentModel).stratLabel} · ${parseModelInfo(currentModel).featLabel}` : 'Loading...'}</p>
                {currentModel && (
                  <p className="text-xs opacity-60 mt-1 font-mono">{currentModel}</p>
                )}
              </div>
              <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <CheckCircle className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Model Count Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'CatBoost', count: availableModels.totals.catboost, color: 'border-[#0099FF] text-[#0099FF]' },
              { label: 'XGBoost', count: availableModels.totals.xgboost, color: 'border-[#E5001A] text-[#E5001A]' },
              { label: 'Linear', count: availableModels.totals.linear, color: 'border-green-600 text-green-600' },
              { label: 'Deep Learning', count: availableModels.totals.deep_learning, color: 'border-purple-600 text-purple-600' },
              { label: 'Total', count: availableModels.totals.all, color: 'border-gray-700 text-gray-900' },
            ].map(({ label, count, color }) => (
              <div key={label} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${color}`}>
                <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">{label}</p>
                <p className={`text-3xl font-bold ${color.split(' ')[1]}`}>{count}</p>
              </div>
            ))}
          </div>

          {/* CatBoost Models */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 border-l-4 border-l-[#0099FF]">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              CatBoost Models ({availableModels.totals.catboost})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableModels.catboost_models.map((model) => (
                <ModelCard key={model} modelName={model} isCurrent={currentModel === model}
                  onSwitch={handleModelSwitch} switchingModel={switchingModel} stat={statMap[model]} />
              ))}
            </div>
          </div>

          {/* XGBoost Models */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 border-l-4 border-l-[#E5001A]">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              XGBoost Models ({availableModels.totals.xgboost})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableModels.xgboost_models.map((model) => (
                <ModelCard key={model} modelName={model} isCurrent={currentModel === model}
                  onSwitch={handleModelSwitch} switchingModel={switchingModel} stat={statMap[model]} />
              ))}
            </div>
          </div>

          {/* Linear Models */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 border-l-4 border-l-green-600">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Linear Models ({availableModels.totals.linear})
            </h3>
            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Ridge Regression</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableModels.linear_models.ridge.map((model) => (
                  <ModelCard key={model} modelName={model} isCurrent={currentModel === model}
                    onSwitch={handleModelSwitch} switchingModel={switchingModel} stat={statMap[model]} />
                ))}
              </div>
            </div>
            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Lasso Regression</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableModels.linear_models.lasso.map((model) => (
                  <ModelCard key={model} modelName={model} isCurrent={currentModel === model}
                    onSwitch={handleModelSwitch} switchingModel={switchingModel} stat={statMap[model]} />
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">ElasticNet Regression</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableModels.linear_models.elasticnet.map((model) => (
                  <ModelCard key={model} modelName={model} isCurrent={currentModel === model}
                    onSwitch={handleModelSwitch} switchingModel={switchingModel} stat={statMap[model]} />
                ))}
              </div>
            </div>
          </div>

          {/* Deep Learning Models */}
          {availableModels.deep_learning_models && availableModels.deep_learning_models.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 border-l-4 border-l-purple-600">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Deep Learning Models ({availableModels.totals.deep_learning})
              </h3>
              <p className="text-xs text-gray-400 mb-4">Neural networks trained on SHAP top-20 features — compatible with the current inference pipeline.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableModels.deep_learning_models.map((model) => (
                  <ModelCard key={model} modelName={model} isCurrent={currentModel === model}
                    onSwitch={handleModelSwitch} switchingModel={switchingModel} stat={statMap[model]} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#0099FF] to-[#0066CC] rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-9 h-9" />
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <span className="text-2xl">1</span>
                </div>
              </div>
              <p className="text-xs opacity-75 mb-1 uppercase tracking-wide font-semibold">Best RMSE Model</p>
              <p className="text-sm font-bold leading-snug">{stats.best_rmse_model}</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-9 h-9" />
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <span className="text-2xl">R²</span>
                </div>
              </div>
              <p className="text-xs opacity-75 mb-1 uppercase tracking-wide font-semibold">Best R² Model</p>
              <p className="text-sm font-bold leading-snug">{stats.best_r2_model}</p>
            </div>

            <div className="bg-gradient-to-br from-[#E5001A] to-red-800 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-9 h-9" />
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs opacity-75 mb-1 uppercase tracking-wide font-semibold">Currently Deployed</p>
              <p className="text-sm font-bold leading-snug">{stats.currently_deployed}</p>
            </div>
          </div>

          {/* Error Chart: RMSE + MAE (same scale, both lower-is-better) */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900">Prediction Error — Top 5 by RMSE</h3>
              <p className="text-xs text-gray-500 mt-1">RMSE and MAE share the same unit (units/week). Lower bars = better model.</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={errorChartData} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  label={{ value: 'units/week', angle: -90, position: 'insideLeft', offset: 12, style: { fill: '#9ca3af', fontSize: 11 } }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value, name) => [`${Number(value ?? 0).toFixed(4)} units/week`, String(name)]}
                />
                <Legend />
                <Bar dataKey="RMSE" fill="#0099FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="MAE" fill="#00897b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* R² Chart: separate — percentage of variance explained */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900">R² Score — Variance Explained</h3>
              <p className="text-xs text-gray-500 mt-1">Higher bars = more of the sales variance the model explains. 100% would be a perfect model.</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={r2ChartData} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  label={{ value: '%', angle: -90, position: 'insideLeft', offset: 12, style: { fill: '#9ca3af', fontSize: 11 } }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: any) => [`${Number(value ?? 0).toFixed(2)}%`, 'R² Score']) as any}
                />
                <Bar
                  dataKey="r2"
                  radius={[4, 4, 0, 0]}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={(props: any) => {
                    const { x, y, width, height, isBest } = props;
                    return <rect x={x} y={y} width={width} height={height} rx={4} ry={4} fill={isBest ? '#16a34a' : '#E5001A'} fillOpacity={isBest ? 1 : 0.6} />;
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 mt-2">Green bar = best R² model.</p>
          </div>

          {/* Detailed Statistics Table */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Detailed Statistics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#0099FF]">
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold text-sm">Model</th>
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold text-sm">RMSE</th>
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold text-sm">MAE</th>
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold text-sm">R² Score</th>
                    {hasMape && (
                      <th className="text-left py-3 px-4 text-gray-900 font-semibold text-sm">MAPE</th>
                    )}
                    <th className="text-left py-3 px-4 text-gray-900 font-semibold text-sm">Training Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.models.map((model, index) => {
                    const isBestRMSE = model.model_name === stats.best_rmse_model;
                    const isBestR2 = model.model_name === stats.best_r2_model;
                    const isDeployed = model.model_name === stats.currently_deployed;

                    return (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                          isDeployed ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 text-sm">{model.model_name}</span>
                            {isDeployed && (
                              <span className="bg-[#0099FF] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                Active
                              </span>
                            )}
                            {isBestRMSE && (
                              <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-xs font-bold" title="Best RMSE">
                                RMSE
                              </span>
                            )}
                            {isBestR2 && (
                              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold" title="Best R²">
                                R²
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-bold text-sm ${isBestRMSE ? 'text-[#0099FF]' : 'text-gray-600'}`}>
                            {model.test_rmse.toFixed(4)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">{model.test_mae.toFixed(4)}</td>
                        <td className="py-4 px-4">
                          <span className={`font-bold text-sm ${isBestR2 ? 'text-[#E5001A]' : 'text-gray-600'}`}>
                            {model.test_r2.toFixed(4)}
                          </span>
                        </td>
                        {hasMape && (
                          <td className="py-4 px-4 text-gray-600 text-sm">
                            {model.test_mape !== undefined && model.test_mape !== null
                              ? `${model.test_mape.toFixed(1)}%`
                              : '—'}
                          </td>
                        )}
                        <td className="py-4 px-4 text-gray-600 text-sm">{model.training_time.toFixed(2)}s</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Metrics Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h4 className="text-sm font-bold text-[#0066CC] mb-2">RMSE — Root Mean Squared Error</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Average prediction error in the same unit as the target (units/week). Lower is better. Penalises large errors more than small ones.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <h4 className="text-sm font-bold text-green-700 mb-2">MAE — Mean Absolute Error</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Average absolute gap between predicted and actual values. Easier to interpret than RMSE; less sensitive to outliers.
              </p>
            </div>
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h4 className="text-sm font-bold text-[#E5001A] mb-2">R² — Coefficient of Determination</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                Proportion of sales variance the model explains. 1.0 is perfect; 0.0 means the model is no better than predicting the mean.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
