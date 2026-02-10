import AddNewBlogForm from '@/component/forms/AddNewBlogForm'
import React from 'react'

const NewBlogPage = () => {
  return (
    <div className='w-full p-4 flex flex-col items-center gap-4'>
      <h1 className='text-2xl font-semibold text-center'>Add New Blog</h1>
      <AddNewBlogForm/>
    </div>
  )
}

export default NewBlogPage
