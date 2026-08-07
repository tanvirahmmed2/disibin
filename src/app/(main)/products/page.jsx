'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiChevronDown, 
  FiLayers, 
  FiExternalLink, 
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const ProductCard = ({ product }) => {
  const [mainIndex, setMainIndex] = useState(0);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const features = product.features && product.features.length > 0 ? product.features : [];

  const plainDescription = stripHtml(product.description);
  const isDescriptionLong = plainDescription.length > 100;
  const shortDescription = isDescriptionLong ? `${plainDescription.slice(0, 100).trim()}...` : plainDescription;

  // Calculate before (previous) and next image indices
  const N = images.length;
  const prevIndex = N > 1 ? (mainIndex - 1 + N) % N : null;
  const nextIndex = N > 1 ? (mainIndex + 1) % N : null;

  const handlePanEnd = (event, info) => {
    const threshold = 30;
    if (info.offset.x < -threshold) {
      if (nextIndex !== null) setMainIndex(nextIndex);
    } else if (info.offset.x > threshold) {
      if (prevIndex !== null) setMainIndex(prevIndex);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col transition-all gap-5 md:gap-6 even:bg-tertiary-light p-4 sm:p-6 md:p-8 odd:bg-primary-light odd:text-tertiary-light"
    >
      <div className="flex flex-col gap-2 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={`/products/${product.slug}`} className="group">
            <h2 className="text-2xl sm:text-4xl font-bold group-hover:text-primary transition-colors font-poppins flex items-center gap-2.5">
              {product.name}
              {product.is_featured && (
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0">
                  Featured
                </span>
              )}
            </h2>
          </Link>
          {product.price && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold ">${product.price - product.discount}</span>
              {product.discount > 0 && (
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  ${product.discount} OFF
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Image Showcase with In-Place Stationary Swap */}
      <div className="w-full flex flex-col gap-3">
        {images.length > 0 ? (
          <>
            {/* Desktop 3-in-a-row Layout (md+) */}
            <div className="hidden md:flex items-center justify-center gap-3 sm:gap-4 h-[340px] lg:h-[380px] w-full select-none">
              {/* Left / Before Image (Stationary) */}
              {prevIndex !== null ? (
                <div className="w-1/4 h-[85%] relative rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-200/80 opacity-75 shrink-0 select-none">
                  <Image
                    src={images[prevIndex]?.image}
                    alt={images[prevIndex]?.title || 'Previous image'}
                    fill
                    sizes="25vw"
                    className="object-cover object-center select-none pointer-events-none"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md pointer-events-none">
                    Before
                  </div>
                </div>
              ) : null}

              <motion.div
                onPanEnd={handlePanEnd}
                className="w-1/2 h-full relative rounded-2xl overflow-hidden bg-slate-900/5 border-2 border-primary/30 shadow-md select-none touch-pan-y"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mainIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={images[mainIndex]?.image}
                      alt={images[mainIndex]?.title || product.name}
                      fill
                      sizes="50vw"
                      className="object-cover object-center select-none pointer-events-none"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {nextIndex !== null ? (
                <div className="w-1/4 h-[85%] relative rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-200/80 opacity-75 shrink-0 select-none">
                  <Image
                    src={images[nextIndex]?.image}
                    alt={images[nextIndex]?.title || 'Next image'}
                    fill
                    sizes="25vw"
                    className="object-cover object-center select-none pointer-events-none"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md pointer-events-none">
                    Next
                  </div>
                </div>
              ) : null}
            </div>

            {/* Mobile Single Image Display (< md) */}
            <motion.div
              onPanEnd={handlePanEnd}
              className="block md:hidden relative w-full h-[260px] sm:h-[320px] rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-200/80 select-none touch-pan-y"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={images[mainIndex]?.image}
                    alt={images[mainIndex]?.title || product.name}
                    fill
                    sizes="100vw"
                    className="object-cover object-center select-none pointer-events-none"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <div className="w-full aspect-video rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-poppins">
            No preview images available
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm sm:text-base leading-relaxed  font-poppins">
          {shortDescription || 'No description available for this product.'}
          {isDescriptionLong && (
            <Link
              href={`/products/${product.slug}`}
              className="ml-1.5 hover:underline text-xs font-semibold text-primary inline-flex items-center gap-0.5"
            >
              Read details
            </Link>
          )}
        </p>
      </div>

      {features.length > 0 && (
        <div className="flex flex-col w-full border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50">
          <button
            onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
            className="flex items-center justify-between w-full px-4 py-3.5 bg-slate-100/70 hover:bg-slate-100 text-slate-800 font-semibold text-sm sm:text-base transition-colors cursor-pointer"
            aria-expanded={isFeaturesOpen}
          >
            <div className="flex items-center gap-2.5">
              <FiLayers className="text-primary w-5 h-5 shrink-0" />
              <span className="font-poppins">Features & Specifications</span>
              <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full font-poppins">
                {features.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium font-poppins">
              <span>{isFeaturesOpen ? 'Hide features' : 'Show features'}</span>
              <FiChevronDown
                className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${
                  isFeaturesOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </div>
          </button>

          <AnimatePresence>
            {isFeaturesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-2.5 p-4 bg-tertiary-light border-t border-slate-200/60">
                  {features.map((feature, idx) => (
                    <div
                      key={feature.id || idx}
                      className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-800 font-poppins">
                        <div className="flex items-center gap-2">
                          <FiCheck className="text-emerald-500 shrink-0 w-4 h-4" />
                          <span>{feature.name}</span>
                        </div>
                        {feature.value && (
                          <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                            {feature.value}
                          </span>
                        )}
                      </div>
                      {feature.description && (
                        <p className="text-xs text-slate-600 pl-6 leading-relaxed font-poppins">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-1">
        <Link
          href={`/products/${product.slug}`}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-colors shadow-xs font-poppins"
        >
          <span>View Details</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
        {product.demo_url && (
          <a
            href={product.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary transition-colors px-3 py-2 font-poppins"
          >
            <span>Live Demo</span>
            <FiExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/public/product');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full ">
      <div className="w-full flex flex-col gap-10">

        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl text-slate-900 font-bold font-poppins">
            Our Premium Products
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-poppins">
            Choose the perfect solution for your business. Scalable, secure, and reliable.
          </p>
        </div>

        <div className="w-full flex flex-col">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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

