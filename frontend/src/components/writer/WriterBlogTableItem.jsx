import React from 'react'
import { LuEye, LuEyeOff, LuTrash2 } from 'react-icons/lu'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'

const WriterBlogTableItem = ({ blog, index, fetchBlogs }) => {
  const { writerAxios } = useAppContext()
  const { title, createdAt } = blog
  const blogDate = new Date(createdAt)

  const deleteBlog = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this story?')
    if (!confirmDelete) return

    try {
      const { data } = await writerAxios.post('/api/blog/delete', { id: blog._id })
      if (data.success) {
        toast.success(data.message)
        await fetchBlogs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const togglePublish = async () => {
    try {
      const { data } = await writerAxios.post('/api/blog/toggle-publish', { id: blog._id })
      if (data.success) {
        toast.success(data.message)
        await fetchBlogs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <tr className="transition hover:bg-slate-50/60">
      <td className="px-5 py-4 text-xs font-semibold text-slate-400">{index}</td>
      <td className="px-5 py-4 font-semibold text-slate-900">{title}</td>
      <td className="px-5 py-4 text-xs text-slate-500 max-sm:hidden">{blogDate.toLocaleDateString()}</td>
      <td className="px-5 py-4 max-sm:hidden">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            blog.isPublished
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-amber-200 bg-amber-50 text-amber-700'
          }`}
        >
          {blog.isPublished ? 'Published' : 'Draft'}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={togglePublish}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[#702ae1] hover:text-[#702ae1]"
          >
            {blog.isPublished ? <LuEyeOff className="h-3 w-3" /> : <LuEye className="h-3 w-3" />}
            {blog.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            type="button"
            onClick={deleteBlog}
            aria-label="Delete story"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 shadow-sm"
          >
            <LuTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default WriterBlogTableItem
