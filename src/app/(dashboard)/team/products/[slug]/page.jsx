'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { use } from 'react';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import Link from 'next/link';
import ProductForm from '@/component/forms/ProductForm';

const ProductEditPage = ({ params }) => {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/team/product/${slug}`);
      if (res.data.success) {
        setProduct(res.data.data);
      } else {
        toast.error('Product not found');
      }
    } catch (error) {
      toast.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full space-y-6">
      <Toaster position="top-center" />

      <div className="flex items-center justify-between">
        <Link
          href="/team/products"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold text-sm"
        >
          <FiArrowLeft size={16} /> Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-white flex items-center justify-center shadow-md shadow-primary-light/20 shrink-0">
              <FiPackage size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Edit Product</h1>
                {product && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    product.is_published ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                  }`}>
                    {product.is_published ? 'Published' : 'Draft'}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                {loading ? 'Loading product details...' : product?.name === 'enter title' ? 'Editing new demo product details' : product?.name || slug}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-10 h-10 border-4 border-primary-light/20 border-t-primary-light rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm font-semibold animate-pulse">Fetching product details...</p>
            </div>
          ) : product ? (
            <ProductForm
              initialData={product}
              onCancel={() => window.history.back()}
            />
          ) : (
            <div className="text-center py-16 text-slate-400">
              <FiPackage size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-base font-bold text-slate-700">Product not found</p>
              <Link href="/team/products" className="text-primary hover:underline text-xs font-semibold mt-2 inline-block">
                Return to Products List
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;
