import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const Project = async({params}) => {
    const {slug}= await params
    const res= await fetch(`${BASE_URL}/api/project/${slug}`,{
        method:'GET',
        cache:'no-store'
    })

    const data= await res.json()
    if(!data.success) return <div className='w-full flex items-center justify-center'>
    <p>No Data Found!</p>
  </div>
  const project= data.payload
  return (
    <div>
      <h1>{project.slug}</h1>
    </div>
  )
}

export default Project
