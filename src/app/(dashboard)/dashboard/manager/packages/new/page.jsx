'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { RiArrowLeftLine, RiSaveLine, RiImageAddLine } from 'react-icons/ri'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

const NewPackage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        categoryId: '',
        features: ''
    })

    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/api/category')
                setCategories(res.data.data || [])
            } catch (error) {
                console.error('Failed to fetch categories', error)
            }
        }
        fetchCategories()
    }, [])

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) {
            toast.error('Only image files are allowed')
            return
        }
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('price', Number(formData.price))
            data.append('categoryId', formData.categoryId)

            const featuresArray = formData.features
                .split(',')
                .map(f => f.trim())
                .filter(Boolean)

            data.append('features', featuresArray.join(','))

            if (!image) {
                toast.error('Image is required')
                setLoading(false)
                return
            }

            data.append('image', image)

            const res = await axios.post('/api/package', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.data.success) {
                toast.success('Package created successfully')
                router.push('/dashboard/manager/packages')
            } else {
                toast.error(res.data.message || 'Failed to create package')
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full mx-auto space-y-8 pb-20">

            <Link
                href="/dashboard/manager/packages"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-bold"
            >
                <RiArrowLeftLine />
                Back to Packages
            </Link>

            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    Create New Package
                </h1>
                <p className="text-slate-500">
                    Define pricing, category, and features.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-3xl shadow-sm space-y-8"
            >

                <div className="grid md:grid-cols-2 gap-8">

                    <div className="space-y-4">

                        <input
                            name="title"
                            placeholder="Package Title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-standard"
                            required
                        />

                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="input-standard"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.category_id} value={cat.category_id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="relative border-2 border-dashed rounded-xl flex items-center justify-center h-60 overflow-hidden">

                        {preview ? (
                            <Image
                                src={preview}
                                alt="preview"
                                width={500}
                                height={500}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center text-slate-400">
                                <RiImageAddLine size={42} />
                                <p>Upload Image</p>
                            </div>
                        )}

                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>

                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    <input
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        className="input-standard"
                        required
                    />

                    <input
                        name="discount"
                        type="number"
                        placeholder="Discount (Optional)"
                        value={formData.discount}
                        onChange={handleChange}
                        className="input-standard"
                    />

                </div>

                <textarea
                    name="features"
                    placeholder="Features (comma separated)"
                    value={formData.features}
                    onChange={handleChange}
                    className="input-standard"
                    rows={3}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-standard"
                    rows={4}
                    required
                />

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <RiSaveLine />
                    {loading ? 'Creating...' : 'Create Package'}
                </button>

            </form>
        </div>
    )
}

export default NewPackage