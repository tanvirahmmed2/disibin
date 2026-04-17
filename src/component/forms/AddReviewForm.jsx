'use client'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Context } from '../helper/Context'

const AddReviewForm = () => {
  const {userData}= useContext(Context)
  const [formData, setFormData] = useState({
    name: userData.name || '',
    email: userData.email ||  '',
    company_name: '', 
    rating: '5',
    comment: '',
    image: null
  })

  const handleChange = (e) => {
    const { name, files, value } = e.target
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
      const response = await axios.post('/api/review', data)
      alert(response.data.message)
      setFormData({
        name: '',
        email: '',
        company_name: '',
        rating: '5',
        comment: '',
        image: null
      })
      e.target.reset(); 
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto flex flex-col items-center gap-3 p-4'>
      <h1 className='text-2xl font-light text-primary'>Add Review</h1>
      
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="name">Full Name</label>
        <input type="text" id='name' name='name' required onChange={handleChange} value={formData.name} className='w-full px-3 p-1 border border-primary outline-none' />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="email">Email Address</label>
        <input type="email" id='email' name='email' required onChange={handleChange} value={formData.email} className='w-full px-3 p-1 border border-primary outline-none' />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="company_name">Company Name (Optional)</label>
        <input type="text" id='company_name' name='company_name' onChange={handleChange} value={formData.company_name} className='w-full px-3 p-1 border border-primary outline-none' />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="comment">Comment</label>
        <textarea name="comment" id="comment" required onChange={handleChange} value={formData.comment} className='w-full px-3 p-1 border border-primary outline-none h-24'></textarea>
      </div>

      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="rating" className='w-full flex flex-row items-center justify-between text-sm'>
          Rating <span className='text-xl font-extrabold text-primary'>{formData.rating} Stars</span>
        </label>
        <input type="range" name="rating" id="rating" step={0.5} min={0} max={5} onChange={handleChange} value={formData.rating} className='w-full cursor-pointer' />
      </div>

      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="image">Your Profile Photo</label>
        <input type="file" name="image" id="image" accept='image/*' required onChange={handleChange} className='w-full px-3 p-1 border border-primary outline-none' />
      </div>

      <button type='submit' className='w-full bg-primary-dark text-white p-2 mt-2 font-bold hover:bg-primary transition-colors'>
        Submit Review
      </button>
    </form>
  )
}

export default AddReviewForm
