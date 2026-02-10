'use client'
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
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      
    } catch (error) {
      console.log(error)
      
      
    }
  }
  return (
   <form onSubmit={handleSubmit}></form>
  )
}

export default AddNewBlogForm
