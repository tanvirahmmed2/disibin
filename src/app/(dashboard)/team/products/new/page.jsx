'use client';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import Link from 'next/link';
import ProductForm from '@/component/forms/ProductForm';

const NewProductPage = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <Toaster position="top-center" />

      <div className="flex items-center justify-between">
        <Link
          href="/team/products"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <FiArrowLeft /> Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
              <FiPackage size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Create New Product</h1>
              <p className="text-slate-500 font-medium">Define your new product offering</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          <ProductForm onCancel={() => window.history.back()} />
        </div>
      </div>
    </div>
  );
};

export default NewProductPage;
