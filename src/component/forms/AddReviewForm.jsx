'use client'
import React, { useState } from 'react'

const AddReviewForm = () => {
  const [formData,setFormData]= useState({
    name:'',
    rating:'',
    comment:'',
    image:null
  })

  const handleChange=(e)=>{
    const {name, files, value}= e.target
    if(files){
      setFormData((prev)=>({...prev, image: files[0]}))
    }
    else{
      setFormData((prev)=>({...prev,[name]:value}))
    }
  }

  const handleSubmit=async (e) => {
    e.preventDefault()
    try {
      
    } catch (error) {
      console.log(error)
      
    }
    
  }
  return (
    <form >
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id='name' name='name' required onChange={handleChange} value={formData.name}/>
      </div>
      <div>
        
      </div>
    </form>
  )
}

export default AddReviewForm
