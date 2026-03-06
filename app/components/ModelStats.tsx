'use client';

import { useState, useEffect } from 'react';
import { Award, Clock, TrendingUp, Loader2, RefreshCw, CheckCircle, Cpu } from 'lucide-react';
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
    all: number;
  };
}

export default function ModelStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [availableModels, setAvailableModels] = useState<AvailableModels | null>(null);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [switchingModel, setSwitchingModel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'selection'>('stats');

  useEffect(() => {
    fetchStats();
    fetchAvailableModels();
    fetchCurrentModel();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/models/stats`);
      setStats(response.data);
    } catch (error: any) {
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
    } catch (error: any) {
      console.error('Failed to fetch available models:', error);
    }
  };

  const fetchCurrentModel = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      setCurrentModel(response.data.model_name || '');
    } catch (error: any) {
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
    } catch (error: any) {
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
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading model statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-material-4 p-12 text-center border-2 border-red-600">
        <p className="text-gray-600 font-bold text-lg">⚠️ Failed to load statistics</p>
      </div>
    );
  }

  const chartData = stats.models.slice(0, 5).map((model) => ({
    name: model.model_name.replace(/CatBoost-|XGBoost-/g, ''),
    RMSE: model.test_rmse,
    MAE: model.test_mae,
    'R² Score': model.test_r2,
  }));

  const ModelCard = ({ modelName, type, isCurrent }: { modelName: string; type: string; isCurrent: boolean }) => {
    const isOptimized = modelName.includes('optimized');
    const isEnhanced = modelName.includes('enhanced');
    const variant = isOptimized ? 'optimized' : isEnhanced ? 'enhanced' : 'original';
    
    return (
      <button
        onClick={() => handleModelSwitch(modelName)}
        disabled={switchingModel !== null}
        className={`
          relative w-full text-left p-4 rounded-xl border-2 transition-all transform hover:scale-105
          ${isCurrent 
            ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-material-8' 
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-material-4'
          }
          ${switchingModel === modelName ? 'opacity-50' : ''}
          disabled:cursor-not-allowed
        `}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              {isCurrent && (
                <CheckCircle className="w-4 h-4 text-blue-600" />
              )}
              <span className={`text-sm font-bold ${isCurrent ? 'text-blue-900' : 'text-gray-900'}`}>
                {modelName.replace(/_/g, ' ').replace('model', '').trim()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`
                text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                ${variant === 'optimized' 
                  ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                  : variant === 'enhanced'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                }
              `}>
                {variant}
              </span>
              <span className="text-xs text-gray-500 font-bold">{type}</span>
            </div>
          </div>
          {switchingModel === modelName && (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-material-2 p-1.5 border-2 border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`
              flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg font-bold text-sm transition-all
              ${activeTab === 'stats'
                ? 'bg-blue-600 text-white shadow-material-4'
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Performance Statistics</span>
          </button>
          <button
            onClick={() => setActiveTab('selection')}
            className={`
              flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg font-bold text-sm transition-all
              ${activeTab === 'selection'
                ? 'bg-blue-600 text-white shadow-material-4'
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Cpu className="w-5 h-5" />
            <span>Model Selection</span>
          </button>
        </div>
      </div>

      {/* Model Selection Tab */}
      {activeTab === 'selection' && availableModels && (
        <div className="space-y-6">
          {/* Current Model Display */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-2xl shadow-material-8 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-24 -mt-24"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1 uppercase tracking-wider font-bold">✅ Currently Active Model</p>
                <p className="text-2xl font-bold">{currentModel || 'Loading...'}</p>
              </div>
              <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Model Count Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-material-2 p-4 border-l-4 border-blue-600">
              <p className="text-sm text-gray-600 mb-1 font-bold uppercase tracking-wide">🚀 CatBoost Models</p>
              <p className="text-3xl font-bold text-blue-600">{availableModels.totals.catboost}</p>
            </div>
            <div className="bg-white rounded-xl shadow-material-2 p-4 border-l-4 border-red-600">
              <p className="text-sm text-gray-600 mb-1 font-bold uppercase tracking-wide">⚡ XGBoost Models</p>
              <p className="text-3xl font-bold text-red-600">{availableModels.totals.xgboost}</p>
            </div>
            <div className="bg-white rounded-xl shadow-material-2 p-4 border-l-4 border-green-600">
              <p className="text-sm text-gray-600 mb-1 font-bold uppercase tracking-wide">📊 Linear Models</p>
              <p className="text-3xl font-bold text-green-600">{availableModels.totals.linear}</p>
            </div>
            <div className="bg-white rounded-xl shadow-material-2 p-4 border-l-4 border-gray-700">
              <p className="text-sm text-gray-600 mb-1 font-bold uppercase tracking-wide">📦 Total Models</p>
              <p className="text-3xl font-bold text-gray-900">{availableModels.totals.all}</p>
            </div>
          </div>

          {/* CatBoost Models */}
          <div className="bg-white rounded-2xl shadow-material-4 p-6 border-2 border-gray-200 border-l-8 border-l-blue-600">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-4 h-4 bg-blue-600 rounded-full mr-3 shadow-material-2"></span>
              🚀 CatBoost Models ({availableModels.totals.catboost})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableModels.catboost_models.map((model) => (
                <ModelCard
                  key={model}
                  modelName={model}
                  type="CatBoost"
                  isCurrent={currentModel === model}
                />
              ))}
            </div>
          </div>

          {/* XGBoost Models */}
          <div className="bg-white rounded-2xl shadow-material-4 p-6 border-2 border-gray-200 border-l-8 border-l-red-600">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-4 h-4 bg-red-600 rounded-full mr-3 shadow-material-2"></span>
              ⚡ XGBoost Models ({availableModels.totals.xgboost})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableModels.xgboost_models.map((model) => (
                <ModelCard
                  key={model}
                  modelName={model}
                  type="XGBoost"
                  isCurrent={currentModel === model}
                />
              ))}
            </div>
          </div>

          {/* Linear Models */}
          <div className="bg-white rounded-2xl shadow-material-4 p-6 border-2 border-gray-200 border-l-8 border-l-green-600">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-4 h-4 bg-green-600 rounded-full mr-3 shadow-material-2"></span>
              📊 Linear Models ({availableModels.totals.linear})
            </h3>
            
            {/* Ridge */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">🎯 Ridge Regression</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableModels.linear_models.ridge.map((model) => (
                  <ModelCard
                    key={model}
                    modelName={model}
                    type="Ridge"
                    isCurrent={currentModel === model}
                  />
                ))}
              </div>
            </div>

            {/* Lasso */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Lasso Regression</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableModels.linear_models.lasso.map((model) => (
                  <ModelCard
                    key={model}
                    modelName={model}
                    type="Lasso"
                    isCurrent={currentModel === model}
                  />
                ))}
              </div>
            </div>

            {/* ElasticNet */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">ElasticNet Regression</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableModels.linear_models.elasticnet.map((model) => (
                  <ModelCard
                    key={model}
                    modelName={model}
                    type="ElasticNet"
                    isCurrent={currentModel === model}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-material-8 p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-9 h-9" />
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
                  <span className="text-3xl">🏆</span>
                </div>
              </div>
              <p className="text-sm opacity-90 mb-1 uppercase tracking-wide font-bold">Best RMSE Model</p>
              <p className="text-lg font-bold">{stats.best_rmse_model}</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-material-8 p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-9 h-9" />
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
                  <span className="text-3xl">📈</span>
                </div>
              </div>
              <p className="text-sm opacity-90 mb-1 uppercase tracking-wide font-bold">Best R² Model</p>
              <p className="text-lg font-bold">{stats.best_r2_model}</p>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-material-8 p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-9 h-9" />
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
                  <span className="text-3xl">🚀</span>
                </div>
              </div>
              <p className="text-sm opacity-90 mb-1 uppercase tracking-wide font-bold">Currently Deployed</p>
              <p className="text-lg font-bold">{stats.currently_deployed}</p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-lg shadow-material-4 p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Model Performance Comparison
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="RMSE" fill="#005EB8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="MAE" fill="#00897b" radius={[8, 8, 0, 0]} />
                <Bar dataKey="R² Score" fill="#E32119" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Statistics Table */}
          <div className="bg-white rounded-lg shadow-material-4 p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Detailed Statistics
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-indigo-500">
                    <th className="text-left py-3 px-4 text-gray-900 font-medium">
                      Model
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 font-medium">
                      RMSE
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 font-medium">
                      MAE
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 font-medium">
                      R² Score
                    </th>
                    <th className="text-left py-3 px-4 text-gray-900 font-medium">
                      Training Time
                    </th>
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
                        className={`border-b border-gray-100 hover:bg-indigo-50 transition-colors ${
                          isDeployed ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {model.model_name}
                            </span>
                            {isDeployed && (
                              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                Active
                              </span>
                            )}
                            {isBestRMSE && (
                              <span className="text-xl" title="Best RMSE">
                                🏆
                              </span>
                            )}
                            {isBestR2 && (
                              <span className="text-xl" title="Best R²">
                                ⭐
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`font-bold ${
                              isBestRMSE ? 'text-blue-600' : 'text-gray-600'
                            }`}
                          >
                            {model.test_rmse.toFixed(4)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {model.test_mae.toFixed(4)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`font-bold ${
                              isBestR2 ? 'text-red-600' : 'text-gray-600'
                            }`}
                          >
                            {model.test_r2.toFixed(4)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {model.training_time.toFixed(2)}s
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Metrics Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
              <h4 className="text-base font-bold text-blue-700 mb-2 flex items-center">
                🎯 RMSE (Root Mean Squared Error)
              </h4>
              <p className="text-sm text-gray-700">
                Measures average prediction error. Lower is better. More sensitive to
                large errors.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-300">
              <h4 className="text-base font-bold text-green-700 mb-2 flex items-center">
                📊 MAE (Mean Absolute Error)
              </h4>
              <p className="text-sm text-gray-700">
                Average absolute difference between predicted and actual values. Lower
                is better.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-300">
              <h4 className="text-base font-bold text-red-700 mb-2 flex items-center">
                ⭐ R² Score
              </h4>
              <p className="text-sm text-gray-700">
                Proportion of variance explained by model. Higher is better (max 1.0).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
