import React, { useEffect, useRef, useState } from 'react'
import { blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'
import { LuGlobe, LuLoader, LuSparkles, LuUpload, LuWand } from 'react-icons/lu'

const WriterAddBlog = () => {
  const { writerAxios } = useAppContext()
  const [isAdding, setIsAdding] = useState(false)
  const editorRef = useRef(null)
  const quillRef = useRef(null)
  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('Startup')
  const [isPublished, setIsPublished] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      if (!image) {
        toast.error('Please upload a thumbnail image')
        return
      }

      setIsAdding(true)
      const blog = {
        title,
        subTitle,
        description: quillRef.current ? quillRef.current.root.innerHTML : '',
        category,
        isPublished
      }

      const formData = new FormData()
      formData.append('blog', JSON.stringify(blog))
      formData.append('image', image)

      const { data } = await writerAxios.post('/api/blog/add', formData)

      if (data.success) {
        toast.success(data.message)
        setImage(false)
        setTitle('')
        setSubTitle('')
        if (quillRef.current) quillRef.current.root.innerHTML = ''
        setCategory('Startup')
        setIsPublished(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsAdding(false)
    }
  }

  const generateContent = async () => {
    try {
      if (!quillRef.current) return
      const currentContent = quillRef.current.root.innerHTML
      if (!currentContent || currentContent.trim() === '<p><br></p>' || currentContent.trim() === '') {
        toast.error('Please write initial content or notes first to generate with AI')
        return
      }

      setLoading(true)
      toast.loading('Generating content with AI...')

      const { data } = await writerAxios.post('/api/blog/generate', {
        currentContent: quillRef.current.getText(),
        title: title,
        category: category
      })

      if (data.success) {
        const currentHTML = quillRef.current.root.innerHTML
        const newContent = currentHTML + '<p>' + data.generatedContent + '</p>'
        quillRef.current.root.innerHTML = newContent
        toast.dismiss()
        toast.success(data.message || 'AI content generated successfully!')
      } else {
        toast.dismiss()
        toast.error(data.message)
      }
    } catch (error) {
      toast.dismiss()
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <div className="bg-white p-5 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-[#EDEDED] pb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6D001A]">Creator Suite</span>
          <h1 className="font-[Manrope] text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            Create New Story
          </h1>
          <p className="text-sm text-[#555555]">Craft a captivating piece and share your thoughts with the platform.</p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6 rounded-3xl border border-[#EDEDED] bg-white/90 p-6 shadow-sm sm:p-8">
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#444444]">
              Cover Image <span className="text-red-500">*</span>
            </label>
            <label
              htmlFor="image"
              className="group relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D9D9D9] bg-[#FAFAFA] p-6 text-center transition hover:border-[#6D001A] hover:bg-[#F7F2F3]"
            >
              {!image ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6D001A] shadow-sm transition group-hover:scale-110">
                    <LuUpload className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-[#444444]">Click to upload cover image</p>
                  <p className="text-xs text-[#888888]">PNG, JPG, or WEBP (Max 5MB)</p>
                </div>
              ) : (
                <div className="flex w-full max-w-md items-center justify-between rounded-xl border border-[#EDEDED] bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Thumbnail preview"
                      className="h-14 w-20 rounded-lg object-cover"
                    />
                    <div className="text-left">
                      <p className="max-w-[180px] truncate text-xs font-bold text-black">{image.name}</p>
                      <p className="text-[10px] text-[#888888]">{(image.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#F7F2F3] px-3 py-1 text-xs font-bold text-[#6D001A]">
                    Change
                  </span>
                </div>
              )}
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                accept="image/*"
                required
                hidden
              />
            </label>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#444444]">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Give your story a meaningful headline..."
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-2.5 text-sm text-black placeholder:text-[#888888] transition focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#444444]">
                Summary / Subtitle <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="A brief 1-2 sentence hook for the feed..."
                required
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                className="w-full rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-2.5 text-sm text-black placeholder:text-[#888888] transition focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
              />
            </div>
          </div>

          {/* Editor Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#444444]">
                Story Content <span className="text-red-500">*</span>
              </label>
              <button
                disabled={loading}
                type="button"
                onClick={generateContent}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#6D001A]/30 bg-[#F7F2F3] px-3.5 py-1 text-xs font-bold text-[#6D001A] transition hover:bg-[#6D001A] hover:text-white disabled:opacity-60"
              >
                {loading ? <LuLoader className="h-3.5 w-3.5 animate-spin" /> : <LuWand className="h-3.5 w-3.5" />}
                Generate with AI
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#D9D9D9] bg-white">
              <div ref={editorRef} className="min-h-[260px] text-black"></div>
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#444444]">
                Topic Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 py-2.5 text-sm text-black transition focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
              >
                <option value="">Select category</option>
                {blogCategories.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#444444]">
                Publishing Status
              </label>
              <label className="flex h-[42px] cursor-pointer items-center justify-between rounded-xl border border-[#D9D9D9] bg-[#FAFAFA] px-4 transition hover:bg-[#F5F5F5]">
                <div className="flex items-center gap-2">
                  <LuGlobe className="h-4 w-4 text-[#6D001A]" />
                  <span className="text-xs font-semibold text-black">Publish immediately to feed</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#6D001A]"
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              disabled={isAdding}
              type="submit"
              className="rounded-full bg-[#6D001A] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#4A0011] disabled:opacity-60"
            >
              {isAdding ? 'Publishing Story...' : isPublished ? 'Publish Live Story' : 'Save Story as Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriterAddBlog