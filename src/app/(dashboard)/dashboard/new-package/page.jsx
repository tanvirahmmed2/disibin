import AddNewPackage from '@/component/forms/AddNewPackage'
import React from 'react'

const NewPackage = () => {
  return (
   <div className='w-full p-4 flex flex-col items-center gap-4'>
      <h1 className='text-2xl font-semibold text-center'>Add New Package</h1>
      <AddNewPackage/>

    </div>
  )
}

export default NewPackage
