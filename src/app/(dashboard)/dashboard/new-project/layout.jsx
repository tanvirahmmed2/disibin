import React from 'react'

export const metadata={
    title:'New Project | Disibin',
    description:'New Project Disibin page'
}

const NewProjectLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default NewProjectLayout
