import React from 'react'

export default function ClientDash() {
    return (
        <div className='w-full h-180 px-4 py-16 flex flex-row gap-2'>

            <div className='h-160 w-50  px-4 py-4 border-r-2 flex flex-col gap-2 justify-between text-black'>
                <div className='w-full h-auto flex flex-col gap-2'>
                    <p>Profile</p>
                    <p>Security</p>
                    <p>Cart</p>
                    <p>Order</p>
                    <p>Review</p>
                    <p>Message</p>
                    <p>Payment</p>
                    <p>Offer</p>
                </div>
                <div className='w-full h-auto flex flex-col gap-2'>
                    <p>Setting</p>
                    <p>Logout</p>
                </div>

            </div>


            <div className='flex w-full items-center justify-center'>
                <p className='text-2xl'>Soory to bother you sir. Our server Under maintenence!!</p>
            </div>
        </div>
    )
}
