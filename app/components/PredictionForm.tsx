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

// Fallback categorical options
const FALLBACK_OPTIONS: CategoricalOptions = {
  family: [
    'PATES_RIZ_FECULENTS',
    'BOISSONS',
    'PRODUITS_LAITIERS',
    'VIANDES_POISSONS',
    'FRUITS_LEGUMES',
    'EPICERIE_SALEE',
    'EPICERIE_SUCREE',
    'SURGELES',
    'PRODUITS_DENTRETIEN',
    'HYGIENE_BEAUTE'
  ],
  sub_family: [
    'PATES',
    'RIZ',
    'EAUX',
    'SODAS',
    'JUS',
    'YAOURTS',
    'FROMAGES',
    'LAIT',
    'BOEUF',
    'POULET',
    'POISSON',
    'POMMES',
    'TOMATES',
    'CONSERVES',
    'SAUCES',
    'BISCUITS',
    'CHOCOLAT',
    'LEGUMES_SURGELES',
    'PIZZAS',
    'LESSIVES',
    'NETTOYANTS',
    'SHAMPOINGS',
    'DENTIFRICES'
  ],
  brand: [
    'BARILLA',
    'PANZANI',
    'LUSTUCRU',
    'UNCLE_BENS',
    'TAUREAU_AILE',
    'EVIAN',
    'VOLVIC',
    'COCA_COLA',
    'PEPSI',
    'ORANGINA',
    'TROPICANA',
    'DANONE',
    'YOPLAIT',
    'PRESIDENT',
    'KIRI',
    'BABYBEL',
    'CHARAL',
    'HERTA',
    'FLEURY_MICHON',
    'FINDUS',
    'MARIE',
    'BJORG',
    'NESTLE',
    'FERRERO',
    'LU',
    'MILKA',
    'HARIBO',
    'BONDUELLE',
    'CASSEGRAIN',
    'MAGGI',
    'KNORR',
    'PICARD',
    'BUITONI',
    'ARIEL',
    'SKIP',
    'OMO',
    'MR_PROPRE',
    'CIF',
    'LOREAL',
    'GARNIER',
    'NIVEA',
    'COLGATE',
    'SIGNAL'
  ],
  customer_need: [
    'REPAS_RAPIDE',
    'CUISINE_MAISON',
    'GOUTER',
    'PETIT_DEJEUNER',
    'APERITIF',
    'DESSERT',
    'ACCOMPAGNEMENT',
    'PLAT_PRINCIPAL',
    'HYGIENE_QUOTIDIENNE',
    'ENTRETIEN_MAISON',
    'SANTE_BIEN_ETRE'
  ],
  region: [
    'ILE_DE_FRANCE',
    'AUVERGNE_RHONE_ALPES',
    'PROVENCE_ALPES_COTE_AZUR',
    'NOUVELLE_AQUITAINE',
    'OCCITANIE',
    'HAUTS_DE_FRANCE',
    'GRAND_EST',
    'PAYS_DE_LA_LOIRE',
    'BRETAGNE',
    'NORMANDIE',
    'BOURGOGNE_FRANCHE_COMTE',
    'CENTRE_VAL_DE_LOIRE',
    'CORSE'
  ],
  store_size: ['S', 'M', 'L', 'XL']
};

export default function PredictionForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [categoricalOptions, setCategoricalOptions] = useState<CategoricalOptions>(FALLBACK_OPTIONS);
  const [formData, setFormData] = useState<FormData>({
    family: 'PATES_RIZ_FECULENTS',
    sub_family: 'PATES',
    brand: 'BARILLA',
    customer_need: 'REPAS_RAPIDE',
    customer_need_importance: 2,
    brand_importance: 2,
    price_per_pack: 3.99,
    pack_size_g: 500,
    base_demand_N1_per_store: 15.3,
    region: 'ILE_DE_FRANCE',
    store_size: 'L',
    surface_m2: 2500,
    store_size_factor: 1.25,
    assortment_coverage: 0.82,
    cold_start: false,
  });

  useEffect(() => {
    console.log('PredictionForm mounted');
    console.log('Categorical options:', categoricalOptions);
    console.log('Family options count:', categoricalOptions.family.length);
    
    const fetchCategoricalOptions = async () => {
      try {
        const response = await axios.get(`${API_URL}/categorical-options`);
        const data = response.data;
        // Only use API data if it actually has non-empty arrays
        const hasData = data.family?.length > 0 && data.brand?.length > 0;
        if (hasData) {
          setCategoricalOptions(data);
          console.log('Loaded categorical options from API');
        } else {
          console.log('API returned empty options, keeping fallback');
        }
      } catch (error) {
        console.error('Failed to fetch categorical options:', error);
        // Keep using fallback options
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
      const payload = {
        ...formData,
        customer_need_importance: Math.round(Number(formData.customer_need_importance)),
        brand_importance: Math.round(Number(formData.brand_importance)),
      };
      const response = await axios.post(`${API_URL}/predict`, payload);
      setResult(response.data);
      toast.success('Prediction generated successfully!');
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      let msg = 'Failed to get prediction';
      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail.map((d: any) => d.msg || JSON.stringify(d)).join('; ');
      }
      toast.error(msg);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Characteristics */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm" style={{ position: 'relative', overflow: 'visible' }}>
            <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-200">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
            </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Product Family
                  </label>
                  <select
                    name="family"
                    value={formData.family}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    required
                    style={{ position: 'relative', zIndex: 10 }}
                  >
                    <option value="">Select family...</option>
                    {categoricalOptions.family.map((option) => (
                      <option key={option} value={option}>
                        {option.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Sub-Family
                  </label>
                  <select
                    name="sub_family"
                    value={formData.sub_family}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    required
                    style={{ position: 'relative', zIndex: 10 }}
                  >
                    <option value="">Select sub-family...</option>
                    {categoricalOptions.sub_family.map((option) => (
                      <option key={option} value={option}>
                        {option.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    required
                    style={{ position: 'relative', zIndex: 10 }}
                  >
                    <option value="">Select brand...</option>
                    {categoricalOptions.brand.map((option) => (
                      <option key={option} value={option}>
                        {option.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Customer Need
                  </label>
                  <select
                    name="customer_need"
                    value={formData.customer_need}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    required
                    style={{ position: 'relative', zIndex: 10 }}
                  >
                    <option value="">Select need...</option>
                    {categoricalOptions.customer_need.map((option) => (
                      <option key={option} value={option}>
                        {option.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Price per Pack (€)
                  </label>
                  <input
                    type="number"
                    name="price_per_pack"
                    value={formData.price_per_pack}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Pack Size (g)
                  </label>
                  <input
                    type="number"
                    name="pack_size_g"
                    value={formData.pack_size_g}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Base Demand N-1
                  </label>
                  <input
                    type="number"
                    name="base_demand_N1_per_store"
                    value={formData.base_demand_N1_per_store}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Need Importance (1-3)
                  </label>
                  <select
                    name="customer_need_importance"
                    value={formData.customer_need_importance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={1}>1 - Low</option>
                    <option value={2}>2 - Medium</option>
                    <option value={3}>3 - High</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Brand Importance (1-3)
                  </label>
                  <select
                    name="brand_importance"
                    value={formData.brand_importance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={1}>1 - Low</option>
                    <option value={2}>2 - Medium</option>
                    <option value={3}>3 - High</option>
                  </select>
                </div>
              </div>
          </div>

          {/* Store Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm" style={{ position: 'relative', overflow: 'visible' }}>
            <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-200">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Store Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Region */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Region
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  required
                  style={{ position: 'relative', zIndex: 10 }}
                >
                  <option value="">Select region...</option>
                  {categoricalOptions.region.map((option) => (
                    <option key={option} value={option}>
                      {option.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                </div>

              {/* Store Size */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Store Size
                </label>
                <select
                  name="store_size"
                  value={formData.store_size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  required
                  style={{ position: 'relative', zIndex: 10 }}
                  >
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                  </select>
                </div>

              {/* Surface */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Surface (m²)
                </label>
                <input
                  type="number"
                  name="surface_m2"
                  value={formData.surface_m2}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

              {/* Store Size Factor */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Store Size Factor
                </label>
                <input
                  type="number"
                  name="store_size_factor"
                  value={formData.store_size_factor}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

              {/* Assortment Coverage - Full Width */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Assortment Coverage <span className="text-xs text-gray-500">(0.0 - 1.0)</span>
                </label>
                <input
                  type="number"
                  name="assortment_coverage"
                  value={formData.assortment_coverage}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="1"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
          </div>

          {/* Cold Start Toggle */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900 block">
                  Cold Start Product
                </span>
                <span className="text-xs text-gray-600">
                  No historical sales data available
                </span>
              </div>
              
              <label htmlFor="cold_start" className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  name="cold_start"
                  id="cold_start"
                  checked={formData.cold_start}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full transition-all peer-checked:bg-blue-600"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Prediction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Prediction</span>
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
