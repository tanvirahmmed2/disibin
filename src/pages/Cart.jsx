import React, { useContext } from 'react'
import { CreateContext } from '../component/Context/CreateContext'

const Cart = () => {
  const { cartItem, totalCartAmount } = useContext(CreateContext)

  return (
    <div className='w-full flex flex-col items-center py-10 px-4'>
      <h1 className='text-3xl md:text-4xl font-semibold  mb-10'>
        🛒 Your Selected Packages
      </h1>

      <div className='w-full max-w-4xl flex flex-col gap-6'>

        {/* Table Header */}
        <div className='grid grid-cols-3 bg-sky-600 text-white rounded-md py-3 text-center font-medium shadow'>
          <p>Package</p>
          <p>Title</p>
          <p>Price</p>
        </div>

        {/* Cart Items */}
        {cartItem.length > 0 ? (
          cartItem.map(({ pack, title, price, id }) => (
            <div
              key={id}
              className='grid grid-cols-3 items-center text-center bg-white rounded-md py-4 shadow-sm hover:shadow-md transition duration-300'
            >
              <p className='text-gray-700 font-medium'>{pack}</p>
              <p className='text-gray-700'>{title}</p>
              <p className='text-sky-600 font-semibold'>${price}</p>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500 mt-6'>
            Your cart is empty
          </p>
        )}

        {/* Summary Section */}
        {cartItem.length > 0 && (
          <div className='flex flex-col md:flex-row items-stretch justify-between gap-6 mt-10'>

            <div className='flex-1 flex flex-col gap-4 bg-sky-100 border border-sky-200 rounded-xl p-6 shadow-sm'>
              <h2 className='text-xl font-semibold text-gray-700'>
                Order Summary
              </h2>
              <p className='text-gray-700'>
                Total Packages:{' '}
                <span className='ml-2 inline-block bg-white px-4 py-1 rounded-md shadow text-gray-900 font-medium'>
                  {cartItem.length}
                </span>
              </p>
              <p className='text-gray-700'>
                Payable Amount:{' '}
                <span className='ml-2 inline-block bg-white px-4 py-1 rounded-md shadow text-sky-600 font-semibold'>
                  ${totalCartAmount()}
                </span>
              </p>
            </div>

            <div className='flex-1 flex flex-col gap-3 bg-indigo-100 border border-indigo-200 rounded-xl p-6 shadow-sm'>
              <label htmlFor='coupon' className='text-gray-700 font-medium'>
                Apply Coupon
              </label>
              <input
                type='text'
                id='coupon'
                placeholder='ENTER COUPON'
                className='rounded-md border border-gray-300 focus:border-indigo-400 focus:ring-indigo-200 outline-none px-3 py-2 text-gray-800 placeholder-gray-400'
              />
            </div>
          </div>
        )}

        {/* Checkout Button */}
        {cartItem.length > 0 && (
          <div className='flex justify-center mt-10'>
            <button className='px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-md hover:scale-105 transition duration-300'>
              Pay Now 
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
