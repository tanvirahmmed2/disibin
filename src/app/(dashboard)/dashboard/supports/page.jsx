'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Messages = () => {
  const [supports, setSupports] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchSupports = async () => {
    try {
      const response = await axios.get(`/api/support?search=${searchTerm}`)
      setSupports(response.data.payload)
    } catch (error) {
      setSupports([])
    }
  }

  // Fixed: Added () to call the function and added a debounce/cleanup feel
  useEffect(() => {
    fetchSupports();
  }, [searchTerm])

  const actionHandler = async (id) => {
    try {
      // Fixed: Sent id and status directly (not wrapped in 'data' key)
      const res = await axios.patch(`/api/support`, { id, status: 'replied' })
      alert(res.data.message)
      fetchSupports()
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to update status')
    }
  }

  const deleteSupport = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/support`, { data: { id } })
      fetchSupports()
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <div className='w-full p-1 sm:p-4'>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="p-2 border rounded w-full max-w-md text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {supports.length !== 0 ? (
        <div className='w-full flex flex-col gap-8'>
          <div className="w-full flex flex-row items-center justify-between">
            <h1 className="text-xl font-bold">Quick Response To Customers</h1>
            <p className="text-white bg-red-300 p-2 rounded-xl border">{supports.length} messages</p>
          </div>
          <div className="grid gap-4">
            {supports.map((support) => (
              <div key={support.support_id} className={`p-2 relative grid w-full gap-4 grid-cols-1 md:grid-cols-9 border rounded-lg ${support.status === 'unread' ? 'bg-blue-50' : 'bg-white'}`}>

                <div className="flex flex-col gap-1 col-span-3 ">
                  <h2 className="font-bold text-lg">{support.name}</h2>
                  <p className="text-sm text-blue-600">{support.email}</p>
                </div>
                <div className="col-span-5 flex flex-col gap-1">
                  <p className="font-semibold text-xl font-mono">Subject: {support.subject}</p>
                  <p className="text-gray-700 p-2 bg-white">{support.message}</p>
                </div>
                <div className=" col-span-1 flex flex-col gap-1 ">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer hover:scale-95"
                    onClick={() => deleteSupport(support.support_id)}
                  >
                    Delete
                  </button>
                  {support.status === 'unread' ? <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 cursor-pointer hover:scale-95"
                    onClick={() => actionHandler(support.support_id)}
                  >
                    Mark Replied
                  </button> : <p>Replied</p>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center py-10 text-gray-500">No Support Data Found!</p>
      )}
    </div>
  )
}

export default Messages