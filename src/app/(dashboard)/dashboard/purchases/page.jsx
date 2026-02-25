'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaCalendarAlt, FaCreditCard, FaExternalLinkAlt, FaHourglassHalf, FaRegCheckCircle, FaTimes, FaTrashAlt, FaBan, FaCheckDouble } from 'react-icons/fa'

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([])
  const [manageBox, setManageBox] = useState(false)
  const [purchaseId, setPurchaseId] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [paymentData, setPaymentData] = useState({
    transaction_id: '',
    payment_method: 'bkash', // Default value
  })

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('/api/purchase', { withCredentials: true })
      setPurchases(res.data.payload || [])
    } catch (error) {
      console.error(error)
      setPurchases([])
    }
  }

  useEffect(() => { fetchPurchases() }, [])

  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleManageBox = (id, status) => {
    if (!manageBox) {
      setPurchaseId(id)
      setPaymentStatus(status)
      setManageBox(true)
    } else {
      setPurchaseId(null)
      setPaymentStatus(null)
      setManageBox(false)
    }
  }

  const deletePurchase = async () => {
    if (!confirm("Are you sure you want to delete this record?")) return
    try {
      const res = await axios.delete('/api/purchase', { data: { purchase_id: purchaseId }, withCredentials: true })
      alert(res.data.message)
      setManageBox(false)
      fetchPurchases()
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete purchase')
    }
  }

  const changeStatus = async (status) => {
    try {
      const res = await axios.post('/api/purchase/status', { status, purchase_id: purchaseId }, { withCredentials: true })
      alert(res.data.message)
      setManageBox(false)
      fetchPurchases()
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to change status')
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    const data = {
      purchase_id: purchaseId,
      payment_method: paymentData.payment_method,
      transaction_id: paymentData.transaction_id
    }
    try {
      const res = await axios.patch('/api/purchase', data, { withCredentials: true })
      alert(res.data.message)
      setManageBox(false)
      fetchPurchases()
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to update payment')
    }
  }

  return (
    <div className='w-full flex flex-col items-center gap-4 p-1 sm:p-4 relative bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold w-full border-b bg-white p-6 rounded-t-xl'>Order Management</h1>
      
      {purchases.length > 0 ? (
        <div className="w-full flex flex-col items-center gap-4">
          {purchases.map((item) => (
            <div key={item.purchase_id} className="group w-full flex flex-col md:flex-row shadow-sm bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-sky-300 transition-colors">
              
              <div className="md:w-64 p-6 flex flex-col justify-center items-center bg-slate-800 text-white text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-2xl mb-3 shadow-inner">
                  {item.customer_name?.charAt(0) || 'U'}
                </div>
                <h4 className="text-sm font-bold truncate w-full">{item.customer_name}</h4>
                <p className="text-[10px] text-slate-400 truncate w-full mb-3">{item.customer_email}</p>
                <span className="px-3 py-1 bg-slate-700 text-[10px] font-mono rounded-md">ID: {item.purchase_id}</span>
              </div>

              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
                      {item.items?.[0]?.package_title}
                      {item.items?.length > 1 && <span className="text-sky-500 ml-2">+{item.items.length - 1} more</span>}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 italic">Ordered on {new Date(item.order_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">৳{item.payable_amount}</p>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase mt-1 px-3 py-1 rounded-full ${
                      item.purchase_status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.purchase_status === 'active' ? <FaRegCheckCircle /> : <FaHourglassHalf />}
                      {item.purchase_status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Payment Status</p>
                    <p className="text-xs text-slate-700 font-medium capitalize">{item.payment_status || 'Unpaid'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Transaction ID</p>
                    <p className="text-xs text-slate-700 font-mono font-medium truncate">{item.transaction_id || 'N/A'}</p>
                  </div>
                  <div className="flex items-end justify-end">
                    <button onClick={() => handleManageBox(item.purchase_id, item.payment_status)} className="flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-white hover:bg-sky-600 border border-sky-600 px-4 py-2 rounded-lg transition-all">
                      Manage Order <FaExternalLinkAlt className="text-[10px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-slate-400">No purchase data found</div>
      )}

      {/* Management Modal */}
      {manageBox && (
        <div className='fixed z-50 inset-0 flex items-center justify-center p-4'>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setManageBox(false)}></div>
          
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800 text-lg">Manage Purchase #{purchaseId}</h2>
              <button onClick={() => setManageBox(false)} className="text-slate-400 hover:text-slate-600"><FaTimes /></button>
            </div>

            <div className="p-6 space-y-6">
              {paymentStatus === 'pending' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4 bg-sky-50 p-4 rounded-xl border border-sky-100">
                  <p className="text-xs font-bold text-sky-700 uppercase">Update Payment Details</p>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Method</label>
                    <select name="payment_method" className="w-full p-2 border rounded-lg text-sm" required onChange={handlePaymentDataChange} value={paymentData.payment_method}>
                      <option value="bkash">Bkash</option>
                      <option value="nagad">Nagad</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Transaction ID</label>
                    <input type="text" name='transaction_id' className="w-full p-2 border rounded-lg text-sm" required onChange={handlePaymentDataChange} placeholder="Enter TXN ID" />
                  </div>
                  <button type='submit' className="w-full bg-sky-600 text-white py-2 rounded-lg text-sm font-bold shadow-md hover:bg-sky-700 transition-colors">Verify Payment</button>
                </form>
              )}

              <div className="grid grid-cols-2 gap-3">
                {paymentStatus === 'completed' ? (
                  <>
                    <button onClick={() => changeStatus('active')} className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">
                      <FaCheckDouble /> Activate
                    </button>
                    <button onClick={() => changeStatus('cancelled')} className="flex items-center justify-center gap-2 bg-amber-500 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors">
                      <FaBan /> Refund/Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => changeStatus('cancelled')} className="flex items-center justify-center gap-2 bg-slate-200 text-slate-700 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors">
                    <FaBan /> Cancel Purchase
                  </button>
                )}
                
                <button onClick={deletePurchase} className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 py-2.5 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white transition-all">
                  <FaTrashAlt /> Delete Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchasesPage