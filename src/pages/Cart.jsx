import React, { useContext } from 'react'
import { CreateContext } from '../component/Context/CreateContext'

const Cart = () => {

    const { cartItem } = useContext(CreateContext)

    return (
        <div className='w-full h-auto flex flex-col gap-8 items-center justify-center text-center p-4'>
            <h1 className='text-2xl'>Your selected packages: </h1>
            <div className='w-full flex flex-col items-center justify-center gap-4'>
                <div className='w-full grid grid-cols-3 justify-items-center gap-3'>
                    <p>Package</p>
                    <p>Title</p>
                    <p>Price</p>
                </div>

                {
                    cartItem.map((cart) => {
                        const { pack, title, price, id } = cart
                        return <div key={id} className='w-full grid grid-cols-4 justify-items-center gap-3'>
                            <p>{pack}</p>
                            <p>{title}</p>
                            <p>{price}</p>

                        </div>
                    })
                }

            </div>
        </div>
    )
}

export default Cart
