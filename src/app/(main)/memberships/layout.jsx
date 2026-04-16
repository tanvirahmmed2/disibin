import React from 'react'

export const metadata={
    title:'Premium Memberships',
    description:'Premium Mem'
}

const MembershipsLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default MembershipsLayout
