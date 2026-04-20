'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import {
  RiCheckLine,
  RiStarFill,
  RiCloseLine,
  RiInformationLine,
  RiShieldFlashLine
} from 'react-icons/ri'
import Image from 'next/image'
import { BiRightArrow } from 'react-icons/bi'

const Memberships = () => {
  const { userData } = useContext(Context)

  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedPlan, setSelectedPlan] = useState(null)
  const [purchaseLoading, setPurchaseLoading] = useState(false)

  const [form, setForm] = useState({
    payMethod: 'bkash',
    transactionId: ''
  })

  // 📦 Fetch memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await axios.get('/api/membership')
        if (res.data.success) {
          setMemberships(res.data.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchMemberships()
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()

    if (!userData?._id) {
      alert('Please login first')
      return
    }

    if (!selectedPlan) return

    setPurchaseLoading(true)

    try {
      const res = await axios.post(
        '/api/subscription',
        {
          membershipId: selectedPlan._id,
          payMethod: form.payMethod,
          transactionId: form.transactionId
        },
        { withCredentials: true }
      )

      if (res.data.success) {
        alert('Subscription request sent successfully!')
        setSelectedPlan(null)
        setForm({ payMethod: 'bkash', transactionId: '' })
      }

    } catch (error) {
      alert(error?.response?.data?.message || 'Subscription failed')
    } finally {
      setPurchaseLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-white py-10">

      <div className="text-center mb-10">
        <h1 className="text-5xl font-black text-slate-900">
          Premium Memberships
        </h1>
        <p className="text-slate-500 mt-3">
          Unlock exclusive features with subscription
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {memberships.map((plan, idx) => (
          <div
            key={plan._id}
            className={`border rounded-3xl p-6 shadow-lg flex flex-col ${
              idx === 1 ? 'border-emerald-500 scale-105' : 'border-slate-100'
            }`}
          >

            <Image
              src={plan.image}
              width={500}
              height={300}
              alt={plan.title}
              className="rounded-2xl mb-4"
            />

            <h2 className="text-2xl font-black">{plan.title}</h2>

            <p className="text-slate-500 text-sm mt-2">
              {plan.description}
            </p>

            <div className="text-3xl font-black mt-4">
              ${plan.price}
            </div>

            <div className="mt-6 space-y-2 flex-1">
              {plan.features?.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <RiCheckLine className="text-emerald-500" />
                  {f}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedPlan(plan)}
              className="mt-6 bg-emerald-500 text-white py-3 rounded-2xl font-bold"
            >
              Subscribe Now
            </button>

          </div>
        ))}

      </div>

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-md rounded-3xl p-6">

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black">
                {selectedPlan.title}
              </h2>

              <button onClick={() => setSelectedPlan(null)}>
                <RiCloseLine size={24} />
              </button>
            </div>

            <div className="mt-4 p-4 bg-slate-50 rounded-2xl flex justify-between">
              <span>Total</span>
              <span className="font-black">
                ${selectedPlan.price}
              </span>
            </div>

            <form onSubmit={handleSubscribe} className="mt-6 space-y-4">

              <select
                value={form.payMethod}
                onChange={(e) =>
                  setForm({ ...form, payMethod: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              >
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="bank">Bank</option>
              </select>

              <input
                type="text"
                required
                placeholder="Transaction ID"
                value={form.transactionId}
                onChange={(e) =>
                  setForm({ ...form, transactionId: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              />

              <div className="text-xs text-slate-500 flex gap-2 items-start">
                <RiInformationLine />
                Manual payment verification required
              </div>

              <button
                disabled={purchaseLoading}
                type="submit"
                className="w-full bg-emerald-500 text-white py-3 rounded-2xl font-bold"
              >
                {purchaseLoading ? 'Processing...' : 'Confirm Subscription'}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Memberships