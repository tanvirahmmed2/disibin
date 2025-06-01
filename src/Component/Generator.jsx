import React from 'react'
import usePageTitle from './usePageTitle'

function Generator() {
  usePageTitle("Generator");
  return (
    <div className='h-[95vh] w-full flex items-center justify-center '>
      <p className='text-8xl'>404 error</p>
    </div>
  )
}

export default Generator
