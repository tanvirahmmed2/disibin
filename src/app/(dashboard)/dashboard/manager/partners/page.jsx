"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    FaHandshake, FaPlus, FaEdit, FaTrash, FaTimes,
    FaCheck, FaSpinner, FaUpload, FaBuilding
} from "react-icons/fa";

const EMPTY_FORM = { name: "", logo: "", logo_id: "", description: "" };

export default function PartnerManagementPage() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [uploading, setUploading] = useState(false);
    const [imgError, setImgError] = useState({});
    const nameRef = useRef(null);
    const fileRef = useRef(null);

    useEffect(() => { fetchPartners(); }, []);
    useEffect(() => { if (showForm) nameRef.current?.focus(); }, [showForm]);

    const fetchPartners = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/partner");
            if (res.data.success) setPartners(res.data.data);
        } catch { toast.error("Failed to load partners"); }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setImgError(p => ({ ...p, form: false }));
        setShowForm(true);
    };

    const openEdit = (p) => {
        setEditing(p);
        setForm({ name: p.name, logo: p.logo || "", logo_id: p.logo_id || "", description: p.description || "" });
        setImgError(p2 => ({ ...p2, form: false }));
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); };

    // Upload file to Cloudinary via /api/image
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("image", file);
            const res = await axios.post("/api/image", fd);
            if (res.data.success) {
                setForm(p => ({ ...p, logo: res.data.data.url, logo_id: res.data.data.public_id }));
                setImgError(p => ({ ...p, form: false }));
                toast.success("Logo uploaded");
            } else toast.error(res.data.message);
        } catch { toast.error("Upload failed"); }
        finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
    };

    // Clear logo (and optionally delete from Cloudinary if it was a new upload during this session)
    const clearLogo = () => {
        setForm(p => ({ ...p, logo: "", logo_id: "" }));
        setImgError(p => ({ ...p, form: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error("Partner name is required");
        setSaving(true);
        try {
            if (editing) {
                const res = await axios.patch("/api/partner", { partnerId: editing.partner_id, ...form });
                if (res.data.success) {
                    toast.success("Partner updated");
                    setPartners(prev => prev.map(p => p.partner_id === editing.partner_id ? res.data.data : p));
                    closeForm();
                } else toast.error(res.data.message);
            } else {
                const res = await axios.post("/api/partner", form);
                if (res.data.success) {
                    toast.success("Partner added");
                    setPartners(prev => [...prev, res.data.data]);
                    closeForm();
                } else toast.error(res.data.message);
            }
        } catch (err) { toast.error(err?.response?.data?.message || "Something went wrong"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (p) => {
        if (!confirm(`Remove "${p.name}" from partners? This will also delete the logo from Cloudinary.`)) return;
        setDeleting(p.partner_id);
        try {
            const res = await axios.delete(`/api/partner?id=${p.partner_id}`);
            if (res.data.success) {
                toast.success("Partner removed");
                setPartners(prev => prev.filter(x => x.partner_id !== p.partner_id));
            } else toast.error(res.data.message);
        } catch { toast.error("Failed to delete"); }
        finally { setDeleting(null); }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaHandshake className="text-blue-600" size={22} /> Partners & Collaborations
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage partner logos shown on the homepage</p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm">
                    <FaPlus size={12} /> Add Partner
                </button>
            </div>

            {/* Stats banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white shadow-sm">
                <p className="text-blue-100 text-sm font-medium">Total Partners</p>
                <p className="text-4xl font-bold mt-1">{partners.length}</p>
                <p className="text-blue-200 text-xs mt-1">Displayed on the public homepage</p>
            </div>

            {/* ── Modal ─────────────────────────────────────────── */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="font-bold text-gray-900 text-lg">
                                {editing ? "Edit Partner" : "Add New Partner"}
                            </h2>
                            <button onClick={closeForm}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                                <FaTimes size={14} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">

                            {/* Logo — click to upload */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Logo
                                </label>

                                {/* Hidden file input */}
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="logo-upload"
                                    disabled={uploading}
                                />

                                {/* Clickable upload / preview zone */}
                                <label
                                    htmlFor="logo-upload"
                                    className={`relative h-36 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all overflow-hidden ${
                                        uploading
                                            ? "bg-blue-50 border-blue-200 cursor-wait"
                                            : form.logo && !imgError["form"]
                                                ? "bg-gray-50 border-gray-200 cursor-pointer hover:border-blue-300"
                                                : "bg-gray-50 border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                                    }`}
                                >
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-2 text-blue-500">
                                            <FaSpinner size={22} className="animate-spin" />
                                            <p className="text-xs font-medium">Uploading to Cloudinary...</p>
                                        </div>
                                    ) : form.logo && !imgError["form"] ? (
                                        <>
                                            <img
                                                src={form.logo}
                                                alt="preview"
                                                className="max-h-20 max-w-[80%] object-contain"
                                                onError={() => setImgError(p => ({ ...p, form: true }))}
                                            />
                                            <p className="text-[10px] text-gray-400 mt-2">Click to replace</p>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <FaUpload size={20} />
                                            <p className="text-xs font-medium text-gray-500">Click to upload logo</p>
                                            <p className="text-[10px] text-gray-400">PNG, JPG, SVG, WebP</p>
                                        </div>
                                    )}

                                    {/* Remove button (shown when a logo is set) */}
                                    {form.logo && !uploading && (
                                        <button
                                            type="button"
                                            onClick={e => { e.preventDefault(); clearLogo(); }}
                                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                                        >
                                            <FaTimes size={9} />
                                        </button>
                                    )}
                                </label>

                                {/* Cloudinary confirmation */}
                                {form.logo_id && (
                                    <p className="text-[10px] text-emerald-600 mt-1.5 flex items-center gap-1">
                                        <FaCheck size={9} />
                                        <span>Uploaded · </span>
                                        <span className="font-mono truncate text-emerald-500">{form.logo_id}</span>
                                    </p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                                    Partner Name <span className="text-red-500">*</span>
                                </label>
                                <input ref={nameRef} type="text" value={form.name}
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. Acme Corporation"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                                    Short Description
                                </label>
                                <textarea value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Brief description of the partnership..."
                                    rows={3}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button type="button" onClick={closeForm}
                                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving || uploading}
                                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                                    {saving ? <FaSpinner size={12} className="animate-spin" /> : <FaCheck size={12} />}
                                    {editing ? "Save Changes" : "Add Partner"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Partner Grid ─────────────────────────────────── */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <FaSpinner size={28} className="animate-spin text-blue-400" />
                </div>
            ) : partners.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <FaHandshake size={48} className="mb-4 text-gray-200" />
                    <p className="font-semibold text-gray-500 text-lg">No partners yet</p>
                    <p className="text-sm mt-1 mb-4">Add your first collaboration partner</p>
                    <button onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                        <FaPlus size={12} /> Add Partner
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {partners.map(p => (
                        <div key={p.partner_id}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                            {/* Logo */}
                            <div className="h-32 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100 relative">
                                {p.logo && !imgError[p.partner_id] ? (
                                    <img src={p.logo} alt={p.name}
                                        className="max-h-16 max-w-full object-contain"
                                        onError={() => setImgError(prev => ({ ...prev, [p.partner_id]: true }))} />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-300">
                                        <FaBuilding size={28} />
                                        <p className="text-xs">No logo</p>
                                    </div>
                                )}
                                {p.logo_id && (
                                    <span className="absolute top-2 right-2 text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                                        Cloudinary
                                    </span>
                                )}
                            </div>
                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900">{p.name}</h3>
                                {p.description && (
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                                )}
                                <p className="text-[10px] text-gray-400 mt-2">
                                    Added {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </p>
                            </div>
                            {/* Actions */}
                            <div className="px-4 pb-4 flex gap-2">
                                <button onClick={() => openEdit(p)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors">
                                    <FaEdit size={11} /> Edit
                                </button>
                                <button onClick={() => handleDelete(p)}
                                    disabled={deleting === p.partner_id}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50">
                                    {deleting === p.partner_id
                                        ? <FaSpinner size={11} className="animate-spin" />
                                        : <FaTrash size={11} />}
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
