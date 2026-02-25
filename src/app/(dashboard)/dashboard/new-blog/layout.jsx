import React from 'react'

export const metadata={
    title:'New Blog | Disibin',
    description:'New Blog Disibin page'
}

const NewBlogLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default NewBlogLayout
