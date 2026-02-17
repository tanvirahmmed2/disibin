import UpdatePackageForm from '@/component/forms/UpdatePackageForm'
import { BASE_URL } from '@/lib/database/secret'
import React from 'react'

const UpdatePackagePage = async ({ params }) => {
    const { slug } = await params
    if (!slug) return <p>No slug found</p>

    const res = await fetch(`${BASE_URL}/api/package/${slug}`, {
        method: 'GET',
        cache: 'no-store'
    })
    if (!res.ok) return <p>Invalid reponse</p>

    const data = await res.json()
    if (!data.success) return <p>Package Data no found</p>
    const pack = data.payload

    return (
        <div className='w-full flex flex-col items-center gap-4 p-1 sm:p-4'>
            <h1 className='w-full text-center text-2xl font-semibold text-emerald-600'>Update Package Info</h1>
            <UpdatePackageForm pack={pack} />
        </div>
    )
}

export default UpdatePackagePage
