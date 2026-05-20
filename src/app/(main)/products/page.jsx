'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import Image from 'next/image';

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
      <div className="w-full mx-auto">

        <div className="text-center mb-16">
          <h1 className="text-4xl text-slate-900 sm:text-7xl bg-clip-text  font-poppins">
            Our Premium Products
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto font-poppins">
            Choose the perfect solution for your business. Scalable, secure, and reliable.
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.product_id} className="bg-white flex flex-col gap-4 md:even:flex-col-reverse overflow-hidden">


              <Link href={`/products/${product.slug}`} className="p-6 grow flex flex-col">
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {product.name}
                </h2>

                {product.features && product.features.length > 0 && (
                  <div className="mt-4 space-y-2 grow">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                        <FiCheck className="text-emerald-500 shrink-0" />
                        <span>{feature.name}</span>
                      </div>
                    ))}
                    {product.features.length > 3 && (
                      <p className="text-xs text-slate-400">+{product.features.length - 3} more features</p>
                    )}
                  </div>
                )}


              </Link>

              <Link href={product.demo_url} className='w-full grid grid-cols-2'>
                {
                  product.images.map((i)=>(
                    <Image key={i.id} src={i.url} alt='Image' width={1000} height={1000} className='w-full aspect-video even:aspect-square object-cover overflow-hidden hover:scale-105 transition ease-in-out duration-500 cursor-pointer'/>
                  ))
                }
              </Link>
              

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
