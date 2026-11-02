import React, { useMemo } from 'react'
import { LuArrowUpRight, LuBookOpen, LuCalendar, LuCircleUserRound } from 'react-icons/lu'
import { useAppContext } from '../context/useAppContext'
import { formatDate, normalizeBlog } from '../utils/homeDisplay'

const Header = ({ containerClassName = '' }) => {
  const { blogs, navigate } = useAppContext()

  const normalizedBlogs = useMemo(() => blogs.map(normalizeBlog), [blogs])

  // Get the single latest blog
  const latestBlog = useMemo(() => {
    if (!normalizedBlogs.length) return null
    return [...normalizedBlogs].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0]
  }, [normalizedBlogs])

  return (
    <header className="relative bg-white pt-10 pb-10 sm:pt-14 sm:pb-14">
      <div className={containerClassName}>
        {/* Top Header Badge & Titles matching reference image */}
        <div className="mb-8 space-y-3">
          <h1 className="font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-black sm:text-4xl lg:text-5xl">
            Read Stories & Share Ideas
          </h1>
          <p className="text-base text-[#555555] sm:text-lg">
            A platform where passionate writers publish their stories and readers explore fresh perspectives every day.
          </p>
        </div>

        {/* Latest Blog Featured Card */}
        {latestBlog ? (
          <div
            onClick={() => navigate(`/blog/${latestBlog._id}`)}
            className="group relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] w-full cursor-pointer overflow-hidden rounded-3xl sm:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.14)] transition duration-500 hover:shadow-[0_28px_80px_rgba(109,0,26,0.22)]"
          >
            {/* Background Image */}
            <img
              src={latestBlog.image}
              alt={latestBlog.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />

            {/* Content Container */}
            <div className="relative flex h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex-col justify-end p-6 sm:p-10 lg:p-12">
              {/* Title and Top-Right Arrow */}
              <div className="flex items-start justify-between gap-4">
                <h2 className="max-w-4xl font-[Manrope] text-2xl font-extrabold leading-tight tracking-[-0.03em] text-white transition-colors duration-200 group-hover:text-[#F7F2F3] sm:text-3xl lg:text-4xl">
                  {latestBlog.title}
                </h2>
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-white group-hover:text-[#6D001A]">
                  <LuArrowUpRight className="text-2xl" />
                </div>
              </div>

              {/* Subtitle / Excerpt */}
              {(latestBlog.plainSubtitle || latestBlog.plainDescription) && (
                <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-relaxed text-[#EDEDED] sm:text-base">
                  {latestBlog.plainSubtitle || latestBlog.plainDescription}
                </p>
              )}

              {/* Bottom Meta Row: Author, Date, and Category tags */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
                {/* Author & Date */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                      <LuCircleUserRound className="text-xl" />
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {latestBlog.writerName || 'Digital Editorial'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#D9D9D9]">
                    <LuCalendar className="text-sm text-[#BBBBBB]" />
                    <span>{formatDate(latestBlog.createdAt)}</span>
                  </div>
                </div>

                {/* Category Tags on bottom-right */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#6D001A] px-3.5 py-1 text-xs font-semibold text-white">
                    {latestBlog.category || 'UI/UX'}
                  </span>
                  <span className="hidden sm:inline-block rounded-full border border-white/25 bg-white/15 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    Featured
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl sm:rounded-[2.5rem] border border-[#EDEDED] bg-[#FAFAFA] px-6 py-12 text-center">
            <LuBookOpen className="text-5xl text-[#6D001A]" />
            <h2 className="mt-4 font-[Manrope] text-2xl font-extrabold text-black sm:text-3xl">
              No stories published yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-[#555555]">
              Publish your first story from the writer dashboard to see it featured here.
            </p>
            <button
              type="button"
              onClick={() => navigate('/writer')}
              className="mt-6 rounded-full bg-[#6D001A] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#4A0011]"
            >
              Open Writer Dashboard
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header