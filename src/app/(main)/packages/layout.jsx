import React from 'react'

export const metadata={
    title:'Packages | Disibin',
    description:'Packages Disibin page'
}

const PackagesLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default PackagesLayout
