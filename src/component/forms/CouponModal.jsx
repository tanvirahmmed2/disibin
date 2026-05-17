'use client';
import React from 'react';
import { FiTag, FiX } from 'react-icons/fi';
import CouponForm from './CouponForm';

/**
 * CouponModal
 * -----------
 * A self-contained modal that wraps CouponForm for both Create and Edit flows.
 *
 * Props
 *   isOpen      — boolean, whether the modal is visible
 *   onClose     — () => void, called when the user dismisses the modal
 *   onSuccess   — (coupon) => void, called after a successful create or update
 *   initialData — coupon object (Edit mode) | null/undefined (Create mode)
 */
const CouponModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  if (!isOpen) return null;

  const title = initialData ? `Edit · ${initialData.code}` : 'Create New Coupon';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-violet-600 to-indigo-600">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiTag size={18} />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <CouponForm
            initialData={initialData}
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        </div>

      </div>
    </div>
  );
};

export default CouponModal;
