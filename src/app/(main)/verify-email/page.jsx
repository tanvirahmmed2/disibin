'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi'

const VerifyEmailContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('verifying') // verifying, success, error

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error')
        return
      }

      try {
        const res = await fetch('/api/user/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        const data = await res.json()

        if (data.success) {
          setStatus('success')
          toast.success(data.message)
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setStatus('error')
          toast.error(data.message)
        }
      } catch (error) {
        setStatus('error')
        toast.error('Something went wrong')
      }
    }

    verifyToken()
  }, [token, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-20 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50 text-center">
        {status === 'verifying' && (
          <>
            <FiLoader className="w-16 h-16 text-sky-500 animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifying Email...</h1>
            <p className="text-slate-500">Please wait while we verify your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FiCheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h1>
            <p className="text-slate-500 mb-8">Your account has been successfully activated. Redirecting you to login...</p>
            <Link href="/login" className="inline-block w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all duration-300">
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h1>
            <p className="text-slate-500 mb-8">The link is invalid or has expired. Please try registering again or contact support.</p>
            <Link href="/register" className="inline-block w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-sky-600 transition-all duration-300">
              Back to Register
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[80vh]">
        <FiLoader className="w-12 h-12 text-sky-500 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

export default VerifyEmailPage
