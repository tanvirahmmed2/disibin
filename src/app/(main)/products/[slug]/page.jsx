'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiCheck, FiShoppingCart, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const res = await axios.get(`/api/product/${slug}`);
        if (res.data.success) {
          setProduct(res.data.data);
          const primary = res.data.data.images?.find(img => img.is_primary);
          setActiveImage(primary?.url || res.data.data.images?.[0]?.url);
        } else {
          toast.error("Product not found");
          router.push('/products');
        }
      } catch (error) {
        console.error('Failed to fetch product', error);
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen  py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/products" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-600 font-bold mb-8 transition-colors">
          <FiArrowLeft /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-md shadow-xl shadow-slate-100 border border-slate-100 p-2">
      
          <div className="space-y-4">
            <div className="relative h-96 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
              {activeImage ? (
                <Image width={1000} height={1000} src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-300 text-4xl font-bold">No Image</div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img.url ? 'border-sky-500 shadow-lg shadow-sky-100' : 'border-black/20 hover:border-slate-200'}`}
                  >
                    <Image width={1000} height={1000} src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="grow">
              <h1 className="text-4xl font-extrabold  font-lora ">
                {product.name}
              </h1>
              
              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-3xl font-bold text-slate-900">${product.price}</span>
                {product.duration_days > 0 && (
                  <span className="text-slate-500 text-sm">/ {product.duration_days} Days</span>
                )}
                {product.is_lifetime && (
                  <span className="text-emerald-500 text-sm font-bold">Lifetime Access</span>
                )}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">What&apos;s Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-50">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <FiCheck className="text-emerald-500" size={12} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              {product.demo_url && (
                <a
                  href={product.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-slate-900 border-2 border-slate-200 py-2 rounded font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group"
                >
                  <FiExternalLink className="group-hover:scale-110 transition-transform" />
                  Live Demo
                </a>
              )}
              <Link href={`/checkout/${product.product_id}`} className="w-full bg-linear-to-r from-sky-600 to-indigo-600 text-white py-2 rounded-lg font-bold hover:from-sky-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-sky-100 group">
                <FiShoppingCart className="group-hover:scale-110 transition-transform" />
                Purchase Now
              </Link>
              <p className="text-center text-xs text-slate-400 mt-4">
                Secure checkout. 100% money back guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
