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
        
      </div>

    </form>
  )
}

export default AddNewProjectForm
