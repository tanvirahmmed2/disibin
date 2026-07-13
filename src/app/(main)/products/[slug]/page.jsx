'use client';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiCheck, 
  FiExternalLink, 
  FiHelpCircle, 
  FiShield, 
  FiCpu, 
  FiMessageSquare, 
  FiChevronDown, 
  FiMaximize2, 
  FiX, 
  FiLayers, 
  FiBookOpen,
  FiActivity,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Context } from '@/component/helper/Context';

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  
  const { userData, isLoggedIn } = useContext(Context);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // overview, features, support
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = product?.images?.[activeIndex]?.url || null;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const res = await axios.get(`/api/product/${slug}`);
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

  // Auto slider effect
  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }, 4500); // changes image every 4.5 seconds

    return () => clearInterval(interval);
  }, [product, activeIndex]);


  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50/50 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start">
        <div className="w-full max-w-7xl mx-auto space-y-8 animate-pulse pt-4">
          <div className="h-6 bg-slate-200 rounded-md w-36"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white/60 border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-video bg-slate-200 rounded-2xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-3">
                <div className="aspect-video bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="aspect-video bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="aspect-video bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="aspect-video bg-slate-200 rounded-xl animate-pulse"></div>
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

  return (
    <div className="min-h-screen w-full bg-slate-50/30 relative overflow-hidden pb-8">

      <div className="absolute top-10 left-10 w-72 h-72 bg-sky-200/20 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-200/10 rounded-full filter blur-3xl pointer-events-none -z-10 animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
       
        <div className="flex items-center gap-2 mb-8 animate-fade-in">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 font-semibold text-sm transition-all duration-200 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400 text-sm font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>

        <div className="flex flex-col gap-6 bg-white/70 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-4 sm:p-5 animate-fade-up">
          
          <div className="w-full flex flex-col gap-4">
    
            <div className="relative aspect-video  rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shadow-inner group flex items-center justify-center">
              {activeImage ? (
                <>
                  <Image 
                    width={1200} 
                    height={800} 
                    src={activeImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
                  
                  {/* Expand Image Button */}
                  <button 
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md text-slate-700 hover:text-sky-600 hover:bg-white rounded-xl shadow-lg border border-slate-100 hover:scale-110 transition-all duration-200 cursor-pointer z-10"
                    aria-label="Expand image"
                  >
                    <FiMaximize2 size={16} />
                  </button>

                  {/* Manual Navigation Buttons */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 backdrop-blur-md text-slate-700 hover:text-sky-600 hover:bg-white rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-all duration-200 cursor-pointer z-10 flex items-center justify-center"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex((prev) => (prev + 1) % product.images.length);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 backdrop-blur-md text-slate-700 hover:text-sky-600 hover:bg-white rounded-full shadow-lg border border-slate-100 hover:scale-110 transition-all duration-200 cursor-pointer z-10 flex items-center justify-center"
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
                  <span className="text-lg font-bold">No Preview Available</span>
                </div>
              )}
            </div>


          </div>

          <div className="w-full flex flex-col justify-between gap-6 py-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900  tracking-tight mb-4">
                {product.name}
              </h1>

              {product.features && product.features.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Core Highlights</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {product.features.slice(0, 3).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                          <FiCheck className="text-emerald-500" size={12} />
                        </div>
                        <span className="text-sm font-semibold text-slate-650">{f.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions CTA Bar */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              {product.demo_url && (
                <a
                  href={product.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-md shadow-sky-500/10 cursor-pointer"
                >
                  <FiExternalLink className="group-hover:scale-105 transition-transform" />
                  Launch Live Demo
                </a>
              )}
              
              {isLoggedIn ? (
                <Link
                  href="/user/tickets"
                  className="w-full bg-white text-slate-700 border border-slate-200 font-semibold py-3 px-6 rounded-xl hover:bg-slate-50 hover:border-slate-305 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiMessageSquare />
                  Open Technical Ticket
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="w-full bg-white text-slate-700 border border-slate-200 font-semibold py-3 px-6 rounded-xl hover:bg-slate-50 hover:border-slate-305 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiMessageSquare />
                  Inquire Support / Ask Question
                </Link>
              )}
            </div>

          </div>

        </div>

        {/* Tabbed Info System */}
        <div className="mt-8 w-full animate-fade-in">
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-250/80 gap-6 sm:gap-8 mb-6 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Product Overview', icon: <FiBookOpen size={16} /> },
              { id: 'features', label: 'Technical Specifications', icon: <FiLayers size={16} /> },
              { id: 'support', label: 'Support', icon: <FiMessageSquare size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 pb-4 font-semibold text-sm transition-all duration-300 relative shrink-0 cursor-pointer ${
                  activeTab === tab.id ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeProductTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div className="min-h-[250px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 sm:p-6"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-4 font-poppins">About the Product</h3>
                  {product.description ? (
                    <div 
                      className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-poppins prose-a:text-sky-600"
                      dangerouslySetInnerHTML={{ __html: product.description }} 
                    />
                  ) : (
                    <p className="text-slate-400 italic">No detailed description has been added for this product.</p>
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
                  className="space-y-6"
                >
                  <div className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 sm:p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 font-poppins">What is Included</h3>
                    {product.features && product.features.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.features.map((feature, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-4 p-4 bg-white border border-slate-50 shadow-sm rounded-xl hover:shadow-md hover:border-slate-100 transition-all duration-300"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                              <FiCheck className="stroke-2" size={16} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm font-poppins">{feature.name}</h4>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Included and optimized as a core module in this version bundle.</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        No features list has been defined.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div
                  key="support-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-2xl mx-auto w-full"
                >
                  {/* Direct Contact Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-6 flex flex-col justify-between gap-6 shadow-xl border border-slate-800">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                        <FiMessageSquare className="text-sky-400" size={24} />
                      </div>
                      <h3 className="text-xl font-bold font-poppins">Direct Tech Support</h3>
                      {isLoggedIn ? (
                        <p className="text-sm text-slate-300 leading-relaxed font-poppins">
                          Hello <span className="font-semibold text-sky-400">{userData.name}</span>, you are authenticated. You can submit a support ticket to consult directly with our product engineers.
                        </p>
                      ) : (
                        <p className="text-sm text-slate-300 leading-relaxed font-poppins">
                          Have pre-sale queries or need customization assistance? Get in touch with our team for custom implementations.
                        </p>
                      )}
                    </div>

                    <div className="pt-4">
                      {isLoggedIn ? (
                        <Link
                          href="/user/tickets"
                          className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 transition-all duration-300 cursor-pointer"
                        >
                          Submit Support Ticket
                        </Link>
                      ) : (
                        <Link
                          href="/contact"
                          className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-md transition-all duration-300 cursor-pointer"
                        >
                          Contact Our Team
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Value Highlights Pillars */}
        <div className="mt-12 border-t border-slate-200/80 pt-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 font-poppins">Built to Professional Standards</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">Disibin systems are designed for high durability, performance, and compliance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <FiCpu className="text-sky-500" size={24} />,
                title: "Optimized Performance",
                desc: "Low-latency operations, database caching, and concurrent query processing pre-configured for speed."
              },
              {
                icon: <FiShield className="text-indigo-500" size={24} />,
                title: "Enterprise Grade Security",
                desc: "Sanitized data structures, encrypted storage, and automated role authorizations guard your systems."
              },
              {
                icon: <FiActivity className="text-emerald-500" size={24} />,
                title: "Reliability & Uptime",
                desc: "Integrated backup scripts, clean logs, and structured exception handlers to isolate faults."
              }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base font-poppins">{pillar.title}</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">{pillar.desc}</p>
                </div>
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
            {/* Close trigger overlay */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxOpen(false)} />
            
            {/* Modal Box */}
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
              
              {/* Close Button */}
              <button 
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors border border-white/10 cursor-pointer"
                aria-label="Close layout preview"
              >
                <FiX size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
