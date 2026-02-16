'use client'
import axios from 'axios'
import React, { useState } from 'react'

const AddReviewForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    rating: '',
    comment: '',
    image: null
  })

  const handleChange = (e) => {
    const { name, files, value } = e.target
    if (files) {
      setFormData((prev) => ({ ...prev, image: files[0] }))
    }
    else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data= new FormData()
      Object.keys(formData).forEach((key)=>{
        data.append(key, formData[key])
      })
      const response= await axios.post('/api/review', data, {withCredentials:true})
      alert(response.data.message)
    } catch (error) {
      console.log(error)

    }

  }
  return (
    <form onSubmit={handleSubmit} className='w-full max-w-3xl mx-auto flex flex-col items-center gap-3 '>
      <h1 className='text-2xl font-semibold text-emerald-500'>Add Review</h1>
      <div className='w-full  flex flex-col gap-1'>
        <label htmlFor="name">Name</label>
        <input type="text" id='name' name='name' required onChange={handleChange} value={formData.name}  className='w-full px-3 p-1 border border-emerald-500 outline-none'/>
      </div>
      <div className='w-full  flex flex-col gap-1'>
        <label htmlFor="comment">Comment</label>
        <textarea name="comment" id="comment" required onChange={handleChange} value={formData.comment} className='w-full px-3 p-1 border border-emerald-500 outline-none'></textarea>
      </div>
      <div className='w-full  flex flex-col gap-1'>
        <label htmlFor="rating" className='w-full flex flex-row items-center justify-between'>Rating <span className='text-xl font-extrabold text-emerald-500'>{formData.rating}</span></label>
        <input type="range" name="rating" id="rating" step={0.5} min={0} required max={5} onChange={handleChange} value={formData.rating}  className='w-full  px-3 p-1 border border-emerald-500 outline-none'/>
      </div>
      <div className='w-full  flex flex-col gap-1'>
        <label htmlFor="image">User Image</label>
        <input type="file" name="image" id="image" accept='image/*' required onChange={handleChange}  className='w-full px-3 p-1 border border-emerald-500 outline-none'/>
      </div>
      <button type='submit' className='w-full bg-emerald-600 text-white p-1 cursor-pointer hover:bg-emerald-400'>Submit</button>
    </form>
  )
}

export default AddReviewForm
