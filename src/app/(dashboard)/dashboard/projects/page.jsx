'use client'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/project', { withCredentials: true })
      setProjects(res.data.payload)
    } catch (error) {
      console.log(error)
      setProjects([])

    }
  }

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this project?");

    if (!isConfirmed) return;
    try {
      const res = await axios.delete('/api/project', { data: { id }, withCredentials: true })
      alert(res.data.message)
      fetchProjects()

    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete Project')

    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

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
                <div key={project.project_id} className='w-full grid grid-cols-8 even:bg-gray-200 rounded-xl border border-black/30 shadow p-2'>
                  <Image src={project.image} alt='project image' width={50} height={50} className='col-span-1 rounded-2xl' />
                  <Link href={`/projects/${project.slug}`} className='col-span-2 font-bold'>{project.title}</Link>
                  <p className='col-span-3'>{project.description.slice(0, 100)}...</p>
                  <p className='col-span-1'>{project.category}</p>
                  <div className='col-span-1 flex items-center justify-center flex-col gap-1'>
                    <Link href={`/dashboard/projects/${project.slug}`} className='w-full bg-green-500 text-center text-white cursor-pointer'>Edit</Link>
                    <button onClick={() => handleDelete(project.project_id)} className='w-full bg-red-500 text-center text-white cursor-pointer'>Delete</button>
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
