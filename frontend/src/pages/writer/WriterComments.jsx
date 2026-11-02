import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { LuCircleCheck, LuClock, LuMessageSquare } from 'react-icons/lu'
import WriterCommentTableItem from '../../components/writer/WriterCommentTableItem'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'

const WriterComments = () => {
  const { writerAxios } = useAppContext()
  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState('Not Approved')

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await writerAxios.get('/api/writer/comments')
      data.success ? setComments(data.comments) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }, [writerAxios])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const pendingCount = useMemo(() => comments.filter((c) => !c.isApproved).length, [comments])
  const approvedCount = useMemo(() => comments.filter((c) => c.isApproved).length, [comments])

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      if (filter === 'Approved') return comment.isApproved === true
      return comment.isApproved === false
    })
  }, [comments, filter])

  return (
    <div className="bg-white p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header Title */}
        <div className="space-y-2 border-b border-[#EDEDED] pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6D001A]">Community & Readers</span>
          <h1 className="font-[Manrope] text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            Discussion Comments
          </h1>
          <p className="text-sm text-[#555555]">Review, approve, or moderate reader comments on your articles.</p>
        </div>

        {/* Minimal Underline Filter Tabs */}
        <div className="flex items-center gap-6 border-b border-[#EDEDED] pb-px">
          <button
            type="button"
            onClick={() => setFilter('Not Approved')}
            className={`relative flex items-center gap-2 pb-3 pt-1 text-sm font-semibold transition-colors ${
              filter === 'Not Approved' ? 'text-black' : 'text-[#555555] hover:text-black'
            }`}
          >
            <LuClock className="h-4 w-4" />
            <span>Pending Review</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                filter === 'Not Approved'
                  ? 'bg-[#6D001A] text-white shadow-sm'
                  : 'bg-[#F5F5F5] text-[#555555]'
              }`}
            >
              {pendingCount}
            </span>
            {filter === 'Not Approved' && (
              <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-[#6D001A]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilter('Approved')}
            className={`relative flex items-center gap-2 pb-3 pt-1 text-sm font-semibold transition-colors ${
              filter === 'Approved' ? 'text-black' : 'text-[#555555] hover:text-black'
            }`}
          >
            <LuCircleCheck className="h-4 w-4" />
            <span>Approved Comments</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                filter === 'Approved'
                  ? 'bg-[#6D001A] text-white shadow-sm'
                  : 'bg-[#F5F5F5] text-[#555555]'
              }`}
            >
              {approvedCount}
            </span>
            {filter === 'Approved' && (
              <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-[#6D001A]" />
            )}
          </button>
        </div>

        {/* Comments Table */}
        <div className="overflow-hidden rounded-2xl border border-[#EDEDED] bg-white/90 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#444444]">
              <thead className="border-b border-[#EDEDED] bg-[#FAFAFA] text-[11px] font-bold uppercase tracking-wider text-[#888888]">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Story & Reader Feedback</th>
                  <th scope="col" className="px-5 py-3.5 max-sm:hidden">Date</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEDED]">
                {filteredComments.length ? (
                  filteredComments.map((comment) => (
                    <WriterCommentTableItem
                      key={comment._id}
                      comment={comment}
                      fetchComments={fetchComments}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-12 text-center text-sm text-[#888888]">
                      {filter === 'Not Approved'
                        ? 'All caught up! No pending comments to moderate.'
                        : 'No approved comments yet.'}
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

export default WriterComments