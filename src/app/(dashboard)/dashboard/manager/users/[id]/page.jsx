'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { RiUserLine, RiMapPinLine, RiShoppingCart2Line, RiShieldFlashLine, RiArrowLeftLine } from 'react-icons/ri'

const UserProfileDetails = () => {
    const params = useParams()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/api/user/${params.id}`, { withCredentials: true })
                if (res.data.success) {
                    setUser(res.data.data)
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to fetch user details')
                router.push('/dashboard/manager/users')
            } finally {
                setLoading(false)
            }
        }
        if (params.id) fetchUser()
    }, [params.id, router])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    )

    if (!user) return null

    return (
        <div className="max-w-7xl mx-auto py-8">
            <button 
                onClick={() => router.push('/dashboard/manager/users')}
                className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-semibold mb-8 transition-colors"
            >
                <RiArrowLeftLine /> Back to Users
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <RiUserLine size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                        <p className="text-slate-500 font-medium mb-4">{user.email}</p>
                        <div className="inline-block px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                            Role: {user.role}
                        </div>
                        <div className={`mt-2 inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${user.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <RiMapPinLine className="text-emerald-500" /> Contact & Location
                        </h3>
                        <div className="text-sm font-medium text-slate-600 space-y-2">
                            <p><strong className="text-slate-900">Phone:</strong> {user.phone || 'N/A'}</p>
                            <p><strong className="text-slate-900">Address 1:</strong> {user.address_line1 || 'N/A'}</p>
                            <p><strong className="text-slate-900">Address 2:</strong> {user.address_line2 || 'N/A'}</p>
                            <p><strong className="text-slate-900">City:</strong> {user.city || 'N/A'}</p>
                            <p><strong className="text-slate-900">State:</strong> {user.state || 'N/A'}</p>
                            <p><strong className="text-slate-900">Country:</strong> {user.country || 'N/A'}</p>
                            <p><strong className="text-slate-900">Postal:</strong> {user.postal_code || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Subscriptions & Purchases */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                            <RiShieldFlashLine className="text-emerald-500" size={20} />
                            <h3 className="font-bold text-slate-900">Active Subscriptions</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {user.subscriptions?.length === 0 ? (
                                <p className="text-slate-500 font-medium">No subscriptions found.</p>
                            ) : (
                                user.subscriptions.map((sub) => (
                                    <div key={sub.subscription_id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{sub.package_name}</h4>
                                            <p className="text-xs text-slate-500 font-medium mt-1">Tenant: {sub.tenant_name || 'Pending'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{sub.status}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-1">Expires: {new Date(sub.current_period_end).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                            <RiShoppingCart2Line className="text-emerald-500" size={20} />
                            <h3 className="font-bold text-slate-900">Purchase History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400">
                                        <th className="p-6 font-bold">Package</th>
                                        <th className="p-6 font-bold">Amount</th>
                                        <th className="p-6 font-bold">Status</th>
                                        <th className="p-6 font-bold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-600">
                                    {user.purchases?.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-6 text-center">No purchases found.</td>
                                        </tr>
                                    ) : (
                                        user.purchases.map((purchase) => (
                                            <tr key={purchase.purchase_id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-6">{purchase.package_name} <span className="text-xs text-slate-400">x{purchase.quantity || 1}</span></td>
                                                <td className="p-6">BDT {purchase.amount}</td>
                                                <td className="p-6">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${purchase.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                        {purchase.status}
                                                    </span>
                                                </td>
                                                <td className="p-6">{new Date(purchase.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileDetails
