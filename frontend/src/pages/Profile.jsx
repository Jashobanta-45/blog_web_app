import React, { useEffect, useMemo, useState } from 'react'
import Moment from 'moment'
import {
  LuBookmark,
  LuCalendar,
  LuCircleCheck,
  LuCircleUserRound,
  LuClock,
  LuHeart,
  LuLock,
  LuLogOut,
  LuMail,
  LuMessageSquare,
  LuShield,
  LuSparkles,
  LuSquarePen,
  LuUser
} from 'react-icons/lu'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'
import { useAppContext } from '../context/useAppContext'

const Profile = () => {
  const { userToken, userProfile, fetchUserProfile, updateUserPassword, logoutUser, navigate, user, writerToken } =
    useAppContext()
  const [activeSection, setActiveSection] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: ''
  })

  useEffect(() => {
    if (!userToken) {
      navigate('/auth', { state: { from: '/profile' } })
      return
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true)
        await fetchUserProfile()
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [fetchUserProfile, navigate, userToken])

  const stats = useMemo(
    () => ({
      liked: userProfile?.likedBlogs?.length || 0,
      saved: userProfile?.savedBlogs?.length || 0,
      comments: userProfile?.comments?.length || 0
    }),
    [userProfile]
  )

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsUpdatingPassword(true)
      const message = await updateUserPassword(passwordForm)
      toast.success(message)
      setPasswordForm({ currentPassword: '', newPassword: '' })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: <LuUser className="h-4 w-4" /> },
    { id: 'liked', label: 'Liked Stories', count: stats.liked, icon: <LuHeart className="h-4 w-4" /> },
    { id: 'saved', label: 'Saved Stories', count: stats.saved, icon: <LuBookmark className="h-4 w-4" /> },
    { id: 'comments', label: 'Comments', count: stats.comments, icon: <LuMessageSquare className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <LuLock className="h-4 w-4" /> }
  ]

  const renderBlogGrid = (blogs, emptyTitle, emptySubtitle) => {
    if (!blogs?.length) {
      return (
        <div className="rounded-3xl border border-[#EDEDED] bg-white/70 px-8 py-16 text-center backdrop-blur-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2F3] text-xl text-[#6D001A]">
            <LuBookmark />
          </div>
          <h3 className="mt-4 font-[Manrope] text-xl font-bold text-black sm:text-2xl">{emptyTitle}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#555555]">{emptySubtitle}</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#4A0011]"
          >
            Explore Stories
          </button>
        </div>
      )
    }

    return (
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    )
  }

  const renderCommentsList = () => {
    if (!userProfile?.comments?.length) {
      return (
        <div className="rounded-3xl border border-[#EDEDED] bg-white/70 px-8 py-16 text-center backdrop-blur-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2F3] text-xl text-[#6D001A]">
            <LuMessageSquare />
          </div>
          <h3 className="mt-4 font-[Manrope] text-xl font-bold text-black sm:text-2xl">No comments yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#555555]">
            Join the conversation on any story to share your thoughts and perspectives.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#4A0011]"
          >
            Explore Stories
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {userProfile.comments.map((comment) => (
          <div
            key={comment._id}
            className="group rounded-2xl border border-[#EDEDED] bg-white/80 p-6 shadow-sm transition hover:border-[#6D001A]/40 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-[#888888]">
                  {Moment(comment.createdAt).format('MMMM D, YYYY')}
                </span>
                <h4
                  onClick={() => navigate(`/blog/${comment.blog?._id}`)}
                  className="mt-1 cursor-pointer font-[Manrope] text-lg font-bold text-black transition hover:text-[#6D001A]"
                >
                  {comment.blog?.title || 'Editorial Article'}
                </h4>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  comment.isApproved
                    ? 'bg-black text-white border border-black'
                    : 'bg-[#F7F2F3] text-[#6D001A] border border-[#6D001A]/20'
                }`}
              >
                {comment.isApproved ? <LuCircleCheck className="h-3.5 w-3.5" /> : <LuClock className="h-3.5 w-3.5" />}
                {comment.isApproved ? 'Published' : 'Under Review'}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[#444444]">{comment.content}</p>

            <div className="mt-4 border-t border-[#EDEDED] pt-3">
              <button
                type="button"
                onClick={() => navigate(`/blog/${comment.blog?._id}`)}
                className="text-xs font-bold text-[#6D001A] hover:underline"
              >
                View full discussion →
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderSecuritySection = () => (
    <div className="max-w-2xl rounded-3xl border border-[#EDEDED] bg-white/85 p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F2F3] text-[#6D001A]">
          <LuShield className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-[Manrope] text-xl font-bold text-black">Account Security</h3>
          <p className="text-xs text-[#555555]">Update your password to keep your account safe</p>
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
            placeholder="Minimum 6 characters"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
            required
            className="w-full rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-2.5 text-sm text-black placeholder:text-[#888888] transition focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
          />
        </div>

        <button
          type="submit"
          disabled={isUpdatingPassword}
          className="mt-2 rounded-full bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#4A0011] disabled:opacity-60"
        >
          {isUpdatingPassword ? 'Saving Changes...' : 'Update Password'}
        </button>
      </form>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-8">
      {/* 3 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div
          onClick={() => setActiveSection('liked')}
          className="group cursor-pointer rounded-2xl border border-[#EDEDED] bg-white/80 p-6 shadow-sm transition hover:border-[#6D001A]/30 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#555555]">Liked Stories</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F2F3] text-[#6D001A]">
              <LuHeart className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-tight text-black">{stats.liked}</p>
          <p className="mt-1 text-xs text-[#888888]">Articles you've appreciated</p>
        </div>

        <div
          onClick={() => setActiveSection('saved')}
          className="group cursor-pointer rounded-2xl border border-[#EDEDED] bg-white/80 p-6 shadow-sm transition hover:border-[#6D001A]/30 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#555555]">Saved Stories</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F2F3] text-[#6D001A]">
              <LuBookmark className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-tight text-black">{stats.saved}</p>
          <p className="mt-1 text-xs text-[#888888]">Bookmarked for later reading</p>
        </div>

        <div
          onClick={() => setActiveSection('comments')}
          className="group cursor-pointer rounded-2xl border border-[#EDEDED] bg-white/80 p-6 shadow-sm transition hover:border-[#6D001A]/30 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#555555]">Comments</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <LuMessageSquare className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-tight text-black">{stats.comments}</p>
          <p className="mt-1 text-xs text-[#888888]">Conversations participated in</p>
        </div>
      </div>

      {/* Account Details & Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#EDEDED] bg-white/80 p-6 shadow-sm sm:p-8">
          <h3 className="font-[Manrope] text-lg font-bold text-black">Personal Information</h3>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-[#EDEDED] pb-3">
              <span className="text-[#555555]">Full Name</span>
              <span className="font-semibold text-black">{userProfile?.user?.name || user?.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#EDEDED] pb-3">
              <span className="text-[#555555]">Email Address</span>
              <span className="font-semibold text-black">{userProfile?.user?.email || user?.email}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#EDEDED] pb-3">
              <span className="text-[#555555]">Membership</span>
              <span className="font-semibold text-black">Reader Account</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#555555]">Member Since</span>
              <span className="font-semibold text-black">
                {Moment(userProfile?.user?.createdAt || user?.createdAt).format('MMMM D, YYYY')}
              </span>
            </div>
          </div>
        </div>

        {/* Writer Tools CTA */}
        <div className="relative overflow-hidden rounded-3xl border border-[#6D001A]/20 bg-[linear-gradient(135deg,#FFFFFF,#F7F2F3)] p-6 shadow-sm sm:p-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#6D001A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#6D001A]">
            <LuSquarePen className="h-3.5 w-3.5" />
            Writer Studio
          </div>
          <h3 className="mt-4 font-[Manrope] text-2xl font-extrabold tracking-tight text-black">
            {writerToken ? 'Jump to Writer Dashboard' : 'Ready to share your stories?'}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#444444]">
            {writerToken
              ? 'Create new articles, track readership analytics, and manage comments in your dedicated workspace.'
              : 'Join Digital Ethereal as a contributing author. Publish stories, engage directly with readers, and grow an audience.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/writer')}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#4A0011]"
          >
            {writerToken ? 'Open Dashboard' : 'Become a Writer'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="ethereal-shell min-h-screen overflow-x-clip bg-white">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      {/* Sticky Minimal Navbar */}
      <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
        {/* Profile Hero Header */}
        <div className="mb-10 flex flex-col gap-6 border-b border-[#EDEDED] pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {/* User Avatar Circle */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6D001A] text-2xl font-black text-white shadow-md sm:h-20 sm:w-20 sm:text-3xl">
              {(userProfile?.user?.name || user?.name || 'U').charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-[Manrope] text-2xl font-black tracking-tight text-black sm:text-3xl lg:text-4xl">
                  {userProfile?.user?.name || user?.name || 'Reader'}
                </h1>
                <span className="rounded-full border border-[#6D001A]/30 bg-[#F7F2F3] px-2.5 py-0.5 text-[11px] font-bold text-[#6D001A]">
                  Reader
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-sm text-[#555555]">
                <LuMail className="h-3.5 w-3.5" />
                {userProfile?.user?.email || user?.email}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                logoutUser()
                navigate('/')
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#D9D9D9] bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#444444] shadow-sm transition hover:border-[#6D001A] hover:bg-[#F7F2F3] hover:text-[#6D001A]"
            >
              <LuLogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
            <button
              type="button"
              onClick={() => navigate('/writer')}
              className="rounded-full bg-black px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#222222]"
            >
              {writerToken ? 'Writer Studio' : 'Write'}
            </button>
          </div>
        </div>

        {/* Minimal Underline Category-Style Navigation Tabs */}
        <div className="mb-10 flex items-center gap-6 overflow-x-auto border-b border-[#EDEDED] pb-px scrollbar-none sm:gap-8">
          {navTabs.map((tab) => {
            const isActive = activeSection === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap pb-3.5 pt-1 text-sm font-semibold transition-colors ${
                  isActive ? 'text-black' : 'text-[#555555] hover:text-black'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      isActive ? 'bg-[#6D001A] text-white shadow-sm' : 'bg-[#F5F5F5] text-[#555555]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {isActive && <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-[#6D001A]" />}
              </button>
            )
          })}
        </div>

        {/* Tab Content Section */}
        {isLoading ? (
          <div className="rounded-3xl border border-[#EDEDED] bg-white/70 p-12 text-center text-sm text-[#555555] backdrop-blur-sm">
            Loading your profile data...
          </div>
        ) : (
          <div>
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'liked' &&
              renderBlogGrid(
                userProfile?.likedBlogs,
                'No liked stories yet',
                'Click the heart icon on any article you enjoy to save it to your liked stories.'
              )}
            {activeSection === 'saved' &&
              renderBlogGrid(
                userProfile?.savedBlogs,
                'No saved stories yet',
                'Bookmark articles to build your personal reading list and access them anytime.'
              )}
            {activeSection === 'comments' && renderCommentsList()}
            {activeSection === 'security' && renderSecuritySection()}
          </div>
        )}
      </main>

      {/* Improved Editorial Footer */}
      <Footer containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
    </div>
  )
}

export default Profile