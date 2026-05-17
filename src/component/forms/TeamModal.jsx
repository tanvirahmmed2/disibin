'use client';
import React from 'react';
import { FiUser, FiX } from 'react-icons/fi';
import TeamForm from './TeamForm';

/**
 * TeamModal
 * ---------
 * Modal wrapper for TeamForm.
 */
const TeamModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  if (!isOpen) return null;

  const title = initialData ? `Edit Member · ${initialData.name}` : 'Add New Team Member';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-violet-600 to-indigo-600">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiUser size={18} />
            {title}
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <TeamForm
            initialData={initialData}
            onSuccess={(data) => {
              onSuccess?.(data);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>

      </div>
    </div>
  );
};

export default TeamModal;
