'use client';

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiCheck,
  FiExternalLink,
  FiShield,
  FiCpu,
  FiMessageSquare,
  FiMaximize2,
  FiX,
  FiLayers,
  FiBookOpen,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingCart,
  FiTag
} from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Context } from '@/component/helper/Context';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const { userData, isLoggedIn } = useContext(Context);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // overview, features, support
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const res = await axios.get(`/api/public/product/${slug}`);
        if (res.data.success) {
          setProduct(res.data.data);
          const primaryIndex = res.data.data.images?.findIndex(img => img.is_primary);
          setActiveIndex(primaryIndex !== -1 && primaryIndex !== undefined ? primaryIndex : 0);
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

  // Auto slider effect for multi-image products
  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [product, activeIndex]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50/50 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start">
        <div className="w-full max-w-7xl mx-auto space-y-8 animate-pulse pt-4">
          <div className="h-6 bg-slate-200 rounded-md w-36"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white/60 border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-video bg-slate-200 rounded-2xl"></div>
              <div className="grid grid-cols-4 gap-3">
                <div className="aspect-video bg-slate-200 rounded-xl"></div>
                <div className="aspect-video bg-slate-200 rounded-xl"></div>
                <div className="aspect-video bg-slate-200 rounded-xl"></div>
                <div className="aspect-video bg-slate-200 rounded-xl"></div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between py-2">
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 rounded-md w-28"></div>
                <div className="h-10 bg-slate-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-md w-full"></div>
                <div className="h-4 bg-slate-200 rounded-md w-5/6"></div>
              </div>
              <div className="space-y-3">
                <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
                <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [];
  const activeImage = images[activeIndex]?.image || null;

  // Price calculations
  const originalPrice = Number(product.price) || 0;
  const discountPercent = Number(product.discount) || 0;
  const finalPrice = discountPercent > 0
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  return (
    <div className="min-h-screen w-full bg-slate-50/30 relative overflow-hidden pb-16 pt-20">
      <Toaster position="top-center" />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-sky-200/20 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-200/10 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-8 animate-fade-in">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-semibold text-sm transition-all duration-200 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400 text-sm font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white/70 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 sm:p-8 animate-fade-up">

          {/* Left Column: Image Gallery & Carousel */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 bg-slate-900/5 shadow-inner group flex items-center justify-center">
              {activeImage ? (
                <>
                  <Image
                    width={1200}
                    height={800}
                    src={activeImage}
                    alt={images[activeIndex]?.title || product.name}
                    className="w-full h-full object-cover transition-all duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />

                  {/* Expand Image Button */}
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md text-slate-700 hover:text-primary hover:bg-white rounded-xl shadow-lg border border-slate-100 hover:scale-110 transition-all duration-200 cursor-pointer z-10"
                    aria-label="Expand image"
                  >
                    <FiMaximize2 size={16} />
                  </button>

                  {/* Manual Arrow Controls */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md text-slate-700 hover:text-primary hover:bg-white rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-all duration-200 cursor-pointer z-10"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex((prev) => (prev + 1) % images.length);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-md text-slate-700 hover:text-primary hover:bg-white rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-all duration-200 cursor-pointer z-10"
                        aria-label="Next image"
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300 gap-2 py-20">
                  <FiLayers size={48} className="animate-bounce" />
                  <span className="text-lg font-bold">No Image Preview Available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip Selector */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeIndex === idx
                        ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-md'
                        : 'border-slate-200/80 opacity-70 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <Image
                      width={200}
                      height={120}
                      src={img.image}
                      alt={img.title || `Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Overview, Price & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Featured Badge & Pricing Header */}
              <div className="flex items-center justify-between gap-3">
                {product.is_featured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-xs font-bold uppercase tracking-wider">
                    <FiTag size={13} /> Featured Product
                  </span>
                )}

                {/* Price Tag */}
                <div className="ml-auto flex items-baseline gap-2">
                  {discountPercent > 0 && (
                    <span className="text-slate-400 text-sm line-through font-semibold">
                      ${originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-3xl font-extrabold text-slate-900">
                    {finalPrice > 0 ? `$${finalPrice.toLocaleString()}` : 'Free / Contact'}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Core Features Highlights */}
              {product.features && product.features.length > 0 && (
                <div className="pt-4 space-y-2.5 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Highlights</h3>
                  <div className="space-y-2">
                    {product.features.slice(0, 4).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                          <FiCheck size={12} />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{f.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              {product.demo_url && (
                <a
                  href={product.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-md shadow-sky-500/20"
                >
                  <FiExternalLink className="group-hover:scale-105 transition-transform" size={16} />
                  Launch Live Product Demo
                </a>
              )}

              {isLoggedIn ? (
                <Link
                  href="/user/tickets"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                >
                  <FiShoppingCart size={16} />
                  Request Custom Implementation
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                >
                  <FiMessageSquare size={16} />
                  Inquire Support & Purchase
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Tabbed Detailed Specifications */}
        <div className="mt-10 w-full animate-fade-in">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 gap-6 sm:gap-8 mb-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Product Overview', icon: <FiBookOpen size={16} /> },
              { id: 'features', label: 'Technical Specifications', icon: <FiLayers size={16} /> },
              { id: 'support', label: 'Support & Inquiries', icon: <FiMessageSquare size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 pb-4 font-bold text-sm transition-all relative shrink-0 cursor-pointer ${
                  activeTab === tab.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeProductTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4"
                >
                  <h3 className="text-xl font-extrabold text-slate-900">About {product.name}</h3>
                  {product.description ? (
                    <div
                      className="prose prose-slate max-w-none prose-p:leading-relaxed text-sm text-slate-700 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <p className="text-slate-400 text-sm">No detailed description provided for this product.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'features' && (
                <motion.div
                  key="features-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
                >
                  <h3 className="text-xl font-extrabold text-slate-900">Technical Features & Specifications</h3>
                  {product.features && product.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                            <FiCheck size={16} />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm">{feature.name}</h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{feature.description || 'Pre-configured core module'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm py-4">No specific feature list defined for this product.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div
                  key="support-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-extrabold">Technical Support & Guidance</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Need assistance with product configuration, deployment, or custom integration? Our team is here to assist.
                      </p>
                    </div>

                    <Link
                      href={isLoggedIn ? "/user/tickets" : "/contact"}
                      className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-sky-400 text-white font-extrabold text-xs rounded-xl transition-all shadow-md"
                    >
                      <FiMessageSquare size={14} />
                      {isLoggedIn ? "Open Support Ticket" : "Contact Sales & Support"}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quality Standards Pillars */}
        <div className="mt-12 border-t border-slate-200/80 pt-10">
          <div className="text-center mb-8 space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">Built to Professional Standards</h2>
            <p className="text-xs text-slate-500">Engineered for durability, speed, and enterprise security</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FiCpu className="text-primary" size={24} />,
                title: "High Performance Architecture",
                desc: "Optimized database queries, caching, and clean code for seamless user experience."
              },
              {
                icon: <FiShield className="text-indigo-500" size={24} />,
                title: "Enterprise Security",
                desc: "Sanitized data structures, encrypted auth sessions, and strict access controls."
              },
              {
                icon: <FiActivity className="text-emerald-500" size={24} />,
                title: "Reliability & Support",
                desc: "Full technical assistance, continuous updates, and structured support tickets."
              }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{pillar.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxOpen(false)} />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-5xl w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center z-10"
            >
              <Image
                width={1600}
                height={1000}
                src={activeImage}
                alt={`${product.name} Full preview`}
                className="w-full h-full object-contain"
              />

              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors border border-white/10 cursor-pointer"
                aria-label="Close preview"
              >
                <FiX size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
