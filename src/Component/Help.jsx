import React from 'react'

export default function Contact() {
  const submission = () => {
    alert('Reposrt Submitted')
  }
  return (
    <div className='h-[90vh] w-full gap-2 flex flex-col items-center justify-center'>
      <div className='flex flex-col gap-2'>
        <a href="https://facebook.com/disibin" className='w-[300px] inset-shadow-teal-400 text-teal-700 border-1   flex items-center justify-center hover:text-red-700'>Facebook</a>
        <a href="https://youtube.com/@disibin" className='w-[300px] inset-shadow-teal-400 text-teal-700 border-1   flex items-center justify-center hover:text-red-700'>Youtube</a>
        <a href="https://instagram.com/user.disibin" className='w-[300px] inset-shadow-teal-400 text-teal-700 border-1   flex items-center justify-center hover:text-red-700'>Instagram</a>
        <a href="https://telegram.com/disibin" className='w-[300px] inset-shadow-teal-400 text-teal-700 border-1   flex items-center justify-center hover:text-red-700'>Teregram</a>
      </div>
      <div className='flex flex-col items-center justify-center gap-2 mt-4'>
        <textarea rows={5} cols={5} name="" id="" placeholder='file your report' className='w-[300px] resize-none border-1 outline-0 border-teal-700 text-teal-700 px-2 py-2'></textarea>
        <input type="file" className='w-[300px] border-1 outline-0 border-teal-700 px-2 py-1 shadow-2xl ' />
        <button className='bg-teal-700 px-6 py-0.5 rounded-xl  text-white cursor-pointer' onClick={submission}>Submit</button>
      </div>
    </div>
  )
}
