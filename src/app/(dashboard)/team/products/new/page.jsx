'use client';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FiLoader, FiPackage } from 'react-icons/fi';

const NewProductPage = () => {
  const router = useRouter();
  const creatingRef = useRef(false);

  useEffect(() => {
    if (creatingRef.current) return;
    creatingRef.current = true;

    const createDemoProduct = async () => {
      try {
        const res = await axios.post('/api/team/product', {
          name: 'enter title',
          price: 0,
          discount: 0,
          is_published: false,
          is_featured: false,
        });

        if (res.data.success && res.data.data?.slug) {
          toast.success('Demo draft product created');
          router.replace(`/team/products/${res.data.data.slug}`);
        } else {
          toast.error(res.data.message || 'Failed to create demo product');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create demo product');
      }
    };

    createDemoProduct();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-6">
      <Toaster position="top-center" />
      <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
        <FiPackage size={24} />
      </div>
      <div className="flex items-center gap-3 text-slate-600 font-semibold">
        <FiLoader className="animate-spin text-primary" size={20} />
        <span>Initializing new demo product...</span>
      </div>
    </div>
  );
};

export default NewProductPage;
