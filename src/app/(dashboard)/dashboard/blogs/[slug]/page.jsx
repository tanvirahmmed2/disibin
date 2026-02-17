import UpdateBlogForm from '@/component/forms/UpdateBlogForm'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const UpdateBlogPage = async ({ params }) => {
    const { slug } = await params

    if (!slug) return <p>No slug found</p>

    const res = await fetch(`${BASE_URL}/api/blog/${slug}`, {
        method: 'GET',
        cache: 'no-store'
    })

    if (!res.ok) return <p>Failed to fetch data</p>

    const data = await res.json()
    if (!data.success) return <p>Blog data not found</p>
    const blog = data.payload


    return (
        <div className='w-full flex flex-col items-center gap-4 p-1 sm:p-4'>
            <h1 className='text-emerald-600 text-2xl text-center font-semibold'>Update Blog Info</h1>
            <UpdateBlogForm blog={blog} />

        </div>
    )
}

export default UpdateBlogPage
