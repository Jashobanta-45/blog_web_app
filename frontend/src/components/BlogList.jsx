import React, { useMemo, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { blogCategories } from '../assets/assets'
import { useAppContext } from '../context/useAppContext'
import BlogCard from './BlogCard'
import { normalizeBlog } from '../utils/homeDisplay'

const BlogList = ({ containerClassName = '' }) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const { blogs, input, setInput } = useAppContext()

  const normalizedBlogs = useMemo(() => blogs.map(normalizeBlog), [blogs])

  // Get the single latest blog ID (same as featured in Hero)
  const latestBlogId = useMemo(() => {
    if (!normalizedBlogs.length) return null
    return [...normalizedBlogs].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0]?._id
  }, [normalizedBlogs])

  // Dynamically extract categories from existing blogs
  const visibleCategories = useMemo(() => {
    const dynamicCategories = normalizedBlogs
      .map((blog) => blog.category)
      .filter(Boolean)
      .filter((category, index, allCategories) => allCategories.indexOf(category) === index)

    return ['All', ...blogCategories.filter((category) => category !== 'All'), ...dynamicCategories].filter(
      (category, index, allCategories) => allCategories.indexOf(category) === index
    )
  }, [normalizedBlogs])

  const filteredBlogs = useMemo(() => {
    return normalizedBlogs.filter((blog) => {
      // On default landing state ('All' and no search input), exclude the hero latest blog if we have more than 1 blog
      if (activeCategory === 'All' && !input && normalizedBlogs.length > 1 && blog._id === latestBlogId) {
        return false
      }

      const matchesSearch =
        !input ||
        blog.title?.toLowerCase().includes(input.toLowerCase()) ||
        blog.category?.toLowerCase().includes(input.toLowerCase()) ||
        blog.plainDescription?.toLowerCase().includes(input.toLowerCase())

      const matchesCategory = activeCategory === 'All' || blog.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [activeCategory, input, normalizedBlogs, latestBlogId])

  return (
    <main id="stories" className="bg-white pb-24 pt-2">
      <div className={containerClassName}>
        {/* Category Tabs (Left) and Search Input (Right) */}
        <div className="mb-10 flex flex-col gap-5 border-b border-[#EDEDED] md:flex-row md:items-center md:justify-between">
          {/* Categories Bar */}
          <div className="flex items-center gap-6 overflow-x-auto pb-px scrollbar-none sm:gap-8">
            {visibleCategories.map((category) => {
              const count =
                category === 'All'
                  ? normalizedBlogs.length
                  : normalizedBlogs.filter((b) => b.category === category).length
              const isActive = activeCategory === category

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`relative flex items-center gap-2 whitespace-nowrap pb-3.5 pt-1 text-sm font-semibold transition-colors ${
                    isActive ? 'text-black' : 'text-[#555555] hover:text-black'
                  }`}
                >
                  <span>{category}</span>
                  {count > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isActive
                          ? 'bg-[#6D001A] text-white shadow-sm'
                          : 'bg-[#F5F5F5] text-[#555555]'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-[#6D001A]" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Search Box on the Right */}
          <div className="relative mb-3 w-full md:mb-2 md:w-72 lg:w-80 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search blog..."
              className="w-full rounded-full border border-[#D9D9D9] bg-white/90 py-2.5 pl-4 pr-11 text-sm text-black placeholder:text-[#888888] shadow-sm transition hover:border-[#888888] focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
            />
            <LuSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-[#888888]" />
          </div>
        </div>

        {/* Minimalist Blog Cards Grid */}
        {filteredBlogs.length ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-[#EDEDED] bg-[#FAFAFA] px-8 py-16 text-center">
            <h3 className="font-[Manrope] text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
              No stories match your criteria
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#555555]">
              Try searching with another keyword or select another category above.
            </p>
            <button
              type="button"
              onClick={() => {
                setInput('')
                setActiveCategory('All')
              }}
              className="mt-6 rounded-full bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#4A0011]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default BlogList