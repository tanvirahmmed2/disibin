'use client'
import React, { useState } from 'react'

const AddTeamMemberForm = () => {
  const [formData, setFormData]= useState({
    name:'',
    role:'',
    image:'',
    bio:''
  })

  const handleChange=(e)=>{
    const {name, value, files}=e.target
    if(files){
      setFormData((prev)=>({...prev, image: files[0]}))
    }else{
      setFormData((prev)=>({...prev,[name]:value}))
    }
  }

  return (
    <form >

    </form>
  )
}

export default AddTeamMemberForm
