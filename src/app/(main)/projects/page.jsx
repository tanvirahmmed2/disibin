
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const ProjectsPage = async () => {
  const res = await fetch(`${BASE_URL}/api/project`, {
    method: 'GET',
    cache: 'no-store'
  })

  const data = await res.json()

  if (!data.success) return <div>
    <p>No Data Found!</p>
  </div>
  console.log(data)
  return (
    <div className='w-full flex flex-col items-center gap-4 p-4'>
      {
        projects.length === 0 ? <div>
          <p>Project data not found</p>
        </div> : <div>

          <h1></h1>
        </div>
      }
    </div>
  )
}

export default ProjectsPage
