'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiCheck, FiCreditCard } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`/api/product/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
        } else {
          toast.error("Product not found");
          router.push('/products');
        }
      } catch (error) {
        console.error('Failed to fetch product', error);
        toast.error("Please login to purchase");
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
        const res = await axios.get(`/api/coupon`);
        if (res.data.success) {
            const coupon = res.data.data.find(c => c.code === couponCode.trim());
            if (coupon) {
                setCouponData(coupon);
                toast.success("Coupon applied!");
            } else {
                toast.error("Invalid or expired coupon");
                setCouponData(null);
            }
        }
    } catch (error) {
        toast.error("Failed to validate coupon");
    }
  };

  const calculateTotal = () => {
    if (!product) return 0;
    let total = parseFloat(product.price) || 0;
    if (couponData) {
        if (couponData.is_percentage) {
            let discount = (total * couponData.discount) / 100;
            if (couponData.max_discount && discount > couponData.max_discount) {
                discount = couponData.max_discount;
            }
            total -= discount;
        } else {
            total -= couponData.discount;
        }
    }
    return total < 0 ? 0 : total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
        toast.error("Transaction ID is required");
        return;
    }
    setSubmitting(true);
    try {
        const res = await axios.post('/api/purchases/create', {
            productId: product.product_id,
            couponCode: couponData?.code,
            paymentMethod,
            transactionId
        });

        if (res.data.success) {
            toast.success("Purchase request submitted successfully!");
            router.push('/user/purchases');
        } else {
            toast.error(res.data.message || "Failed to submit request");
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!product) return null;

  const finalTotal = calculateTotal();

  return (
    <div className="min-h-screen w-full py-16 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-600 font-bold mb-8 transition-colors">
          <FiArrowLeft /> Back to Product
        </Link>

        <div className="bg-white rounded-md shadow-xl shadow-slate-100 border border-slate-100 p-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Checkout</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-600">{product.name}</span>
                  <span className="font-bold text-slate-900">${product.price}</span>
                </div>
                {couponData && (
                    <div className="flex justify-between mb-2 text-emerald-600">
                      <span>Discount ({couponData.code})</span>
                      <span>-${(product.price - finalTotal).toFixed(2)}</span>
                    </div>
                )}
                <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-sky-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                    placeholder="Enter coupon"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-sky-600 transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Payment */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['bkash', 'nagad', 'rocket'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 rounded-xl font-bold border-2 transition-all ${paymentMethod === method ? 'border-sky-500 bg-sky-50 text-sky-600' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                    >
                      {method.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                  placeholder="Enter MFS Transaction ID"
                />
                <p className="text-xs text-slate-500">
                  Please send the money to our MFS number first, then enter the transaction ID here.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-sky-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-sky-100 disabled:opacity-50"
              >
                <FiCreditCard />
                {submitting ? "Submitting..." : "Confirm Purchase"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
