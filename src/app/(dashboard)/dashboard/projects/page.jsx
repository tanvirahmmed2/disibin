import { BASE_URL } from '@/lib/database/secret'
import Link from 'next/link'
import React from 'react'

const Projects = async () => {
  const res = await fetch(`${BASE_URL}/api/project`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) return <div className='w-full flex items-center justify-center'>
    <p>No Data Found!</p>
  </div>
  const projects = data.payload

  return (
    <div className='w-full  min-h-screen flex flex-col items-center gap-4 p-4'>
      {
        projects.length === 0 ? <div>
          <p>Project data not found</p>
        </div> : <div className='w-full flex flex-col items-center justify-center gap-4 '>

          <h1 className='text-center text-xl font-semibold'>Our Latest Projects</h1>
          <div className='w-full flex flex-col items-center gap-1'>
            {
              projects.map((project) => (
                <div key={project._id} className='w-full grid grid-cols-8 even:bg-gray-100 p-2'>
                  <Link href={`/projects/${project.slug}`} className='col-span-6'>{project.title}</Link>
                  <p className='col-span-1'>{project.category}</p>
                  <div className='col-span-1 flex items-center justify-center flex-row gap-2'>
                    <Link href={`/projects/${project.slug}`}>Edit</Link>
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

export default Projects
