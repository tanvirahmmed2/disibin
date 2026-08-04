'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiEye, FiEyeOff, FiStar } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPrimaryImage = (images) => {
    if (!images || images.length === 0) return null;
    return images.find(i => i.is_primary)?.image || images[0]?.image || null;
  };

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-center" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiPackage className="text-sky-500" /> Product Management
          </h1>
          <p className="text-slate-500 text-sm">Manage your platform products and offerings</p>
        </div>
        <Link
          href="/team/products/new"
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-slate-200"
        >
          <FiPlus /> Create Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <FiSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name or slug..."
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Images</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400">
                    {searchTerm ? 'No products match your search.' : 'No products yet. Create your first product!'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const primaryImage = getPrimaryImage(product.images);
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
                          <div>
                            <div className="font-bold text-slate-900">{product.name}</div>
                            <div className="text-xs text-slate-400 font-mono">{product.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">
                          {product.images?.length || 0} image{product.images?.length !== 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold w-fit ${
                            product.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {product.is_published ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                            {product.is_published ? 'Published' : 'Draft'}
                          </span>
                          {product.is_featured && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 w-fit">
                              <FiStar size={12} /> Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/team/products/${product.slug}`}
                          className="inline-block p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all"
                          title="Edit product"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.slug, product.name)}
                          disabled={deleting === product.slug}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-40"
                          title="Delete product"
                        >
                          <FiTrash2 size={18} />
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
