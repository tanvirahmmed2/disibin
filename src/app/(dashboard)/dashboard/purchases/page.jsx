'use client'
import axios from 'axios'
import React, { useState } from 'react'

const PurchasesPage = () => {
  const [purchases, setPurchases]=useState([])

  const fetchPurchases= async()=>{
    try {
      const res= await axios.get('/api/purchase')
    } catch (error) {
      console.log(error)
      setPurchases({})
      
    }
  }
  return (
    <div>
      
    </div>
  )
}

export default PurchasesPage
