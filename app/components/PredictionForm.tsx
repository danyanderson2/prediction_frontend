'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import PredictionResult from './PredictionResult';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FormData {
  family: string;
  sub_family: string;
  brand: string;
  customer_need: string;
  customer_need_importance: number;
  brand_importance: number;
  price_per_pack: number;
  pack_size_g: number;
  base_demand_N1_per_store: number;
  region: string;
  store_size: 'S' | 'M' | 'L' | 'XL';
  surface_m2: number;
  store_size_factor: number;
  assortment_coverage: number;
  cold_start: boolean;
}

interface PredictionResponse {
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
}

interface CategoricalOptions {
  family: string[];
  sub_family: string[];
  brand: string[];
  customer_need: string[];
  region: string[];
  store_size: string[];
}

export default function PredictionForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [categoricalOptions, setCategoricalOptions] = useState<CategoricalOptions | null>(null);
  const [formData, setFormData] = useState<FormData>({
    family: '',
    sub_family: '',
    brand: '',
    customer_need: '',
    customer_need_importance: 2,
    brand_importance: 2,
    price_per_pack: 3.99,
    pack_size_g: 500,
    base_demand_N1_per_store: 12.5,
    region: '',
    store_size: 'L',
    surface_m2: 2500,
    store_size_factor: 1.25,
    assortment_coverage: 0.78,
    cold_start: true,
  });

  useEffect(() => {
    const fetchCategoricalOptions = async () => {
      try {
        const response = await axios.get(`${API_URL}/categorical-options`);
        setCategoricalOptions(response.data);
        if (response.data) {
          setFormData(prev => ({
            ...prev,
            family: response.data.family[0] || '',
            sub_family: response.data.sub_family[0] || '',
            brand: response.data.brand[0] || '',
            customer_need: response.data.customer_need[0] || '',
            region: response.data.region[0] || ''
          }));
        }
      } catch (error) {
        console.error('Failed to fetch categorical options:', error);
        toast.error('Failed to load form options');
      }
    };

    fetchCategoricalOptions();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value) || 0
          : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData);
      setResult(response.data);
      toast.success('Prediction generated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to get prediction');
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-material-4 p-6 border-l-4 border-blue-600">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-material-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Product Information
            </h2>
            <p className="text-sm text-gray-600">
              Configure prediction parameters
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Characteristics */}
          <div className="space-y-5 bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-3 border-blue-200 shadow-material-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center space-x-3 pb-3 border-b-4 border-blue-600">
              <span className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl text-base flex items-center justify-center font-black shadow-material-4">
                1
              </span>
              <span className="uppercase tracking-wide">Product Characteristics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="material-input-wrapper">
                <label className="material-label">
                  Product Family
                </label>
                <select
                  name="family"
                  value={formData.family}
                  onChange={handleInputChange}
                  className="material-select"
                  required
                >
                  <option value="">Select family...</option>
                  {categoricalOptions?.family.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Sub-Family
                </label>
                <select
                  name="sub_family"
                  value={formData.sub_family}
                  onChange={handleInputChange}
                  className="material-select"
                  required
                >
                  <option value="">Select sub-family...</option>
                  {categoricalOptions?.sub_family.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Brand
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="material-select"
                  required
                >
                  <option value="">Select brand...</option>
                  {categoricalOptions?.brand.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Customer Need
                </label>
                <select
                  name="customer_need"
                  value={formData.customer_need}
                  onChange={handleInputChange}
                  className="material-select"
                  required
                >
                  <option value="">Select need...</option>
                  {categoricalOptions?.customer_need.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Need Importance
                </label>
                <input
                  type="number"
                  name="customer_need_importance"
                  value={formData.customer_need_importance}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="10"
                  className="material-input"
                  required
                />
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Brand Importance
                </label>
                <input
                  type="number"
                  name="brand_importance"
                  value={formData.brand_importance}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="10"
                  className="material-input"
                  required
                />
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Price Per Pack (€)
                </label>
                <input
                  type="number"
                  name="price_per_pack"
                  value={formData.price_per_pack}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="material-input"
                  required
                />
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Pack Size (g)
                </label>
                <input
                  type="number"
                  name="pack_size_g"
                  value={formData.pack_size_g}
                  onChange={handleInputChange}
                  min="0"
                  className="material-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="space-y-5 bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl border-3 border-red-200 shadow-material-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center space-x-3 pb-3 border-b-4 border-red-600">
              <span className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-xl text-base flex items-center justify-center font-black shadow-material-4">
                2
              </span>
              <span className="uppercase tracking-wide">Store Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="material-input-wrapper">
                <label className="material-label">
                  Region
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="material-select"
                  required
                >
                  <option value="">Select region...</option>
                  {categoricalOptions?.region.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Store Size
                </label>
                <select
                  name="store_size"
                  value={formData.store_size}
                  onChange={handleInputChange}
                  className="material-select"
                  required
                >
                  <option value="S">Small (S)</option>
                  <option value="M">Medium (M)</option>
                  <option value="L">Large (L)</option>
                  <option value="XL">Extra Large (XL)</option>
                </select>
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Surface (m²)
                </label>
                <input
                  type="number"
                  name="surface_m2"
                  value={formData.surface_m2}
                  onChange={handleInputChange}
                  min="0"
                  className="material-input"
                  required
                />
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Store Size Factor
                </label>
                <input
                  type="number"
                  name="store_size_factor"
                  value={formData.store_size_factor}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="material-input"
                  required
                />
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Assortment Coverage
                </label>
                <input
                  type="number"
                  name="assortment_coverage"
                  value={formData.assortment_coverage}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="1"
                  className="material-input"
                  required
                />
              </div>

              <div className="material-input-wrapper">
                <label className="material-label">
                  Base Demand N-1
                </label>
                <input
                  type="number"
                  name="base_demand_N1_per_store"
                  value={formData.base_demand_N1_per_store}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="material-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Cold Start Toggle */}
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-red-50 rounded-lg border-2 border-dashed border-gray-300">
            <input
              type="checkbox"
              name="cold_start"
              id="cold_start"
              checked={formData.cold_start}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="cold_start" className="flex-1">
              <span className="text-sm font-bold text-gray-900 block">
                🆕 Cold Start Product
              </span>
              <span className="text-xs text-gray-600">
                Product with no historical sales data
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="material-button-primary w-full shadow-material-16"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-lg">Generating Prediction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span className="text-lg">🎯 Generate Prediction</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div>
        {result ? (
          <PredictionResult result={result} />
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-material-4 p-12 text-center h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-material-2">
              <AlertCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Awaiting Input
            </h3>
            <p className="text-sm text-gray-600 max-w-xs">
              Complete the form and generate a prediction to view detailed results here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
