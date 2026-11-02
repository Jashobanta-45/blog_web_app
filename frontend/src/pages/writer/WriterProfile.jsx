import React, { useEffect, useMemo, useState } from 'react'
import Moment from 'moment'
import { AtSign, Edit3, FileText, KeyRound, Lock, Mail, Phone, Save, Sparkles, UserRound, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/useAppContext'

const WriterProfile = () => {
  const { writerToken, writerProfile, fetchWriterProfile, updateWriterProfile, updateWriterPassword, navigate } =
    useAppContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: ''
  })

  useEffect(() => {
    if (!writerToken) {
      navigate('/writer')
      return
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true)
        await fetchWriterProfile()
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [fetchWriterProfile, navigate, writerToken])

  useEffect(() => {
    if (writerProfile?.writer) {
      setProfileForm({
        name: writerProfile.writer.name || '',
        email: writerProfile.writer.email || '',
        phone: writerProfile.writer.phone || '',
        description: writerProfile.writer.description || ''
      })
    }
  }, [writerProfile])

  const stats = useMemo(
    () => ({
      totalBlogs: writerProfile?.blogs?.length || 0,
      publishedBlogs: writerProfile?.blogs?.filter((blog) => blog.isPublished).length || 0,
      draftBlogs: writerProfile?.blogs?.filter((blog) => !blog.isPublished).length || 0,
      comments: writerProfile?.comments?.length || 0
    }),
    [writerProfile]
  )

  const handleProfileSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsUpdatingProfile(true)
      const message = await updateWriterProfile(profileForm)
      toast.success(message)
      setIsEditingProfile(false)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsUpdatingPassword(true)
      const message = await updateWriterPassword(passwordForm)
      toast.success(message)
      setPasswordForm({ currentPassword: '', newPassword: '' })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const cancelEditing = () => {
    if (writerProfile?.writer) {
      setProfileForm({
        name: writerProfile.writer.name || '',
        email: writerProfile.writer.email || '',
        phone: writerProfile.writer.phone || '',
        description: writerProfile.writer.description || ''
      })
    }
    setIsEditingProfile(false)
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-white p-4 md:p-8 xl:p-10">
        <div className="rounded-2xl border border-[#EDEDED] bg-white/80 p-8 text-center text-sm text-[#555555] shadow-sm">
          Loading writer profile...
        </div>
      </div>
    )
  }

  if (!writerProfile) {
    return (
      <div className="flex-1 bg-white p-4 md:p-8 xl:p-10">
        <div className="rounded-2xl border border-[#EDEDED] bg-white/80 p-8 text-center text-sm text-[#555555] shadow-sm">
          Unable to load writer profile.
        </div>
      </div>
    )
  }

  return (
    <div className="min-w-0 flex-1 bg-white p-4 md:p-8 xl:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Main Writer Identity Card */}
        <div className="rounded-3xl border border-[#EDEDED] bg-white/90 p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EDEDED] pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6D001A] text-2xl font-black text-white shadow-sm">
                {(writerProfile.writer.name || 'W').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-[Manrope] text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                    {writerProfile.writer.name}
                  </h2>
                  <span className="rounded-full border border-[#6D001A]/30 bg-[#F7F2F3] px-2.5 py-0.5 text-[11px] font-bold text-[#6D001A]">
                    Author
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#888888]">
                  Member since {Moment(writerProfile.writer.createdAt).format('MMMM YYYY')}
                </p>
              </div>
            </div>

            <div>
              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#6D001A] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#4A0011]"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D9D9D9] bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#444444] shadow-sm transition hover:bg-[#F5F5F5]"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {!isEditingProfile ? (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#888888]">Full Name</p>
                  <p className="mt-1 text-sm font-semibold text-black">{writerProfile.writer.name}</p>
                </div>

                <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#888888]">Username</p>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#888888]">
                      <Lock className="h-2.5 w-2.5" /> Locked
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-black">@{writerProfile.writer.username}</p>
                </div>

                <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#888888]">Email Address</p>
                  <p className="mt-1 truncate text-sm font-semibold text-black">{writerProfile.writer.email}</p>
                </div>

                <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#888888]">Phone</p>
                  <p className="mt-1 text-sm font-semibold text-black">{writerProfile.writer.phone || 'Not set'}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#888888]">About the Author</p>
                <p className="mt-2 text-sm leading-relaxed text-[#444444]">
                  {writerProfile.writer.description || 'No bio provided yet.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#444444]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-2.5 text-sm text-black transition focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#444444]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                    className="w-full rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-2.5 text-sm text-black transition focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#444444]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-2.5 text-sm text-black transition focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#888888]">
                    Username (Permanent)
                  </label>
                  <input
                    type="text"
                    value={writerProfile.writer.username}
                    disabled
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-[#D9D9D9] bg-[#EDEDED] px-4 py-2.5 text-sm text-[#555555] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#444444]">
                  Author Biography
                </label>
                <textarea
                  rows={3}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  className="w-full rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] p-3.5 text-sm text-black transition focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
                  placeholder="Tell readers about your perspective and writing focus..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="rounded-full bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#4A0011] disabled:opacity-60"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-full border border-[#D9D9D9] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#444444] transition hover:bg-[#F5F5F5]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#EDEDED] bg-white/80 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#888888]">Total Stories</span>
            <p className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-tight text-black">{stats.totalBlogs}</p>
          </div>
          <div className="rounded-2xl border border-[#EDEDED] bg-white/80 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#888888]">Published</span>
            <p className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-tight text-black">
              {stats.publishedBlogs}
            </p>
          </div>
          <div className="rounded-2xl border border-[#EDEDED] bg-white/80 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#888888]">Drafts</span>
            <p className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-tight text-black">{stats.draftBlogs}</p>
          </div>
          <div className="rounded-2xl border border-[#EDEDED] bg-white/80 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#888888]">Reader Comments</span>
            <p className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-tight text-black">{stats.comments}</p>
          </div>
        </div>

        {/* Security / Password Update */}
        <div className="max-w-2xl rounded-3xl border border-[#EDEDED] bg-white/90 p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F2F3] text-[#6D001A]">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-[Manrope] text-xl font-bold text-black">Security Credentials</h3>
              <p className="text-xs text-[#555555]">Update your writer account login password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#444444]">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                required
                className="w-full rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-2.5 text-sm text-black placeholder:text-[#888888] transition focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#444444]">
                New Password
              </label>
              <input
                type="password"
                placeholder="New password (min 6 characters)"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                required
                className="w-full rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-2.5 text-sm text-black placeholder:text-[#888888] transition focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="rounded-full bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#4A0011] disabled:opacity-60"
            >
              {isUpdatingPassword ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WriterProfile