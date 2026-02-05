'use client'
import axios from 'axios'
import React, { useState } from 'react'

const AddNewProjectForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    category: '',
    price: '',
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
    setLoading(true)

    try {
      const data = new FormData()
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key])
      })

      const response= await axios.post('/api/project', data, {withCredentials:true})
      alert(response.data.message)
    } catch (error) {
      console.log(error)
      alert(error?.response?.data?.message || "Failed to post project")

    }
  }
  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-center gap-4'>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" name='title' id='title' required value={formData.title} onChange={handleChange}/>
      </div>
      <div>
        <div>
          <label htmlFor="preview">Preview</label>
          <input type="text" name='preview' id='preview' onChange={handleChange} required value={formData.preview} placeholder='set preview link'/>
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <input type="text" name='category' id='category' value={formData.category} onChange={handleChange} />
        </div>
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" required onChange={handleChange} value={formData.description} placeholder='write here'></textarea>
      </div>
      <div>
        <label htmlFor="tags">Tags</label>
        <input type="text" name='tags' id='tags' required onChange={handleChange} value={formData.tags} placeholder="tags ('||')"/>
      </div>
      <div>
        <label htmlFor="skills">skills</label>
        <input type="text" name='skills' id='skills' required onChange={handleChange} value={formData.skills} placeholder="skills ('||')"/>
      </div>
      <div>
      <label htmlFor="image">Image *</label>
      <input type="file" accept='*/image' />
      </div>

    </form>
  )
}

export default AddNewProjectForm
