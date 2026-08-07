'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function DesignsPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get('/api/public/images');
      if (res.data.success && res.data.data.length > 0) {
        setImages(res.data.data);
      } else {
        fetchProductsAsFallback();
      }
    } catch {
      fetchProductsAsFallback();
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsAsFallback = async () => {
    try {
      const res = await axios.get('/api/public/product');
      if (res.data.success && Array.isArray(res.data.data)) {
        const extractedImages = [];
        res.data.data.forEach((product) => {
          if (Array.isArray(product.images) && product.images.length > 0) {
            product.images.forEach((img) => {
              extractedImages.push({
                id: img.id || Math.random(),
                title: img.title || product.name,
                image: img.image,
              });
            });
          }
        });
        setImages(extractedImages);
      }
    } catch {
      setImages([]);
    }
  };

  const openLightbox = (index) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const nextImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="min-h-screen  pb-16 px-4 sm:px-6 w-full">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Designs
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-video bg-slate-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="py-20 text-center text-slate-400 font-medium">
          No images available.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => openLightbox(idx)}
              className="relative rounded-xl overflow-hidden bg-slate-100 cursor-pointer group shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200/60"
            >
              <Image width={400} height={400}
                src={img.image}
                alt={img.title || 'Design Image'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {activeLightboxIndex !== null && images[activeLightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer z-50"
              aria-label="Close viewer"
            >
              <FiX size={24} />
            </button>

            {/* Prev Button */}
            {images.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer z-50"
                aria-label="Previous image"
              >
                <FiChevronLeft size={24} />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer z-50"
                aria-label="Next image"
              >
                <FiChevronRight size={24} />
              </button>
            )}

            {/* Main Fullscreen Image */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-5xl max-h-[85vh] flex items-center justify-center"
            >
              <img
                src={images[activeLightboxIndex].image}
                alt={images[activeLightboxIndex].title || 'Showcase Image'}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
