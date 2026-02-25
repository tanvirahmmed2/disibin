import React from 'react'

export const metadata={
    title:'Helps | Disibin',
    description:'Helps Disibin page'
}

const HelpsLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default HelpsLayout
