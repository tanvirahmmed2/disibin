'use client'
import axios from 'axios'
import React, { useState } from 'react'

const AddNewProjectForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    category: '',
    preview: '',
    tags: '',
    skills: ''
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
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

      const response = await axios.post('/api/project', data, { withCredentials: true })
      alert(response.data.message)
      setFormData({
        title: '',
        description: '',
        image: null,
        category: '',
        preview: '',
        tags: '',
        skills: ''
      })
    } catch (error) {
      console.log(error)
      alert(error?.response?.data?.message || "Failed to post project")

    }
  }
  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-center gap-4'>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="title">Title</label>
        <input type="text" name='title' id='title' required value={formData.title} onChange={handleChange} className='w-full px-3 p-1 outline-none border border-primary' />
      </div>
      <div className='w-full flex flex-col items-center justify-center sm:flex-row gap-4'>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="preview">Preview</label>
          <input type="text" name='preview' id='preview' onChange={handleChange} required value={formData.preview} className='w-full px-3 p-1 outline-none border border-primary' />
        </div>
        <div className='w-full flex flex-col gap-1'>
          <label htmlFor="category">Category</label>
          <input type="text" name='category' id='category' value={formData.category} onChange={handleChange} className='w-full px-3 p-1 outline-none border border-primary' />
        </div>
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" required onChange={handleChange} value={formData.description} className='w-full px-3 p-1 outline-none border border-primary'></textarea>
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="tags">Tags</label>
        <input type="text" name='tags' id='tags' required onChange={handleChange} value={formData.tags} className='w-full px-3 p-1 outline-none border border-primary' />
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="skills">skills</label>
        <input type="text" name='skills' id='skills' required onChange={handleChange} value={formData.skills} className='w-full px-3 p-1 outline-none border border-primary' />
      </div>
      <div className='w-full flex flex-col gap-1'>
        <label htmlFor="image">Image *</label>
        <input type="file" accept='image/*' required id='image' name='image' onChange={handleChange} className='w-full px-3 p-1 outline-none border border-primary' />
      </div>
      <button className='p-1 w-full text-center bg-primary/50 text-white hover:bg-primary cursor-pointer' type='submit'>Submit</button>
    </form>
  )
}

export default AddNewProjectForm
