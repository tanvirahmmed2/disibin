'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { RiCheckLine, RiStarFill, RiCloseLine, RiInformationLine, RiShieldFlashLine } from 'react-icons/ri'

const Memberships = () => {
  const { userData, addToWishList } = useContext(Context)
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [purchaseForm, setPurchaseForm] = useState({
      payMethod: 'bkash',
      transactionId: ''
  })

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await axios.get('/api/membership')
        if (res.data.success) {
           setMemberships(res.data.data)
        }
      } catch (error) {
        
      } finally {
        setLoading(false)
      }
    }
    fetchMemberships()
  }, [])

  const handlePurchase = async (e) => {
      e.preventDefault()
      if (!userData?._id) return alert('Please login first');
      setPurchaseLoading(true)
      try {
          const purchaseData = {
              userId: userData._id,
              totalAmount: selectedPlan.price - (selectedPlan.discount || 0),
              items: [{
                  itemId: selectedPlan._id,
                  type: 'membership',
                  title: selectedPlan.title,
                  price: selectedPlan.price
              }],
              paymentMethod: purchaseForm.payMethod
          }
          const res = await axios.post('/api/purchase', purchaseData, { withCredentials: true })
          if (res.data.success) {
              
              await axios.post('/api/payment', {
                  userId: userData._id,
                  purchaseId: res.data.data._id,
                  amount: purchaseData.totalAmount,
                  paymentMethod: purchaseForm.payMethod,
                  transactionId: purchaseForm.transactionId
              }, { withCredentials: true })

              alert('Membership activated! Please check your dashboard.')
              setSelectedPlan(null)
          }
      } catch (error) {
          alert(error.response?.data?.message || 'Failed to complete purchase.')
      } finally {
          setPurchaseLoading(false)
      }
  }

  if (loading) return (
      <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="w-12 h-12 border-4 border-slate-50 border-t-primary rounded-full animate-spin"></div>
      </div>
  )

  return (
    <div className='w-full min-h-screen bg-white py-24'>
      <div className="container-custom">
        <div className="text-center mb-20 space-y-4">
          <span className="text-primary font-black tracking-[0.2em] uppercase text-[10px] block">Exclusive Access</span>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Premium Memberships</h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">Elevate your digital presence with our top-tier tailored solutions for professionals.</p>
        </div>

        {memberships.length === 0 ? (
          <div className="card-premium p-20 text-center max-w-2xl mx-auto flex flex-col items-center gap-8 border-none bg-slate-50/50">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
               <RiStarFill size={32} />
            </div>
            <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Coming Soon</h3>
                <p className="text-slate-500 font-medium">We are crafting the perfect premium plans for you.</p>
            </div>
            <Link href="/services" className="btn-primary">
              Explore Services
            </Link>
          </div>
        ) : (
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto'>
            {memberships.map((plan, idx) => (
              <div 
                key={plan._id} 
                className={`card-premium relative flex flex-col ${idx === 1 ? 'border-primary/20 shadow-2xl scale-105 z-10' : 'border-slate-50'}`}
              >
                {idx === 1 && (
                  <div className="bg-primary text-white text-[10px] font-black text-center py-2 uppercase tracking-widest rounded-t-[2.5rem]">
                    Most Popular
                  </div>
                )}
                
                <div className="p-10 space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">{plan.title}</h3>
                    <p className="text-slate-500 text-xs font-medium line-clamp-2">{plan.description}</p>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">${plan.price}</span>
                    <span className="text-slate-400 font-bold text-xs">/{plan.duration}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full py-4 rounded-2xl text-center font-black text-[10px] tracking-widest uppercase transition-all ${
                        idx === 1 
                        ? 'bg-primary text-white hover:bg-slate-900 shadow-lg shadow-primary/20' 
                        : 'bg-slate-900 text-white hover:bg-primary'
                      }`}
                    >
                      Instant Purchase
                    </button>
                    <button 
                      onClick={() => addToWishList({
                        itemId: plan._id,
                        type: 'membership',
                        title: plan.title,
                        price: plan.price,
                        slug: plan.title.toLowerCase().replace(/ /g, '-'), 
                        image: null
                      })}
                      className="w-full py-4 rounded-2xl text-center font-black text-[10px] tracking-widest uppercase transition-all bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      Add to Wishlist
                    </button>
                  </div>
                </div>
                
                <div className="p-10 pt-0 flex-1 space-y-4 border-t border-slate-50 mt-auto">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8 mb-4">Core Features</div>
                   {plan.features?.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0 text-primary">
                          <RiCheckLine size={12} />
                        </div>
                        <span className="text-slate-600 text-xs font-bold">{feature}</span>
                      </div>
                   ))}
                </div>
                <Link href={`/memberships/${plan.slug}`}>View</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPlan && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
              <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="p-10 flex justify-between items-center border-b border-slate-50">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Checkout</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{selectedPlan.title} Plan</p>
                    </div>
                    <button onClick={() => setSelectedPlan(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-all">
                        <RiCloseLine size={24} />
                    </button>
                  </div>
                  
                  <form onSubmit={handlePurchase} className="p-10 space-y-8">
                      <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex justify-between items-center">
                          <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Payable Amount</span>
                              <span className="text-4xl font-black text-slate-900">${selectedPlan.price - (selectedPlan.discount || 0)}</span>
                          </div>
                          <div className="w-14 h-14 bg-primary text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-primary/20">
                              <RiShieldFlashLine size={28} />
                          </div>
                      </div>

                      <div className="space-y-6">
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 ml-1">Payment Method</label>
                              <select 
                                value={purchaseForm.payMethod}
                                onChange={(e) => setPurchaseForm({ ...purchaseForm, payMethod: e.target.value })}
                                className="input-standard appearance-none cursor-pointer"
                              >
                                  <option value="bkash">bKash (Manual)</option>
                                  <option value="nagad">Nagad (Manual)</option>
                                  <option value="bank">Bank Transfer</option>
                              </select>
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 ml-1">Transaction ID</label>
                              <input 
                                required
                                type="text"
                                value={purchaseForm.transactionId}
                                onChange={(e) => setPurchaseForm({ ...purchaseForm, transactionId: e.target.value })}
                                className="input-standard"
                              />
                          </div>
                      </div>

                      <div className="flex gap-4 p-5 bg-white rounded-2xl text-white border border-white">
                          <RiInformationLine size={20} className="mt-0.5 shrink-0" />
                          <p className="text-[10px] font-bold leading-relaxed uppercase tracking-wide">
                            Manual verification required. Please complete the payment and provide your TXID above.
                          </p>
                      </div>

                      <button 
                         disabled={purchaseLoading}
                         type="submit"
                         className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 uppercase shadow-xl shadow-slate-900/10"
                      >
                          {purchaseLoading ? 'Processing...' : 'Complete Payment'}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  )
}

export default Memberships

