import React, { useEffect, useState, useCallback } from 'react'
import { LuPlus } from 'react-icons/lu'
import WriterBlogTableItem from '../../components/writer/WriterBlogTableItem'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'

const WriterListBlog = () => {
  const { writerAxios, navigate } = useAppContext()
  const [blogs, setBlogs] = useState([])

  const fetchBlogs = useCallback(async () => {
    try {
      const { data } = await writerAxios.get('/api/writer/blogs')
      if (data.success) {
        setBlogs(data.blogs)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [writerAxios])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  return (
    <div className="bg-white p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Title & CTA */}
        <div className="flex flex-col gap-4 border-b border-[#EDEDED] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6D001A]">Publishing Desk</span>
            <h1 className="font-[Manrope] text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              My Stories ({blogs.length})
            </h1>
            <p className="text-sm text-[#555555]">Manage all articles you have written and track their status.</p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => navigate('/writer/addBlog')}
              className="inline-flex items-center gap-2 rounded-full bg-[#6D001A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#4A0011]"
            >
              <LuPlus className="h-4 w-4" />
              Write New Story
            </button>
          </div>
        </div>

        {/* Stories Table */}
        <div className="overflow-hidden rounded-2xl border border-[#EDEDED] bg-white/90 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#444444]">
              <thead className="border-b border-[#EDEDED] bg-[#FAFAFA] text-[11px] font-bold uppercase tracking-wider text-[#888888]">
                <tr>
                  <th scope="col" className="px-5 py-3.5">#</th>
                  <th scope="col" className="px-5 py-3.5">Story Title</th>
                  <th scope="col" className="px-5 py-3.5 max-sm:hidden">Date</th>
                  <th scope="col" className="px-5 py-3.5 max-sm:hidden">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED]">
                {blogs.length ? (
                  blogs.map((blog, index) => (
                    <WriterBlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#888888]">
                      No stories published yet. Click "Write New Story" to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WriterListBlog