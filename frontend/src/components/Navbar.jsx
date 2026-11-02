import React, { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAppContext } from '../context/useAppContext'

const Navbar = ({ containerClassName = '' }) => {
  const { navigate, writerToken, user } = useAppContext()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  const handleNavigate = (path, options) => {
    navigate(path, options)
    setIsSidebarOpen(false)
  }

  const isCurrent = (path) => location.pathname === path

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#EDEDED] bg-white/85 backdrop-blur-md transition-colors duration-200">
        <div className={`flex h-18 items-center justify-between ${containerClassName}`}>
          {/* Left section: Hamburger (mobile), Bigger Logo, and Nav Options */}
          <div className="flex items-center gap-6 lg:gap-10">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center border border-[#D9D9D9] bg-white text-black transition hover:bg-[#F5F5F5] hover:text-[#6D001A] lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="group flex items-center text-2xl font-black tracking-tight text-black sm:text-4xl"
            >
              <span className="font-[Manrope] font-extrabold tracking-tight text-black">Digital</span>
              <span className="ml-1.5 font-[Manrope] font-extrabold italic text-[#6D001A]">Ethereal</span>
            </button>

            {/* Nav options on the left next to website name */}
            <nav className="hidden items-center gap-7 text-[15px] font-medium text-[#444444] lg:flex" aria-label="Main navigation">
              <button
                type="button"
                onClick={() => location.pathname === '/' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')}
                className={`relative py-1 tracking-tight transition hover:text-black ${
                  isCurrent('/') ? 'font-bold text-black' : 'text-[#444444]'
                }`}
              >
                Explore
                {isCurrent('/') && (
                  <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-[#6D001A]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(user ? '/following' : '/auth', user ? undefined : { state: { from: '/following' } })}
                className={`relative py-1 tracking-tight transition hover:text-black ${
                  isCurrent('/following') ? 'font-bold text-black' : 'text-[#444444]'
                }`}
              >
                Following
                {isCurrent('/following') && (
                  <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-[#6D001A]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/#newsletter-section')}
                className="py-1 tracking-tight text-[#444444] transition hover:text-black"
              >
                Newsletter
              </button>
              <button
                type="button"
                onClick={() => navigate('/about')}
                className={`relative py-1 tracking-tight transition hover:text-black ${
                  isCurrent('/about') ? 'font-bold text-black' : 'text-[#444444]'
                }`}
              >
                About
                {isCurrent('/about') && (
                  <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-[#6D001A]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/writers')}
                className={`relative py-1 tracking-tight transition hover:text-black ${
                  isCurrent('/writers') ? 'font-bold text-black' : 'text-[#444444]'
                }`}
              >
                Writers
                {isCurrent('/writers') && (
                  <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-[#6D001A]" />
                )}
              </button>
            </nav>
          </div>

          {/* Right section: Rounded Login and Writer buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => navigate(user ? '/profile' : '/auth')}
              className="rounded-full border border-[#D9D9D9] bg-white/90 px-5 py-2 text-sm font-semibold text-black shadow-sm transition hover:border-[#888888] hover:bg-[#F5F5F5] hover:text-[#6D001A]"
            >
              {user ? user.name : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/writer')}
              className="rounded-full bg-[#6D001A] px-6 py-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(109,0,26,0.25)] transition hover:bg-[#4A0011] hover:-translate-y-0.5"
            >
              {writerToken ? 'Dashboard' : 'Writer'}
            </button>
          </div>

          {/* Mobile Right: Rounded Login button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => handleNavigate(user ? '/profile' : '/auth')}
              className="rounded-full border border-[#D9D9D9] bg-white px-4 py-1.5 text-xs font-semibold text-black transition hover:bg-[#F5F5F5] shadow-sm"
            >
              {user ? 'Profile' : 'Login'}
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[70] transition-opacity duration-300 ${isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          aria-label="Close navigation overlay"
        />

        <aside className={`absolute left-0 top-0 flex h-full w-[85%] max-w-xs flex-col border-r border-[#D9D9D9] bg-white px-6 py-6 shadow-2xl transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between border-b border-[#EDEDED] pb-5">
            <button
              type="button"
              onClick={() => handleNavigate('/')}
              className="flex items-center text-xl font-bold tracking-tight text-black"
            >
              <span className="font-[Manrope] font-extrabold text-black">Digital</span>
              <span className="ml-1 font-[Manrope] font-extrabold italic text-[#6D001A]">Ethereal</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="flex h-9 w-9 items-center justify-center border border-[#D9D9D9] bg-[#FAFAFA] text-black transition hover:bg-[#F5F5F5]"
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 flex flex-col divide-y divide-[#EDEDED]">
            <button
              type="button"
              onClick={() => {
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  setIsSidebarOpen(false)
                } else {
                  handleNavigate('/')
                }
              }}
              className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-[#444444] transition hover:text-[#6D001A]"
            >
              Explore
            </button>
            <button
              type="button"
              onClick={() => handleNavigate(user ? '/following' : '/auth', user ? undefined : { state: { from: '/following' } })}
              className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-[#444444] transition hover:text-[#6D001A]"
            >
              Following
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/#newsletter-section')}
              className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-[#444444] transition hover:text-[#6D001A]"
            >
              Newsletter
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/about')}
              className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-[#444444] transition hover:text-[#6D001A]"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/writers')}
              className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-[#444444] transition hover:text-[#6D001A]"
            >
              Writers
            </button>
            <button
              type="button"
              onClick={() => handleNavigate(user ? '/profile' : '/auth')}
              className="flex w-full items-center justify-between py-3.5 text-left text-sm font-medium text-[#444444] transition hover:text-[#6D001A]"
            >
              {user ? 'Profile' : 'Login'}
            </button>
          </div>

          <div className="mt-auto border border-[#D9D9D9] bg-[#FAFAFA] p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6D001A]">Writer Tools</p>
            <p className="mt-2 font-[Manrope] text-lg font-bold tracking-tight text-black">
              {writerToken ? 'Author Dashboard' : 'Become a Writer'}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#555555]">
              Publish stories, interact with readers, and manage your articles.
            </p>
            <button
              type="button"
              onClick={() => handleNavigate('/writer')}
              className="mt-4 w-full border border-[#6D001A] bg-[#6D001A] py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#4A0011]"
            >
              {writerToken ? 'Open Dashboard' : 'Start Writing'}
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}

export default Navbar