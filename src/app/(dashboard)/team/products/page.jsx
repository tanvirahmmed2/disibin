'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage,
  FiEye, FiEyeOff, FiStar, FiTag, FiExternalLink, FiLoader, FiDollarSign
} from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

const ProductsManagement = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/team/product');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    setCreating(true);
    try {
      const res = await axios.post('/api/team/product', {
        name: 'enter title',
        price: 0,
        discount: 0,
        is_published: false,
        is_featured: false,
      });

      if (res.data.success && res.data.data?.slug) {
        toast.success('Demo draft product created');
        router.push(`/team/products/${res.data.data.slug}`);
      } else {
        toast.error(res.data.message || 'Failed to create product');
        setCreating(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
      setCreating(false);
    }
  };

  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will also delete all product images.`)) return;

    setDeleting(slug);
    try {
      const res = await axios.delete(`/api/team/product/${slug}`);
      if (res.data.success) {
        toast.success('Product deleted successfully');
        setProducts(products.filter(p => p.slug !== slug));
      } else {
        toast.error(res.data.message || 'Failed to delete product');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'published') return p.is_published;
    if (statusFilter === 'draft') return !p.is_published;
    if (statusFilter === 'featured') return p.is_featured;
    return true;
  });

  const getPrimaryImage = (images) => {
    if (!images || images.length === 0) return null;
    return images.find(i => i.is_primary)?.image || images[0]?.image || null;
  };

  return (
    <div className="p-6 w-full space-y-6">
      <Toaster position="top-center" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiPackage className="text-sky-500" /> Product Management
          </h1>
          <p className="text-slate-500 text-sm">Manage your platform products and feature offerings</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/team/products/features"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all text-sm shadow-sm"
          >
            <FiTag className="text-sky-500" /> Manage Features
          </Link>
          <button
            onClick={handleCreateProduct}
            disabled={creating}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-slate-200 text-sm disabled:opacity-50"
          >
            {creating ? <FiLoader className="animate-spin" size={16} /> : <FiPlus size={16} />}
            {creating ? 'Creating Draft...' : 'Create Product'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-0">
        {/* Search and Filters Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 w-full sm:w-80 shadow-sm">
            <FiSearch className="text-slate-400 shrink-0" size={16} />
            <input
              type="text"
              placeholder="Search products by name or slug..."
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'published', label: 'Published' },
              { id: 'draft', label: 'Drafts' },
              { id: 'featured', label: 'Featured' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price ($)</th>
                <th className="px-6 py-4">Features</th>
                <th className="px-6 py-4">Images</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    {searchTerm || statusFilter !== 'all' ? 'No products match your filter criteria.' : 'No products yet. Create your first product!'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const primaryImage = getPrimaryImage(product.images);
                  const price = Number(product.price) || 0;
                  const discount = Number(product.discount) || 0;
                  const finalPrice = Math.max(0, price - discount);

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              <FiPackage className="text-slate-400" size={20} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              {product.name}
                              {product.demo_url && (
                                <a
                                  href={product.demo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-400 hover:text-sky-500 transition-colors"
                                  title="View Demo"
                                >
                                  <FiExternalLink size={14} />
                                </a>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">{product.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          ${finalPrice}
                          {discount > 0 && (
                            <span className="ml-1.5 text-xs text-slate-400 line-through">
                              ${price}
                            </span>
                          )}
                        </div>
                        {discount > 0 && (
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            -${discount} off
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700">
                          <FiTag size={11} />
                          {product.features?.length || 0} feature{product.features?.length !== 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">
                          {product.images?.length || 0} image{product.images?.length !== 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            product.is_published ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {product.is_published ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                            {product.is_published ? 'Published' : 'Draft'}
                          </span>
                          {product.is_featured && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                              <FiStar size={12} /> Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right space-x-1">
                        <Link
                          href={`/team/products/${product.slug}`}
                          className="inline-block p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all"
                          title="Edit product"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.slug, product.name)}
                          disabled={deleting === product.slug}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-40"
                          title="Delete product"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement;
