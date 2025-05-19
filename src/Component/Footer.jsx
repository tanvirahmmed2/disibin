import React from 'react'

function Footer(props) {
  return (
    <div className='h-20 w-full text-[12px] md:text-[16px] lg:text-[19px] text-teal-700 border-0.5 border-teal-700 flex gap-2 flex-row items-center justify-center'>
      <h3>All rights are reserved by</h3>
      <h1 className='text-xl font-bold'>{props.title}</h1>
      <h3>{new Date().getFullYear()}</h3>
      <div className='h-20 w-[2px] bg-teal-600'></div>
      <a href="https://facebook.com/disibin">Facebook</a>
      <a href="https://youtube.com/@disibin">Youtube</a>
      <a href="https://instagram.com/user.disibin">Instagram</a>
    </div>
  )
}

export default Footer
