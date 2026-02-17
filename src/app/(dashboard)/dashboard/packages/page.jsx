'use client'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Packages = () => { // Capitalized component name
  const [packages, setPackages] = useState([]) // Fixed naming

  const fetchPacks = async () => {
    try {
      const res = await axios.get('/api/package', { withCredentials: true })
      setPackages(res.data.payload)
    } catch (error) {
      setPackages([])
      console.log(error)
    }
  }

  const handleDelete = async (id) => {
    // Added alert confirmation
    const isConfirmed = window.confirm('Are you sure you want to delete this package?')
    if (!isConfirmed) return

    try {
      const res = await axios.delete('/api/package', { data: { id }, withCredentials: true })
      fetchPacks()
      alert(res.data.message)
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete pack")
    }
  }

  useEffect(() => {
    fetchPacks()
  }, [])

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
                <div key={pack.package_id} className='w-full grid grid-cols-8 even:bg-gray-200 rounded-xl border border-black/30 shadow p-2'>
                  <Image src={pack.image} alt='pack image' width={50} height={50} className='col-span-1 rounded-2xl' />
                  <Link href={`/packages/${pack.slug}`} className='col-span-2 font-bold'>{pack.title}</Link>
                  <p className='col-span-3'>{pack.description.slice(0, 100)}...</p>
                  <p className='col-span-1'>{pack.category}</p>
                  <div className='col-span-1 flex items-center justify-center flex-col gap-1'>
                    <Link href={`/dashboard/packages/${pack.slug}`} className='w-full bg-green-500 text-center text-white cursor-pointer'>Edit</Link>
                    <button onClick={() => handleDelete(pack.package_id)} className='w-full bg-red-500 text-center text-white cursor-pointer'>Delete</button>
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

export default Packages