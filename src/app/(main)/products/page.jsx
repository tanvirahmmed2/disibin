'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/product');
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
       
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl bg-clip-text  bg-linear-to-r from-sky-600 to-indigo-600">
            Our Premium Products
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the perfect solution for your business. Scalable, secure, and reliable.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.product_id} className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-sky-200 transition-all duration-300 group flex flex-col">
              {/* Image/Gradient Header */}
              <div className="h-48 bg-gradient-to-br from-sky-400 to-indigo-500 relative flex items-center justify-center overflow-hidden">
                {product.primary_image ? (
                  <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="text-white text-2xl font-bold opacity-30">{product.name}</div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-sky-600">
                  ${product.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {product.name}
                </h2>
                <p className="mt-2 text-slate-600 text-sm line-clamp-3">
                  {product.description}
                </p>

                {/* Features Preview */}
                {product.features && product.features.length > 0 && (
                  <div className="mt-4 space-y-2 flex-grow">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                        <FiCheck className="text-emerald-500 flex-shrink-0" />
                        <span>{feature.name}</span>
                      </div>
                    ))}
                    {product.features.length > 3 && (
                      <p className="text-xs text-slate-400">+{product.features.length - 3} more features</p>
                    )}
                  </div>
                )}

                {/* Button */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <Link href={`/products/${product.slug}`} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-sky-600 transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-slate-200">
                    View Details
                    <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-200 rounded-3xl">
            No products available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
