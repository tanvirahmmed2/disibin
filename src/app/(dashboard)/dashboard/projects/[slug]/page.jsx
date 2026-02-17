import UpdateProjectForm from '@/component/forms/UpdateProjectForm'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const UpdateProjectPage = async({params}) => {
    const {slug}= await params

    const res= await fetch(`${BASE_URL}/api/project/${slug}`,{
        method:'GET',
        cache:'no-store'
    })

   if(!res.ok){
    return <p>No data found!</p>
   }

   const data= await res.json()

   if (!data.success) {
    return <p className="text-center p-10">{data.message || "Project not found"}</p>;
  }

  const project= data.payload


    

  return (
    <div className='w-full flex flex-col items-center gap-4 p-1 sm:p-4'>
        <h1>Update Project</h1>
        <UpdateProjectForm project={project}/>
    </div>
  )
}

export default UpdateProjectPage
