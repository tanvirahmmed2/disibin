import Image from 'next/image'
import React from 'react'

export const metadata = {
  title: "Auth | Disibin",
  description: "Face authentication and access your account. Disibin"
}

const layout = ({ children }) => {
  return (
    <div className='w-full flex flex-row items-center justify-center h-screen'>
      <div className='w-full hidden lg:flex flex-col items-center justify-end h-screen overflow-hidden'>
        <h1 className="text-4xl font-bold">
          Build Your Digital Future
        </h1>

        <p className="mt-4 max-w-md text-primary text-center">
          Securely access your Disibin dashboard to manage your websites,
          SaaS products, clients, and business operations from one place.
        </p>

        <div className='w-auto'>
          <Image src={'/client.png'} alt='client' width={1000} height={1000} className='w-72' />

        </div>
      </div>
      <div className='w-full h-screen'>
        {children}
      </div>
    </div>
  )
}

export default layout