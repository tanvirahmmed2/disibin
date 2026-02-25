import React from 'react'

export const metadata={
    title:'Settings | Disibin',
    description:'Settings Disibin page'
}

const SettingsLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default SettingsLayout
