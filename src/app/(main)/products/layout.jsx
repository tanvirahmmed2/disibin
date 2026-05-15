import React from 'react'

export const metadata={
    title:'Products | Disibin',
    description:'Products of disibin'
}

const layout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default layout
