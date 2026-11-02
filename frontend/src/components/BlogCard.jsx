import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlogEngagement from './BlogEngagement'
import { formatDate, normalizeBlog } from '../utils/homeDisplay'

const BlogCard = ({ blog }) => {
  const navigate = useNavigate()
  const normalizedBlog = normalizeBlog(blog)

  return (
    <article
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="group flex cursor-pointer flex-col transition duration-300"
    >
      {/* Minimalist Rounded Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#F5F5F5] shadow-sm">
        <img
          src={blog.image}
          alt={blog.title}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col pt-3.5">
        {/* Category in Burgundy */}
        <span className="text-xs font-bold uppercase tracking-wider text-[#6D001A]">
          {blog.category || 'Technology'}
        </span>

        {/* Title */}
        <h3 className="mt-1.5 font-[Manrope] text-xl font-bold leading-snug tracking-tight text-black transition-colors group-hover:text-[#6D001A] sm:text-2xl">
          {blog.title}
        </h3>

        {/* Subtitle / Excerpt */}
        {(normalizedBlog.plainSubtitle || normalizedBlog.plainDescription) && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#555555]">
            {normalizedBlog.plainSubtitle || normalizedBlog.plainDescription}
          </p>
        )}

        {/* Author & Date Meta */}
        <div className="mt-auto flex items-center justify-between pt-4 text-xs font-medium text-[#888888]">
          <div className="flex items-center gap-2 truncate">
            <span className="truncate font-semibold text-[#444444]">
              {blog.writerName || 'Digital Editorial'}
            </span>
            <span>•</span>
            <span className="flex-shrink-0">{formatDate(blog.createdAt)}</span>
          </div>

          <BlogEngagement blog={blog} compact className="flex-shrink-0" />
        </div>
      </div>
    </article>
  )
}

export default BlogCard