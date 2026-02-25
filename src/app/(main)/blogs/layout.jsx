import React from 'react'

export const metadata={
    title:'Blog | Disibin',
    description:'Blog Disibin page'
}

const BlogLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default BlogLayout
