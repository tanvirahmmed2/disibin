'use client'
import axios from 'axios'
import React, { useState } from 'react'

const AddNewPackage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
    discount: '',
    features: '',
    category: ''
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setFormData((prev) => ({ ...prev, image: files[0] }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key])
      })
      const response = await axios.post('/api/package', data, { withCredentials: true })
      alert(response.data.message)
      setFormData({
        title: '',
        description: '',
        price: '',
        image: null,
        discount: '',
        features: '',
        category: ''
      })
    } catch (error) {
      console.log(error)
      alert(error?.response?.data?.message || "Failed to add new package")

    }
  }


  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-center gap-4'>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="title">Title</label>
        <input type="text" name='title' id='title' required value={formData.title} onChange={handleChange} className='w-full px-3 p-1 outline-none border border-emerald-600' />
      </div>
      <div className='w-full flex flex-col items-center justify-center sm:flex-row gap-4'>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="price">Price</label>
          <input type="number" min={0} name='price' id='price' required onChange={handleChange} value={formData.price} className='w-full px-3 p-1 outline-none border border-emerald-600' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="discount">Discount</label>
          <input type="number" min={0} name='discount' id='discount' onChange={handleChange} value={formData.discount} className='w-full px-3 p-1 outline-none border border-emerald-600' />
        </div>

      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="category">Category</label>
        <input type="text" name='category' id='category' value={formData.category} onChange={handleChange} className='w-full px-3 p-1 outline-none border border-emerald-600' />
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" required onChange={handleChange} value={formData.description} placeholder='write here' className='w-full px-3 p-1 outline-none border border-emerald-600'></textarea>
      </div>

      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="features">Features</label>
        <input type="text" name='features' id='features' required onChange={handleChange} value={formData.features} placeholder="use (,')" className='w-full px-3 p-1 outline-none border border-emerald-600' />
      </div>


      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="image">Image *</label>
        <input type="file" accept='image/*' required id='image' name='image' onChange={handleChange} className='w-full px-3 p-1 outline-none border border-emerald-600' />
      </div>
      <button className='p-1 w-full text-center bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer' type='submit'>Submit</button>
    </form>
  )
}

export default AddNewPackage
