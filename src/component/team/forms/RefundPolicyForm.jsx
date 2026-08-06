'use client';

import React from 'react';
import { FiCheck, FiX, FiRefreshCw, FiDollarSign } from 'react-icons/fi';

export default function RefundPolicyForm({
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
          <FiDollarSign className="text-primary" />
          {isEditing ? 'Edit Refund Policy Item' : 'Add New Refund Policy Item'}
        </h3>
        <button
          type="button"
          onClick={handleCancel}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          title="Close Form"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Refund Condition Section Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Milestone Payments & Cancellation SLA"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-style font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Display Order Number
            </label>
            <input
              type="number"
              value={formData.order_num || 0}
              onChange={(e) => setFormData({ ...formData, order_num: parseInt(e.target.value) || 0 })}
              className="input-style"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Refund Condition Content <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={8}
            placeholder="Enter refund policy details for this section..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="input-style leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="refund_policy_is_published"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="input-style cursor-pointer"
          />
          <label htmlFor="refund_policy_is_published" className="text-sm font-medium text-slate-700 cursor-pointer">
            Publish Item (Make visible on public website)
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-md disabled:opacity-50"
          >
            {saving ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4" /> {isEditing ? 'Update Item' : 'Save Item'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
