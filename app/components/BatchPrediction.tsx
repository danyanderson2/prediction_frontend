'use client';

import { useState } from 'react';
import { Upload, Download, Loader2, Plus, X, FileDown } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Product {
  id: string;
  family: string;
  brand: string;
  price_per_pack: number;
  store_size: string;
}

interface BatchResult {
  predictions: any[];
  summary: {
    total_products: number;
    total_predicted_sales: number;
    average_predicted_sales: number;
    cold_start_products: number;
    established_products: number;
  };
}

export default function BatchPrediction() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      family: 'PATES_RIZ_FECULENTS',
      brand: 'Brand A',
      price_per_pack: 2.99,
      store_size: 'L',
    },
  ]);

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        family: 'EPICERIE_SALEE',
        brand: '',
        price_per_pack: 3.99,
        store_size: 'M',
      },
    ]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleBatchPredict = async () => {
    if (products.length === 0) {
      toast.error('Add at least one product');
      return;
    }

    setLoading(true);
    try {
      const apiProducts = products.map((p) => ({
        family: p.family,
        sub_family: 'DEFAULT',
        brand: p.brand,
        customer_need: 'General',
        customer_need_importance: 7.5,
        brand_importance: 7.5,
        price_per_pack: p.price_per_pack,
        pack_size_g: 500,
        base_demand_N1_per_store: 12.5,
        region: 'AUVERGNE_RHONE_ALPES',
        store_size: p.store_size,
        surface_m2: 2500,
        store_size_factor: 1.25,
        assortment_coverage: 0.78,
        cold_start: false,
      }));

      const response = await axios.post(`${API_URL}/predict/batch`, {
        products: apiProducts,
      });
      setResult(response.data);
      toast.success(`Predicted ${response.data.predictions.length} products!`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Batch prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!result) return;
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `batch_predictions_${Date.now()}.json`;
    link.click();
    toast.success('Results exported!');
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-material-4 p-6 border-t-4 border-blue-600">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              📦 Batch Prediction
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              Process multiple products simultaneously (max 100)
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={addProduct}
              disabled={products.length >= 100}
              className="material-button-secondary"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <button
              onClick={handleBatchPredict}
              disabled={loading || products.length === 0}
              className="material-button-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Predict All</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-material-4 p-6 border-l-4 border-red-600">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
          <span>📋 Products List</span>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
            {products.length} / 100
          </span>
        </h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-material-2 transition-all"
            >
              <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-material-2">
                {index + 1}
              </div>
              <input
                type="text"
                value={product.family}
                onChange={(e) => {
                  const newProducts = [...products];
                  newProducts[index].family = e.target.value;
                  setProducts(newProducts);
                }}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 font-medium"
                placeholder="Family"
              />
              <input
                type="text"
                value={product.brand}
                onChange={(e) => {
                  const newProducts = [...products];
                  newProducts[index].brand = e.target.value;
                  setProducts(newProducts);
                }}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 font-medium"
                placeholder="Brand"
              />
              <input
                type="number"
                value={product.price_per_pack}
                onChange={(e) => {
                  const newProducts = [...products];
                  newProducts[index].price_per_pack = parseFloat(e.target.value);
                  setProducts(newProducts);
                }}
                className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 font-medium"
                placeholder="Price"
              />
              <select
                value={product.store_size}
                onChange={(e) => {
                  const newProducts = [...products];
                  newProducts[index].store_size = e.target.value;
                  setProducts(newProducts);
                }}
                className="w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
              <button
                onClick={() => removeProduct(product.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Remove product"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl shadow-material-4 p-6 border-t-4 border-green-600">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                🏆 Prediction Results
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                Analysis of {result.summary.total_products} products
              </p>
            </div>
            <button
              onClick={exportResults}
              className="material-button-secondary"
            >
              <FileDown className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 text-white shadow-material-4 transform hover:scale-105 transition-transform">
              <p className="text-sm opacity-90 mb-1 uppercase tracking-wide font-bold">📈 Total Sales</p>
              <p className="text-4xl font-bold">
                {result.summary.total_predicted_sales.toFixed(0)}
              </p>
              <p className="text-xs opacity-80 mt-1 font-medium">units/week</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-5 text-white shadow-material-4 transform hover:scale-105 transition-transform">
              <p className="text-sm opacity-90 mb-1 uppercase tracking-wide font-bold">🎯 Average Sales</p>
              <p className="text-4xl font-bold">
                {result.summary.average_predicted_sales.toFixed(2)}
              </p>
              <p className="text-xs opacity-80 mt-1 font-medium">units/product/week</p>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-5 text-white shadow-material-4 transform hover:scale-105 transition-transform">
              <p className="text-sm opacity-90 mb-1 uppercase tracking-wide font-bold">🆕 Cold-Start</p>
              <p className="text-4xl font-bold">
                {result.summary.cold_start_products}
              </p>
              <p className="text-xs opacity-80 mt-1 font-medium">out of {result.summary.total_products}</p>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Family</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Brand</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Prediction</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Confidence</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.predictions.map((pred, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-indigo-50 transition-colors">
                    <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4 text-gray-900">{pred.input?.family || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-900">{pred.input?.brand || 'N/A'}</td>
                    <td className="py-3 px-4 text-right font-medium text-indigo-600">
                      {pred.predicted_weekly_sales?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {pred.confidence_score ? `${pred.confidence_score.toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {pred.cold_start_detected ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          Cold-Start
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          Established
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
