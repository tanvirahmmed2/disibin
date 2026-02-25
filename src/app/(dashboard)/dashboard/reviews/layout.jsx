import React from 'react'

export const metadata={
    title:'Reviews | Disibin',
    description:'Reviews Disibin page'
}

const ReviewsLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default ReviewsLayout
