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
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 border-t-4 border-t-[#0099FF]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#2C2C2C] mb-1">
              📦 Batch Prediction
            </h2>
            <p className="text-sm text-[#666666]">
              Process multiple products simultaneously (max 100)
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={addProduct}
              disabled={products.length >= 100}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#E5001A] bg-white border border-[#E5001A] rounded-lg hover:bg-[#FFE6E9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <button
              onClick={handleBatchPredict}
              disabled={loading || products.length === 0}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#0099FF] to-[#0066CC] rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 border-l-4 border-l-[#E5001A]">
        <h3 className="font-semibold text-[#2C2C2C] mb-4 flex items-center justify-between">
          <span>📋 Products List</span>
          <span className="text-sm font-medium text-[#0099FF] bg-[#E6F5FF] px-3 py-1 rounded-lg">
            {products.length} / 100
          </span>
        </h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center space-x-3 p-4 bg-[#E6F5FF] rounded-lg border border-[#0099FF]/20 hover:border-[#0099FF] transition-all"
            >
              <div className="w-8 h-8 bg-[#0099FF] text-white rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0">
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
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
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                placeholder="Price"
              />
              <select
                value={product.store_size}
                onChange={(e) => {
                  const newProducts = [...products];
                  newProducts[index].store_size = e.target.value;
                  setProducts(newProducts);
                }}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
              <button
                onClick={() => removeProduct(product.id)}
                className="p-2 text-[#E5001A] hover:bg-[#FFE6E9] rounded-lg transition-colors"
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
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 border-t-4 border-t-green-600">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-[#2C2C2C] mb-1">
                🏆 Prediction Results
              </h3>
              <p className="text-sm text-[#666666]">
                Analysis of {result.summary.total_products} products
              </p>
            </div>
            <button
              onClick={exportResults}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#E5001A] bg-white border border-[#E5001A] rounded-lg hover:bg-[#FFE6E9] transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#0099FF] to-[#0066CC] rounded-xl p-5 text-white shadow-lg">
              <p className="text-sm opacity-90 mb-1">📈 Total Sales</p>
              <p className="text-3xl font-bold">
                {result.summary.total_predicted_sales.toFixed(0)}
              </p>
              <p className="text-xs opacity-80 mt-1">units/week</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-5 text-white shadow-lg">
              <p className="text-sm opacity-90 mb-1">🎯 Average Sales</p>
              <p className="text-3xl font-bold">
                {result.summary.average_predicted_sales.toFixed(2)}
              </p>
              <p className="text-xs opacity-80 mt-1">units/product/week</p>
            </div>
            <div className="bg-gradient-to-br from-[#E5001A] to-red-700 rounded-xl p-5 text-white shadow-lg">
              <p className="text-sm opacity-90 mb-1">🆕 Cold-Start</p>
              <p className="text-3xl font-bold">
                {result.summary.cold_start_products}
              </p>
              <p className="text-xs opacity-80 mt-1">out of {result.summary.total_products}</p>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-[#666666]">#</th>
                  <th className="text-left py-3 px-4 font-medium text-[#666666]">Family</th>
                  <th className="text-left py-3 px-4 font-medium text-[#666666]">Brand</th>
                  <th className="text-right py-3 px-4 font-medium text-[#666666]">Prediction</th>
                  <th className="text-right py-3 px-4 font-medium text-[#666666]">Confidence</th>
                  <th className="text-center py-3 px-4 font-medium text-[#666666]">Status</th>
                </tr>
              </thead>
              <tbody>
                {result.predictions.map((pred, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-[#E6F5FF] transition-colors">
                    <td className="py-3 px-4 text-[#888888]">{index + 1}</td>
                    <td className="py-3 px-4 text-[#2C2C2C]">{pred.input?.family || 'N/A'}</td>
                    <td className="py-3 px-4 text-[#2C2C2C]">{pred.input?.brand || 'N/A'}</td>
                    <td className="py-3 px-4 text-right font-medium text-[#0099FF]">
                      {pred.predicted_weekly_sales?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right text-[#666666]">
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
