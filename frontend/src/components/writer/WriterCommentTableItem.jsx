import React from 'react'
import { LuCheck, LuTrash2 } from 'react-icons/lu'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'

const WriterCommentTableItem = ({ comment, fetchComments }) => {
  const { writerAxios } = useAppContext()
  const { blog, createdAt, _id } = comment
  const commentDate = new Date(createdAt)

  const approveComment = async () => {
    try {
      const { data } = await writerAxios.post('/api/writer/approve-comment', { id: _id })
      if (data.success) {
        toast.success(data.message)
        fetchComments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteComment = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this comment?')
      if (!confirmDelete) return
      const { data } = await writerAxios.post('/api/writer/delete-comment', { id: _id })
      if (data.success) {
        toast.success(data.message)
        fetchComments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <tr className="transition hover:bg-slate-50/60">
      <td className="px-5 py-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-[#702ae1]">On: {blog?.title || 'Editorial Story'}</p>
          <p className="text-sm font-semibold text-slate-900">{comment.name || 'Anonymous Reader'}</p>
          <p className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs leading-relaxed text-slate-600">
            "{comment.content}"
          </p>
        </div>
      </td>

      <td className="px-5 py-4 text-xs text-slate-400 max-sm:hidden whitespace-nowrap">
        {commentDate.toLocaleDateString()}
      </td>

      <td className="px-5 py-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          {!comment.isApproved ? (
            <button
              type="button"
              onClick={approveComment}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <LuCheck className="h-3.5 w-3.5" />
              Approve
            </button>
          ) : (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              Published
            </span>
          )}

          <button
            type="button"
            onClick={deleteComment}
            aria-label="Delete comment"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 shadow-sm"
          >
            <LuTrash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default WriterCommentTableItem
