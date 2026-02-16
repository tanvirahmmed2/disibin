import { BASE_URL } from '@/lib/database/secret'
import Link from 'next/link'
import React from 'react'

const packages = async () => {
  const res = await fetch(`${BASE_URL}/api/package`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) return <div className='w-full flex items-center justify-center'>
    <p>No Data Found!</p>
  </div>
  const packages = data.payload

  return (
    <div className='w-full  min-h-screen flex flex-col items-center gap-4 p-4'>
      {
        packages.length === 0 ? <div>
          <p>package data not found</p>
        </div> : <div className='w-full flex flex-col items-center justify-center gap-4 '>

          <h1 className='text-center text-xl font-semibold'>Our Latest packages</h1>
          <div className='w-full flex flex-col items-center gap-1'>
            {
              packages.map((pack) => (
                <div key={pack.package_id} className='w-full grid grid-cols-8 even:bg-gray-100 p-2'>
                  <Link href={`/packages/${pack.slug}`} className='col-span-6'>{pack.title}</Link>
                  <p className='col-span-1'>{pack.category}</p>
                  <div className='col-span-1 flex items-center justify-center flex-row gap-2'>
                    <Link href={`/packages/${pack.slug}`}>Edit</Link>
                    <button>Delete</button>
                  </div>

                </div>
              ))
            }
          </div>
        </div>
      }
    </div>
  )
}

export default packages
