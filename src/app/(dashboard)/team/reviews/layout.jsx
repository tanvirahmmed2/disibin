import React from 'react'

export const metadata={
    title:'Reviews | Disibin',
    description:'Review Page'
}

const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
