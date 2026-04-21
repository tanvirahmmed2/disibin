'use client'
import axios from 'axios'
import React, { useState } from 'react'

const UpdatePackageForm = ({ pack }) => {

    const [formData, setFormData] = useState({
        title: pack?.title || '',
        description: pack?.description || '',
        price: pack?.price || '',
        discount: pack?.discount || '',
        category: pack?.category || '',
        features: pack?.features?.join(', ') || '',
    })

    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()

            data.append('id', pack._id)

            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('price', Number(formData.price))
            data.append('discount', Number(formData.discount || 0))
            data.append('category', formData.category)

            const featuresArray = formData.features
                .split(',')
                .map(f => f.trim())
                .filter(Boolean)

            data.append('features', featuresArray.join(','))

            if (image) {
                data.append('image', image)
            }

            const res = await axios.patch('/api/package', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.data.success) {
                alert('Package updated successfully')
            } else {
                alert(res.data.message || 'Update failed')
            }

        } catch (error) {
            alert(error?.response?.data?.message || 'Update failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 p-4'>

            <div>
                <label className='font-bold'>Package Title</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className='input-standard'
                    required
                />
            </div>

            <div>
                <label className='font-bold'>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className='input-standard'
                    required
                />
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
                <div>
                    <label className='font-bold'>Price</label>
                    <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        className='input-standard'
                        required
                    />
                </div>

                <div>
                    <label className='font-bold'>Discount</label>
                    <input
                        name="discount"
                        type="number"
                        value={formData.discount}
                        onChange={handleChange}
                        className='input-standard'
                    />
                </div>
            </div>

            <div>
                <label className='font-bold'>Category</label>
                <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className='input-standard'
                    required
                />
            </div>

            <div>
                <label className='font-bold'>Features (comma separated)</label>
                <input
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    className='input-standard'
                />
            </div>

            <div>
                <label className='font-bold'>Update Image</label>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className='input-standard'
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className='bg-emerald-500 text-white p-3 rounded-md font-bold disabled:opacity-50'
            >
                {loading ? 'Updating...' : 'Update Package'}
            </button>

        </form>
    )
}

export default UpdatePackageForm