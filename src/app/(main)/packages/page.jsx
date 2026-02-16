
import PackageCard from '@/component/card/PackageCard'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const packagesPage = async () => {
  const res = await fetch(`${BASE_URL}/api/package`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) return <div className='w-full flex items-center justify-center'>
    <p>No Data Found!</p>
  </div>
  const packages= data.payload


  return (
    <div className='w-full  min-h-screen flex flex-col items-center gap-4 p-4'>
      {
        packages.length === 0 ? <div>
          <p>package data not found</p>
        </div> : <div className='w-full flex flex-col items-center justify-center gap-4 '>

          <h1 className='text-center text-xl font-semibold'>Our Latest packages</h1>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {
              packages.map((pack)=>(
                <PackageCard key={pack.package_id} pack={pack}/>
              ))
            }
          </div>
        </div>
      }
    </div>
  )
}

export default packagesPage
