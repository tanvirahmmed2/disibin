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
  FiArrowRight
} from 'react-icons/fi';

const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const ProductCard = ({ product }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const sliderRef = useRef(null);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const features = product.features && product.features.length > 0 ? product.features : [];

  const plainDescription = stripHtml(product.description);
  const isDescriptionLong = plainDescription.length > 100;
  const shortDescription = isDescriptionLong ? `${plainDescription.slice(0, 100).trim()}...` : plainDescription;

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, clientWidth } = sliderRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== currentSlide) {
        setCurrentSlide(index);
      }
    }
  };

  const scrollToSlide = (index) => {
    if (!sliderRef.current) return;
    const targetIndex = Math.max(0, Math.min(index, images.length - 1));
    sliderRef.current.scrollTo({
      left: targetIndex * sliderRef.current.clientWidth,
      behavior: 'smooth',
    });
    setCurrentSlide(targetIndex);
  };

  const handleMouseDown = (e) => {
    if (!sliderRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <div className="w-full flex flex-col transition-all gap-5 md:gap-6 even:bg-tertiary-light p-4 sm:p-6 md:p-8">
      
      <div className="flex flex-col gap-2 pb-3 ">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={`/products/${product.slug}`} className="group">
            <h2 className="text-2xl sm:text-5xl font-bold  group-hover:text-primary transition-colors font-poppins flex items-center gap-2.5">
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
              <span className="text-2xl font-extrabold text-primary">${product.price}</span>
              {product.discount > 0 && (
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative w-full aspect-video overflow-hidden  group">
          {images.length > 0 ? (
            <>
              <div
                ref={sliderRef}
                onScroll={handleScroll}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                className={`flex w-full h-full overflow-x-auto scrollbar-none touch-pan-x select-none ${
                  isMouseDown ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory scroll-smooth'
                }`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {images.map((img, index) => (
                  <div
                    key={img.id || index}
                    className="min-w-full w-full h-full shrink-0 snap-center relative"
                  >
                    <Image
                      src={img.image}
                      alt={img.title || product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 80vw"
                      className="object-cover object-center select-none pointer-events-none"
                      priority={index === 0}
                    />
                    
                  </div>
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToSlide(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentSlide === idx ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-sm text-white/90 text-[10px] px-2 py-0.5 rounded-full pointer-events-none">
                    Drag / Swipe ↔
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
              <span className="text-sm">No images available</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 ">
        <p className="text-sm sm:text-base leading-relaxed">
          {shortDescription || 'No description available for this product.'}
          {isDescriptionLong && (
            <Link
              href={`/products/${product.slug}`}
              className="ml-1.5 hover:underline text-xs font-semibold inline-flex items-center gap-0.5"
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
              <span>Features & Specifications</span>
              <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {features.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
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
                      <div className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-800">
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
                        <p className="text-xs text-slate-600 pl-6 leading-relaxed">
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
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-sm transition-colors shadow-xs"
        >
          <span>View Details</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
        {product.demo_url && (
          <a
            href={product.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary transition-colors px-3 py-2"
          >
            <span>Live Demo</span>
            <FiExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
      
    </div>
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

        <div className="w-full flex flex-col gap-8 md:gap-10">
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

