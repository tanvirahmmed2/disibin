import React from 'react'
import { CiCalendar, CiMail, CiPhone } from "react-icons/ci";
import UsePageTitle from '../component/UsePageTitle'


const Contact = () => {
  UsePageTitle("Contact")
  

  return (
    <section className='w-full pt-20 p-4 min-h-screen flex items-center justify-center'>
      <div className='w-full bg-white/5 h-auto flex flex-col lg:flex-row rounded-lg p-4 items-center justify-center'>

        <div className='w-full flex flex-col gap-2 items-start justify-start'>
          <h1 className='text-xl font-semibold'>Let’s talk about your project</h1>
          <p>Tell us a bit about your goals and we’ll reply very soon</p>
          <div className='w-full p-2 flex flex-row items-center gap-4 justify-start'>
            <p><CiMail/></p>
            <a href="mailto:disibin@gmail.com">disibin@gmail.com</a>
          </div>  
          <div className='w-full p-2 flex flex-row items-center gap-4 justify-start'>
            <p><CiPhone/></p>
            <a href="tel:+8801987131369">+8801987131369</a>
          </div>  
          <div className='w-full p-2 flex flex-row items-center gap-4 justify-start'>
            <p><CiCalendar/></p>
            <p>Book</p>
          </div>  


        </div>


        <div className='w-full h-auto flex flex-col items-center justify-center'>
          <h1 className='text-xl font-semibold'>Book</h1>
          <form action="" className='w-full h-auto flex flex-col items-center justify-center'>
            <div className='w-full flex flex-col  gap-2 p-2'>
              <label htmlFor="name">name</label>
              <input type="text" name='name' id='name'  className='bg-white/10 px-4 py-1 rounded-md outline-none' required/>
            </div>
            <div className='w-full flex flex-col  gap-2 p-2'>
              <label htmlFor="email">email</label>
              <input type="email" name='email' id='email'  className='bg-white/10 px-4 py-1 rounded-md outline-none' required/>
            </div>
            <div className='w-full flex flex-col  gap-2 p-2'>
              <label htmlFor="subject">subject</label>
              <input type="text" name='subject' id='subject'  className='bg-white/10 px-4 py-1 rounded-md outline-none' required/>
            </div>
            <div className='w-full flex flex-col  gap-2 p-2'>
              <label htmlFor="message">message</label>
              <textarea name="message" id="message" className='bg-white/10 px-4 py-1 rounded-md outline-none' required></textarea>
            </div>
            <button type='submit' className=' px-4 w-20 border-2 border-white/10 rounded-lg'>Submit</button>
          </form>
        </div>

      </div>
    </section>
  )
}

export default Contact
