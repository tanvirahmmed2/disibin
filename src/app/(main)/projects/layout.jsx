import React from 'react'

export const metadata={
    title:'Projects | Disibin',
    description:'Projects Disibin page'
}

const ProjectsLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default ProjectsLayout
