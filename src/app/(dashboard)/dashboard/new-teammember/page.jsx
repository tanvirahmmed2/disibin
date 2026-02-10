import AddTeamMemberForm from '@/component/forms/AddTeamMemberForm'
import React from 'react'

const NewTeamMember = () => {
  return (
     <div className='w-full p-4 flex flex-col items-center justify-center gap-4'>
      <h1 className='text-center font-semibold text-2xl text-emerald-500'>Add New Project</h1>
      <AddTeamMemberForm/>
    </div>
  )
}

export default NewTeamMember
