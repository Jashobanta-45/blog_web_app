import React, { useCallback, useEffect, useState } from 'react'
import { LuBookOpen, LuCheck, LuPlus, LuRss, LuShare2, LuUserRound, LuUsers } from 'react-icons/lu'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'
import { useAppContext } from '../context/useAppContext'

const WriterDetails = () => {
  const { username, writerId } = useParams()
  const { api, navigate, userToken, followingWriterIds, toggleFollowWriter } = useAppContext()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowingLoading, setIsFollowingLoading] = useState(false)

  const fetchWriterProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await api.get(username ? `/api/writer/public/${username}` : `/api/writer/public/id/${writerId}`)

      if (!data.success) {
        throw new Error(data.message)
      }

      setProfile(data.profile)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [api, username, writerId])

  useEffect(() => {
    fetchWriterProfile()
  }, [fetchWriterProfile])

  const handleFollow = async () => {
    if (!profile?.writer?._id) return

    if (!userToken) {
      toast.error('Please login to follow writers')
      navigate('/auth', { state: { from: username ? `/writers/${username}` : `/writers/id/${writerId}` } })
      return
    }

    try {
      setIsFollowingLoading(true)
      await toggleFollowWriter(profile.writer._id)
      setProfile((currentProfile) =>
        currentProfile
          ? {
              ...currentProfile,
              stats: {
                ...currentProfile.stats,
                followers: Math.max(0, (currentProfile.stats.followers || 0) + (isFollowing ? -1 : 1))
              }
            }
          : currentProfile
      )
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsFollowingLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: profile?.writer?.name,
          url: window.location.href
        })
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Author profile link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="ethereal-shell min-h-screen overflow-x-clip bg-white">
        <div className="ethereal-orb ethereal-orb-primary" />
        <div className="ethereal-orb ethereal-orb-secondary" />
        <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="ethereal-shell min-h-screen overflow-x-clip bg-white">
        <div className="ethereal-orb ethereal-orb-primary" />
        <div className="ethereal-orb ethereal-orb-secondary" />
        <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
        <div className="mx-auto w-full max-w-xl px-4 py-24 text-center">
          <h2 className="font-[Manrope] text-2xl font-bold text-black">Writer profile unavailable</h2>
          <p className="mt-2 text-sm text-[#555555]">The author you are searching for does not exist or has been removed.</p>
          <button
            type="button"
            onClick={() => navigate('/writers')}
            className="mt-6 rounded-full bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            Browse Writers
          </button>
        </div>
      </div>
    )
  }

  const isFollowing = followingWriterIds.includes(profile.writer._id)

  return (
    <div className="ethereal-shell min-h-screen overflow-x-clip bg-white">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-10">
        {/* Author Header Card */}
        <div className="rounded-3xl border border-[#EDEDED] bg-white/90 p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#6D001A] text-4xl font-black text-white shadow-md sm:h-28 sm:w-28">
                {(profile.writer.name || 'W').charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Author Bio & Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="font-[Manrope] text-2xl font-black tracking-tight text-black sm:text-3xl lg:text-4xl">
                      {profile.writer.name}
                    </h1>
                    <span className="rounded-full border border-[#6D001A]/30 bg-[#F7F2F3] px-2.5 py-0.5 text-[11px] font-bold text-[#6D001A]">
                      Author
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[#6D001A]">@{profile.writer.username}</p>
                </div>

                {/* Follow & Share Actions */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleFollow}
                    disabled={isFollowingLoading}
                    className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                      isFollowing
                        ? 'border border-[#D9D9D9] bg-[#F5F5F5] text-[#444444] hover:bg-[#EDEDED]'
                        : 'bg-[#6D001A] text-white shadow-md hover:bg-[#4A0011]'
                    } disabled:opacity-60`}
                  >
                    {isFollowing ? <LuCheck className="h-3.5 w-3.5" /> : <LuPlus className="h-3.5 w-3.5" />}
                    {isFollowingLoading ? 'Updating...' : isFollowing ? 'Following' : 'Follow Author'}
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share author profile"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9D9D9] bg-white text-[#444444] shadow-sm transition hover:border-[#6D001A] hover:text-[#6D001A]"
                  >
                    <LuShare2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="max-w-3xl text-sm leading-relaxed text-[#444444] sm:text-base">
                {profile.writer.description || 'Contributing writer on Digital Ethereal exploring technology, culture, and design.'}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4 sm:gap-4">
                <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-3.5 text-center">
                  <p className="font-[Manrope] text-xl font-bold text-black">{profile.stats.followers}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Followers</p>
                </div>
                <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-3.5 text-center">
                  <p className="font-[Manrope] text-xl font-bold text-black">{profile.stats.blogs}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Stories</p>
                </div>
                <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-3.5 text-center">
                  <p className="font-[Manrope] text-xl font-bold text-black">{profile.stats.reads}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Reads</p>
                </div>
                <div className="rounded-2xl border border-[#EDEDED] bg-[#FAFAFA] p-3.5 text-center">
                  <p className="font-[Manrope] text-xl font-bold text-black">{profile.stats.likes}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Likes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stories by Author Section */}
        <section className="mt-12">
          <div className="mb-8 flex items-center justify-between border-b border-[#EDEDED] pb-4">
            <div>
              <h2 className="font-[Manrope] text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                Stories by {profile.writer.name}
              </h2>
              <p className="mt-1 text-xs text-[#555555]">Curated articles, essays, and viewpoints</p>
            </div>

            <span className="rounded-full border border-[#D9D9D9] bg-white px-3.5 py-1 text-xs font-semibold text-[#444444] shadow-sm">
              {profile.blogs.length} {profile.blogs.length === 1 ? 'Story' : 'Stories'}
            </span>
          </div>

          {profile.blogs.length ? (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {profile.blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#EDEDED] bg-white/70 px-8 py-16 text-center backdrop-blur-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2F3] text-xl text-[#6D001A]">
                <LuBookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-[Manrope] text-xl font-bold text-black sm:text-2xl">
                No stories published yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#555555]">
                This writer hasn't published any stories yet. Follow them to be notified when their first story drops.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
    </div>
  )
}

export default WriterDetails