import React from 'react'

export const metadata={
    title:'About | Disibin',
    description:'About disibin'
}

const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
