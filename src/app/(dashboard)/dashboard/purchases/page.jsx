'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([])

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('/api/purchase', { withCredentials: true })
      setPurchases(res.data.payload || [])
      console.log(res)
    } catch (error) {
      console.log(error)
      setPurchases({})

    }
  }

  useEffect(() => { fetchPurchases() }, [])
 
  return (
    <div className='w-full flex flex-col items-center gap-4 p-1 sm:p-4'>
      <h1 className='text-2xl font-semibold w-full border-b-2 py-5'>Puchases</h1>
      {
        purchases.length > 0 ? <div className='w-full flex flex-col items-center gap-2'>

        </div> : <div>
          <p>No purchase data found</p>
        </div>
      }

    </div>
  )
}

export default PurchasesPage
