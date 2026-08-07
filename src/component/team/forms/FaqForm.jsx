'use client';

import React from 'react';
import { FiCheck, FiX, FiRefreshCw, FiHelpCircle } from 'react-icons/fi';

export default function FaqForm({
  formData,
  setFormData,
  handleSubmit,
  handleCancel,
  saving = false,
  isEditing = false
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 mb-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FiHelpCircle className="text-primary" />
          {isEditing ? 'Edit FAQ' : 'Create New FAQ'}
        </h3>
        <button
          type="button"
          onClick={handleCancel}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="Close Form"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Question <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Which tech stacks do you use for web applications?"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Answer <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={6}
            placeholder="Enter detailed answer..."
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Display Order Number
          </label>
          <input
            type="number"
            value={formData.order_num}
            onChange={(e) => setFormData({ ...formData, order_num: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="faq_is_published_inline"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
          />
          <label htmlFor="faq_is_published_inline" className="text-sm font-medium text-slate-700 cursor-pointer">
            Publish FAQ (Make visible on public website)
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4" /> {isEditing ? 'Update FAQ' : 'Save FAQ'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
