import React from 'react'

export const metadata={
    title:'New Package | Disibin',
    description:'New Package Disibin page'
}

const NewPackageLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default NewPackageLayout
