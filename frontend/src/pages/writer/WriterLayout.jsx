import { useEffect, useState } from 'react'
import { LuMenu, LuUserCheck } from 'react-icons/lu'
import { Outlet } from 'react-router-dom'
import WriterSidebar from '../../components/writer/WriterSidebar'
import { useAppContext } from '../../context/useAppContext'

const WriterLayout = () => {
  const { writer, navigate } = useAppContext()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Minimal Writer Topbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#EDEDED] bg-white/85 backdrop-blur-md">
        <div className="flex h-18 items-center justify-between px-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center border border-[#D9D9D9] bg-white text-black transition hover:bg-[#F5F5F5] hover:text-[#6D001A] md:hidden"
              aria-label="Open writer sidebar"
            >
              <LuMenu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="group flex items-center text-2xl font-black tracking-tight text-black sm:text-3xl"
            >
              <span className="font-[Manrope] font-extrabold tracking-tight text-black">Digital</span>
              <span className="ml-1.5 font-[Manrope] font-extrabold italic text-[#6D001A]">Ethereal</span>
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#6D001A]/25 bg-[#F7F2F3] px-3 py-1 text-xs font-bold text-[#6D001A]">
              Writer Studio
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/writer/profile')}
              className="flex items-center gap-3 rounded-full border border-[#D9D9D9] bg-white/90 py-1.5 pl-3 pr-4 shadow-sm transition hover:border-[#888888] hover:bg-[#F5F5F5]"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6D001A] text-xs font-bold text-white">
                {(writer?.name || 'W').charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-black">{writer?.name || 'Writer'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-72px)]">
        <WriterSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default WriterLayout