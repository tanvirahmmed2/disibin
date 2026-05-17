'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';

const defaultForm = {
  code: '',
  discount: '',
  is_percentage: true,
  max_discount: '',
  usage_limit: '',
  start_date: '',
  end_date: '',
  status: 'active',
  product_id: '',
};

const CouponForm = ({ initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    ...defaultForm,
    ...(initialData
      ? {
          ...initialData,
          start_date: initialData.start_date
            ? new Date(initialData.start_date).toISOString().slice(0, 16)
            : '',
          end_date: initialData.end_date
            ? new Date(initialData.end_date).toISOString().slice(0, 16)
            : '',
          max_discount: initialData.max_discount ?? '',
          usage_limit: initialData.usage_limit ?? '',
          product_id: initialData.product_id ?? '',
        }
      : {}),
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get('/api/product?all=true')
      .then((r) => r.data.success && setProducts(r.data.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      code: formData.code.trim().toUpperCase(),
      discount: parseFloat(formData.discount),
      is_percentage: formData.is_percentage,
      max_discount: formData.max_discount !== '' ? parseFloat(formData.max_discount) : null,
      usage_limit: formData.usage_limit !== '' ? parseInt(formData.usage_limit, 10) : 0,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      status: formData.status,
      product_id: formData.product_id !== '' ? parseInt(formData.product_id, 10) : null,
    };

    try {
      let res;
      if (initialData) {
        res = await axios.patch('/api/coupon', {
          couponId: initialData.coupon_id,
          ...payload,
        });
      } else {
        res = await axios.post('/api/coupon', payload);
      }

      if (res.data.success) {
        toast.success(res.data.message);
        onSuccess?.(res.data.data);
      } else {
        toast.error(res.data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, children) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all bg-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field(
          'Coupon Code *',
          <input
            type="text"
            name="code"
            required
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g. SAVE20"
            className={inputCls}
            style={{ textTransform: 'uppercase' }}
          />
        )}

        {field(
          'Discount Value *',
          <input
            type="number"
            name="discount"
            required
            min="0"
            step="0.01"
            value={formData.discount}
            onChange={handleChange}
            placeholder={formData.is_percentage ? '20' : '5.00'}
            className={inputCls}
          />
        )}

        {field(
          'Discount Type',
          <div className="flex items-center gap-4 h-10">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  formData.is_percentage
                    ? 'bg-violet-600 border-violet-600'
                    : 'border-slate-300'
                }`}
              >
                {formData.is_percentage && <FiCheck className="text-white" size={12} />}
              </div>
              <input
                type="checkbox"
                name="is_percentage"
                checked={formData.is_percentage}
                onChange={handleChange}
                className="hidden"
              />
              <span className="text-sm font-semibold text-slate-700">Percentage (%)</span>
            </label>
            <span className="text-slate-400 text-xs">
              {formData.is_percentage ? '% off' : 'Flat amount'}
            </span>
          </div>
        )}

        {field(
          'Max Discount Cap ($)',
          <input
            type="number"
            name="max_discount"
            min="0"
            step="0.01"
            value={formData.max_discount}
            onChange={handleChange}
            placeholder="Leave blank for unlimited"
            className={inputCls}
          />
        )}

        {field(
          'Usage Limit',
          <input
            type="number"
            name="usage_limit"
            min="0"
            value={formData.usage_limit}
            onChange={handleChange}
            placeholder="0 = unlimited"
            className={inputCls}
          />
        )}

        {field(
          'Status',
          <select name="status" value={formData.status} onChange={handleChange} className={inputCls}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        )}

        {field(
          'Start Date',
          <input
            type="datetime-local"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className={inputCls}
          />
        )}

        {field(
          'End Date',
          <input
            type="datetime-local"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className={inputCls}
          />
        )}
      </div>

      {field(
        'Linked Product (optional)',
        <select name="product_id" value={formData.product_id} onChange={handleChange} className={inputCls}>
          <option value="">— All Products —</option>
          {products.map((p) => (
            <option key={p.product_id} value={p.product_id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            <FiX size={14} /> Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-all disabled:opacity-50 shadow-lg shadow-violet-200"
        >
          <FiCheck size={14} />
          {loading ? 'Saving...' : initialData ? 'Update Coupon' : 'Create Coupon'}
        </button>
      </div>
    </form>
  );
};

export default CouponForm;
