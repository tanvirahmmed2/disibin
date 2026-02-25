import React from 'react'

export const metadata={
    title:'About | Disibin',
    description:'About Disibin page'
}

const AboutLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default AboutLayout
