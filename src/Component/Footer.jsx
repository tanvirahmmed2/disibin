import React from 'react'

function Footer(props) {
  return (
    <div className='h-auto py-6 w-full text-[10px] md:text-[14px] lg:text-[18px] text-black border-0.5 bg-gray-200 flex gap-2 flex-row items-end justify-center'>
      <h3>All rights are reserved by</h3>
      <h1 className='text-teal-700 font-bold'>{props.title}</h1>
      <h3>{new Date().getFullYear()}</h3>
      <a className='hover:text-teal-700' href="https://facebook.com/disibin">Facebook</a>
      <a className='hover:text-teal-700' href="https://youtube.com/@disibin">Youtube</a>
      <a className='hover:text-teal-700' href="https://instagram.com/user.disibin">Instagram</a>
    </div>
  )
}

export default Footer
