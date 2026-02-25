import React from 'react'

export const metadata={
    title:'Purchases | Disibin',
    description:'Purchases Disibin page'
}

const PurchasesLayout = ({children}) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default PurchasesLayout
