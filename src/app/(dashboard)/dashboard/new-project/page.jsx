import AddNewProjectForm from '@/component/forms/AddNewProjectForm'
import React from 'react'

const NewProjectPage = () => {
  return (
    <div className='w-full p-4 flex flex-col items-center justify-center gap-4'>
      <h1 className='text-center font-semibold text-2xl text-emerald-500'>Add New Project</h1>
      <AddNewProjectForm/>
    </div>
  )
}

export default NewProjectPage
