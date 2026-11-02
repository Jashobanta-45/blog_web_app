import React from 'react'
import { Bookmark, Heart, LogOut, MessageSquareText, UserRound, X } from 'lucide-react'
import { useAppContext } from '../context/useAppContext'

const UserSidebar = ({ activeSection, setActiveSection, stats, isOpen, setIsOpen }) => {
  const { logoutUser, navigate, user } = useAppContext()

  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-30 bg-black/35 backdrop-blur-sm transition md:hidden ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-label='Close user sidebar overlay'
      />

    <div className={`fixed left-0 top-0 z-40 flex h-[100dvh] w-[84%] max-w-[280px] flex-col border-r border-[#EDEDED] bg-white/95 pt-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-transform duration-300 md:static md:h-auto md:min-h-[calc(100vh-76px)] md:w-auto md:max-w-none md:flex-shrink-0 md:self-stretch md:translate-x-0 md:bg-white/82 md:shadow-[0_18px_40px_rgba(0,0,0,0.04)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className='mb-4 flex items-center justify-between px-4 md:hidden'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#888888]'>User menu</p>
          <p className='mt-1 text-sm font-semibold text-black'>{user?.name || 'User'}</p>
        </div>
        <button
          type='button'
          onClick={() => setIsOpen(false)}
          className='flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F2F3] text-[#6D001A]'
          aria-label='Close user sidebar'
        >
          <X className='h-5 w-5' />
        </button>
      </div>

      <button
        type='button'
        onClick={() => {
          setActiveSection('overview')
          setIsOpen(false)
        }}
        className={`flex items-center gap-3 px-3 py-3.5 text-sm font-semibold transition md:min-w-64 md:px-9 ${activeSection === 'overview' ? 'border-r-4 border-[#6D001A] bg-[#F7F2F3] text-[#6D001A]' : 'text-[#444444] hover:bg-[#F5F5F5]'}`}
      >
        <UserRound className='h-5 w-5' />
        <span>Profile</span>
      </button>

      <button
        type='button'
        onClick={() => {
          setActiveSection('liked')
          setIsOpen(false)
        }}
        className={`flex items-center justify-between gap-3 px-3 py-3.5 text-sm font-semibold transition md:min-w-64 md:px-9 ${activeSection === 'liked' ? 'border-r-4 border-[#6D001A] bg-[#F7F2F3] text-[#6D001A]' : 'text-[#444444] hover:bg-[#F5F5F5]'}`}
      >
        <span className='flex items-center gap-3'>
          <Heart className='h-5 w-5' />
          <span>Liked blogs</span>
        </span>
        <span className='text-xs'>{stats.liked}</span>
      </button>

      <button
        type='button'
        onClick={() => {
          setActiveSection('saved')
          setIsOpen(false)
        }}
        className={`flex items-center justify-between gap-3 px-3 py-3.5 text-sm font-semibold transition md:min-w-64 md:px-9 ${activeSection === 'saved' ? 'border-r-4 border-[#6D001A] bg-[#F7F2F3] text-[#6D001A]' : 'text-[#444444] hover:bg-[#F5F5F5]'}`}
      >
        <span className='flex items-center gap-3'>
          <Bookmark className='h-5 w-5' />
          <span>Saved blogs</span>
        </span>
        <span className='text-xs'>{stats.saved}</span>
      </button>

      <button
        type='button'
        onClick={() => {
          setActiveSection('comments')
          setIsOpen(false)
        }}
        className={`flex items-center justify-between gap-3 px-3 py-3.5 text-sm font-semibold transition md:min-w-64 md:px-9 ${activeSection === 'comments' ? 'border-r-4 border-[#6D001A] bg-[#F7F2F3] text-[#6D001A]' : 'text-[#444444] hover:bg-[#F5F5F5]'}`}
      >
        <span className='flex items-center gap-3'>
          <MessageSquareText className='h-5 w-5' />
          <span>Comments</span>
        </span>
        <span className='text-xs'>{stats.comments}</span>
      </button>

      <button
        type='button'
        onClick={() => {
          logoutUser()
          navigate('/')
          setIsOpen(false)
        }}
        className='mx-3 mb-6 mt-auto flex items-center justify-center gap-2 rounded-2xl border border-[#D9D9D9] bg-white px-4 py-3 text-sm font-semibold text-[#6D001A] transition hover:bg-[#F7F2F3] md:mx-9'
      >
        <LogOut className='h-4 w-4' />
        Logout
      </button>
    </div>
    </>
  )
}

export default UserSidebar