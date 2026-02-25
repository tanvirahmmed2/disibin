import React from 'react'

export const metadata={
    title:'Blogs | Disibin',
    description:'Blogs Disibin page'
}

const BlogsLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default BlogsLayout
