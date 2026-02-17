'use client'
import UpdateUserForm from '@/component/forms/UpdateUserForm'
import { Context } from '@/component/helper/Context'
import React, { useContext } from 'react'

const UpdateProfile = () => {
    const {userData}= useContext(Context)
  return (
    <div className='w-full flex flex-col items-center gap-4 p-1 sm:p-4'>
        <h1 className='w-full text-center text-xl font-semibold text-emerald-600'>Update Your Basic Information</h1>
        <UpdateUserForm user={userData}/>
      
    </div>
  )
}

export default UpdateProfile
