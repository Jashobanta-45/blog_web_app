import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { LuBookOpen, LuChevronRight, LuMessageSquareText, LuUserRound } from 'react-icons/lu'
import { useParams } from 'react-router-dom'
import Moment from 'moment'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../context/useAppContext'
import toast from 'react-hot-toast'
import BlogEngagement from '../components/BlogEngagement'
import { normalizeBlog } from '../utils/homeDisplay'

const Blog = () => {
  const { id } = useParams()
  const { api, userAxios, user, userToken, navigate, blogs, followingWriterIds, toggleFollowWriter } = useAppContext()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [isFollowingWriter, setIsFollowingWriter] = useState(false)

  const fetchBlogData = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/blog/${id}`)
      data.success ? setData(data.blog) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }, [api, id])

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await api.post('/api/blog/comments', { blogId: id })
      if (data.success) {
        setComments(data.comments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [api, id])

  const addComment = async (event) => {
    event.preventDefault()

    if (!userToken) {
      toast.error('Please login to comment on this blog')
      navigate('/auth', { state: { from: `/blog/${id}` } })
      return
    }

    try {
      const { data } = await userAxios.post('/api/blog/add-comment', { blog: id, content })
      if (data.success) {
        toast.success(data.message)
        setContent('')
        setData((currentData) => (currentData ? { ...currentData, commentsCount: data.commentsCount } : currentData))
        fetchComments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBlogData()
    fetchComments()
  }, [fetchBlogData, fetchComments])

  const scrollToComments = () => {
    const commentsSection = document.getElementById('blog-comments-section')
    commentsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const relatedBlogs = useMemo(() => {
    if (!data) return []

    return blogs
      .filter((blog) => blog._id !== data._id)
      .filter((blog) => !data.category || blog.category === data.category)
      .slice(0, 3)
      .map(normalizeBlog)
  }, [blogs, data])

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader />
      </div>
    )
  }

  const authorName = data.writerName || 'Digital Editorial'
  const normalizedCurrentBlog = normalizeBlog(data)
  const writerId = data.writer?._id || data.writer
  const writerUsername = data.writer?.username || data.writerUsername
  const isFollowing = writerId ? followingWriterIds.includes(writerId.toString()) : false
  const writerProfilePath = writerUsername ? `/writers/${writerUsername}` : writerId ? `/writers/id/${writerId}` : null

  const handleFollowWriter = async () => {
    if (!writerId) {
      return
    }

    if (!userToken) {
      toast.error('Please login to follow writers')
      navigate('/auth', { state: { from: `/blog/${id}` } })
      return
    }

    try {
      setIsFollowingWriter(true)
      await toggleFollowWriter(writerId)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsFollowingWriter(false)
    }
  }

  return (
    <div className="ethereal-shell min-h-screen overflow-x-clip bg-white">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />

      <main className="pb-16 pt-8">
        <section className="mx-auto w-full px-4 sm:px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-black shadow-[0_32px_80px_rgba(0,0,0,0.18)]">
            <img
              src={data.image}
              alt={data.title}
              className="h-[460px] w-full object-cover opacity-70 sm:h-[520px]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.76)_72%,rgba(0,0,0,0.92)_100%)]" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-12">
              <div className="max-w-3xl">
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#6D001A] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                    {data.category || 'Editorial'}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-xl">
                    {Moment(data.createdAt).format('MMMM D, YYYY')}
                  </span>
                </div>

                <h1 className="font-[Manrope] text-4xl font-extrabold leading-[1.02] tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                  {data.title}
                </h1>

                <div
                  className="mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg"
                  dangerouslySetInnerHTML={{ __html: data.subTitle }}
                />

                <div className="mt-7 flex items-center gap-3 text-white/80">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl">
                    <LuUserRound />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{authorName}</p>
                    <p className="text-sm text-white/70">
                      {Math.max(4, Math.ceil((normalizedCurrentBlog.plainDescription.length || 240) / 230))} min read
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 w-full px-4 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
            <article className="rounded-[2rem] bg-white/80 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:p-8 lg:p-10">
              <div className="mb-8 border-l-4 border-[#6D001A] bg-[#F7F2F3] px-5 py-4 text-base italic leading-8 text-[#444444]">
                "{normalizedCurrentBlog.plainSubtitle || 'Design becomes memorable when every detail feels intentional.'}"
              </div>

              <div
                className="rich-text max-w-none text-[15px] leading-8 text-[#1A1A1A]"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />

              <div className="mt-10 rounded-[1.5rem] bg-[#F5F5F5] p-5 sm:p-6">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#6D001A]">Reader actions</p>
                <BlogEngagement
                  blog={data}
                  onBlogUpdate={setData}
                  onCommentClick={scrollToComments}
                  showShare
                  className="gap-3"
                />
              </div>
            </article>

            <aside className="space-y-6">
              <div className="rounded-[2rem] bg-white/80 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6D001A]">About the author</p>
                <button
                  type="button"
                  onClick={() => writerProfilePath && navigate(writerProfilePath)}
                  className="mt-5 flex w-full items-center gap-3 text-left"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F2F3] text-xl text-[#6D001A]">
                    <LuUserRound />
                  </div>
                  <div>
                    <p className="font-[Manrope] text-xl font-extrabold tracking-[-0.04em] text-black">{authorName}</p>
                    <p className="text-sm font-semibold text-[#6D001A]">{writerUsername ? `@${writerUsername}` : 'DigitalEthereal'}</p>
                    <p className="mt-1 text-sm text-[#555555]">{data.category || 'Editorial writer'}</p>
                  </div>
                </button>
                <p className="mt-4 text-sm leading-7 text-[#444444]">
                  {data.writer?.description || 'Exploring thoughtful internet culture, digital product aesthetics, and the ideas shaping modern publishing.'}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {writerProfilePath && (
                    <button
                      type="button"
                      onClick={() => writerProfilePath && navigate(writerProfilePath)}
                      className="rounded-full bg-[#F7F2F3] px-4 py-2 text-sm font-semibold text-[#6D001A]"
                    >
                      View profile
                    </button>
                  )}
                  {writerId && (
                    <button
                      type="button"
                      onClick={handleFollowWriter}
                      disabled={isFollowingWriter}
                      className="rounded-full bg-[#6D001A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {isFollowingWriter ? 'Working...' : isFollowing ? 'Following' : 'Follow writer'}
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] bg-white/80 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6D001A]">Related stories</p>

                <div className="mt-5 space-y-4">
                  {relatedBlogs.length ? (
                    relatedBlogs.map((blog) => (
                      <button
                        key={blog._id}
                        type="button"
                        onClick={() => navigate(`/blog/${blog._id}`)}
                        className="block w-full rounded-[1.25rem] bg-[#F5F5F5] px-4 py-4 text-left transition hover:bg-[#EDEDED]"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6D001A]">{blog.category || 'Editorial'}</p>
                        <p className="mt-2 font-semibold leading-6 text-black">{blog.title}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#555555]">
                          Read article
                          <LuChevronRight />
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] bg-[#F5F5F5] px-4 py-5 text-sm leading-7 text-[#555555]">
                      More stories from this topic will appear here as the collection grows.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] bg-[#F7F2F3] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6D001A] shadow-[0_16px_32px_rgba(0,0,0,0.06)]">
                  <LuBookOpen />
                </div>
                <p className="mt-4 font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-black">
                  Join the conversation
                </p>
                <p className="mt-3 text-sm leading-7 text-[#444444]">
                  Save this article, share it, or leave a comment to keep the discussion moving.
                </p>
                <button
                  type="button"
                  onClick={scrollToComments}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#6D001A] px-5 py-3 text-sm font-bold text-white shadow-[0_20px_40px_rgba(109,0,26,0.18)]"
                >
                  <LuMessageSquareText />
                  Open comments
                </button>
              </div>
            </aside>
          </div>
        </section>

        <section id="blog-comments-section" className="mx-auto mt-10 w-full px-4 sm:px-6 lg:px-10">
          <div className="rounded-[2rem] bg-white/80 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:p-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6D001A]">Comments</p>
                <h2 className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-0.05em] text-black">
                  Reader discussion ({comments.length})
                </h2>

                <div className="mt-8 flex flex-col gap-4">
                  {comments.length ? (
                    comments.map((item, index) => (
                      <div key={index} className="rounded-[1.5rem] bg-[#F5F5F5] p-5 text-[#444444]">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6D001A] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                              <LuUserRound />
                            </div>
                            <div>
                              <p className="font-semibold text-black">{item.name}</p>
                              <p className="text-xs text-[#555555]">{Moment(item.createdAt).fromNow()}</p>
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-7">{item.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.5rem] bg-[#F5F5F5] p-5 text-sm leading-7 text-[#555555]">
                      No comments yet. Be the first person to add a thoughtful response to this piece.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6D001A]">Add your comment</p>
                <h3 className="mt-3 font-[Manrope] text-2xl font-extrabold tracking-[-0.04em] text-black">
                  Share your take
                </h3>

                {user ? (
                  <form onSubmit={addComment} className="mt-6 flex flex-col gap-4">
                    <input
                      value={user.name}
                      type="text"
                      readOnly
                      className="w-full rounded-2xl bg-[#F5F5F5] px-4 py-3 text-[#555555] outline-none"
                    />
                    <textarea
                      onChange={(event) => setContent(event.target.value)}
                      value={content}
                      placeholder="Write your thoughts..."
                      required
                      className="h-48 w-full rounded-2xl bg-[#F5F5F5] px-4 py-4 text-[#1A1A1A] outline-none placeholder:text-[#888888]"
                    />

                    <button
                      type="submit"
                      className="rounded-2xl bg-[#6D001A] px-6 py-4 font-bold text-white shadow-[0_20px_40px_rgba(109,0,26,0.18)]"
                    >
                      Submit comment
                    </button>
                  </form>
                ) : (
                  <div className="mt-6 rounded-[1.5rem] bg-[#F5F5F5] p-5">
                    <p className="text-sm leading-7 text-[#444444]">
                      Login to join the conversation, react to this article, and keep your saved reading list in sync.
                    </p>
                    <button
                      onClick={() => navigate('/auth', { state: { from: `/blog/${id}` } })}
                      className="mt-5 rounded-full bg-[#6D001A] px-6 py-3 font-semibold text-white"
                    >
                      Login / Signup
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
    </div>
  )
}

export default Blog