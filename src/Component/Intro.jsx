import React from 'react'

export default function Intro(props) {
  return (
    <div>
      <div className=' h-[95vh] w-full  flex flex-col items-center justify-center  text-center'>
        <div>
          <h1>Hi! Welcome to</h1>
          <h1 className='font-bold text-5xl text-teal-700'>{props.title}</h1>
          <h3>Website Designer & Developer Community</h3>
          <p>Our team is dedicated to building fast, reliable, and user-friendly websites for businesses of all sizes. From simple landing pages to full-featured web applications, we use the latest web technologies to create digital experiences that help you grow online. Partner with us to turn your ideas into a strong online presence.</p>
        </div>
      </div>
    </div>
  )
}
