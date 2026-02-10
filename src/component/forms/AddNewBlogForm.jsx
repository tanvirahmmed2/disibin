'use client'
import axios from 'axios'
import React, { useState } from 'react'

const AddNewBlogForm = () => {

  const [formData,setFormData]= useState({
    title:'',
    description:'',
    image:null,
    preview:'',
    tags:''
  })

  const handleChange=(e)=>{
    const {name, value, files}= e.target
    if(files){
      setFormData((prev)=>({...prev, image: files[0]}))
    }else{
      setFormData((prev)=>({...prev,[name]:value}))
    }
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      const data= new FormData()
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key])
      })
      const response= await axios.post('/api/blog', data, {withCredentials:true})
      alert(response.data.message)
    } catch (error) {
      console.log(error)
      alert(error?.response?.data?.message || "Failed to add blog")
      
    }
  }
  return (
   <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-2'>
    <div className='w-full flex flex-col gap-1'>
      <label htmlFor="title">Title</label>
      <input type="text" name='title' id='title' onChange={handleChange} value={formData.title} required className='w-full px-3 p-1 outline-none border border-emerald-600'  />
    </div>
    <div className='w-full flex flex-col gap-1'>
      <label htmlFor="description">Description</label>
      <textarea type="text" name='description' id='description' required onChange={handleChange} value={formData.description} className='w-full px-3 p-1 outline-none border border-emerald-600'  />
    </div>
    <div className='w-full flex flex-col gap-1'>
      <label htmlFor="tags">Tags</label>
      <input type="text" id='tags' name='tags' required value={formData.tags} onChange={handleChange} className='w-full px-3 p-1 outline-none border border-emerald-600' />
    </div>
    <div className='w-full flex flex-col gap-1'>
      <label htmlFor="preview">Preview</label>
      <input type="text" name='preview' id='preview' onChange={handleChange} value={formData.preview} className='w-full px-3 p-1 outline-none border border-emerald-600'  />
    </div>
    <div className='w-full flex flex-col gap-1'>
      <label htmlFor="image">Image</label>
      <input type="file" accept='image/*' name='image' id='image' required onChange={handleChange} className='w-full px-3 p-1 outline-none border border-emerald-600' />
    </div>
    <button className='p-1 w-full text-center bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer' type='submit'>Submit</button>
   </form>
  )
}

export default AddNewBlogForm
