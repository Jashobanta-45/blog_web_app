import React, { useEffect, useRef, useState } from 'react'
import { blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'
import { Sparkles, Upload, Wand2, Loader2, Globe } from 'lucide-react'

const AddBlog = () => {
  const { api } = useAppContext()
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

      const { data } = await api.post('/api/blog/add', formData)

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

      const { data } = await api.post('/api/blog/generate', {
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
    <div className="min-w-0 flex-1 bg-[#f6f6ff] p-4 md:p-8 xl:p-10">
      <div className="mx-auto max-w-5xl">
        <form onSubmit={onSubmitHandler} className="space-y-8 rounded-[2rem] bg-white/85 p-6 shadow-[0_20px_50px_rgba(39,46,66,0.06)] backdrop-blur-xl md:p-10">
          
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#702ae1]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#702ae1]">
              <Sparkles className="h-4 w-4" />
              Admin Portal
            </div>
            <h1 className="mt-3 font-[Manrope] text-3xl font-extrabold tracking-[-0.05em] text-slate-900 md:text-4xl">
              Add a new blog post
            </h1>
            <p className="mt-2 text-sm text-slate-500">Publish articles across the platform.</p>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Thumbnail image <span className="text-red-500">*</span>
            </label>
            <label htmlFor="image" className="group relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#dddff2] bg-[#f7f8ff] p-6 text-center transition hover:border-[#702ae1] hover:bg-[#f3f1ff]/50">
              {!image ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#702ae1] shadow-sm transition group-hover:scale-105">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">Click to upload thumbnail</p>
                  <p className="text-xs text-slate-400">SVG, PNG, JPG, or WEBP (Max 5MB)</p>
                </div>
              ) : (
                <div className="relative flex w-full max-w-md items-center justify-between rounded-xl bg-white p-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <img src={URL.createObjectURL(image)} alt="Thumbnail preview" className="h-16 w-24 rounded-lg object-cover" />
                    <div className="text-left">
                      <p className="max-w-[180px] truncate text-xs font-bold text-slate-800">{image.name}</p>
                      <p className="text-[11px] text-slate-400">{(image.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#702ae1]/10 px-3 py-1 text-xs font-semibold text-[#702ae1]">
                    Change
                  </span>
                </div>
              )}
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" required hidden />
            </label>
          </div>

          {/* Title & Subtitle */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Blog title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter a compelling title..."
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-[#dddff2] bg-[#f7f8ff] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#702ae1] focus:shadow-[0_0_0_3px_rgba(112,42,225,0.12)]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Sub title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Short summary or catchline..."
                required
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                className="w-full rounded-2xl border border-[#dddff2] bg-[#f7f8ff] px-4 py-3.5 text-slate-900 outline-none transition focus:border-[#702ae1] focus:shadow-[0_0_0_3px_rgba(112,42,225,0.12)]"
              />
            </div>
          </div>

          {/* Editor Section */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Blog content <span className="text-red-500">*</span>
              </label>
              <button
                disabled={loading}
                type="button"
                onClick={generateContent}
                className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_20px_rgba(112,42,225,0.18)] transition hover:opacity-95 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Generate with AI
              </button>
            </div>
            <div className="w-full overflow-hidden rounded-2xl border border-[#dddff2] bg-white">
              <div ref={editorRef} className="min-h-[260px] text-slate-800"></div>
            </div>
          </div>

          {/* Category & Publish Options */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-[#dddff2] bg-[#f7f8ff] px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-[#702ae1]"
                >
                  <option value="">Select category</option>
                  {blogCategories.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Publish settings
              </label>
              <label className="flex h-[52px] cursor-pointer items-center justify-between rounded-2xl border border-[#dddff2] bg-[#f7f8ff] px-4 transition hover:bg-[#f0edff]">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-[#702ae1]" />
                  <span className="text-sm font-semibold text-slate-800">Publish immediately</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded accent-[#702ae1]"
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              disabled={isAdding}
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#702ae1,#b28cff)] px-8 text-sm font-bold text-white shadow-[0_18px_34px_rgba(112,42,225,0.2)] transition hover:opacity-95 disabled:opacity-60"
            >
              {isAdding ? 'Publishing story...' : 'Publish Blog Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBlog
