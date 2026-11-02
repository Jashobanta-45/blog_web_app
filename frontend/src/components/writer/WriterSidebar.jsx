import React from 'react'
import {
  LuLayoutDashboard,
  LuList,
  LuLogOut,
  LuMessageSquare,
  LuSquarePen,
  LuUser,
  LuX
} from 'react-icons/lu'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../../context/useAppContext'

const WriterSidebar = ({ isOpen, setIsOpen }) => {
  const { logoutWriter, navigate } = useAppContext()

  const navItems = [
    { to: '/writer', label: 'Dashboard', icon: <LuLayoutDashboard className="h-4 w-4" />, end: true },
    { to: '/writer/addBlog', label: 'Create Story', icon: <LuSquarePen className="h-4 w-4" /> },
    { to: '/writer/listBlog', label: 'My Stories', icon: <LuList className="h-4 w-4" /> },
    { to: '/writer/comments', label: 'Comments', icon: <LuMessageSquare className="h-4 w-4" /> },
    { to: '/writer/profile', label: 'Writer Profile', icon: <LuUser className="h-4 w-4" /> }
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Close writer sidebar overlay"
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[80%] max-w-[260px] flex-col border-r border-slate-200/80 bg-white/95 p-5 backdrop-blur-xl transition-transform duration-300 md:sticky md:top-[72px] md:z-30 md:h-[calc(100vh-72px)] md:w-64 md:flex-shrink-0 md:translate-x-0 md:overflow-y-auto md:bg-white/90 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 md:hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-[#702ae1]">Writer Menu</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-slate-50 text-slate-600"
            aria-label="Close writer sidebar"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              end={item.end}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#ede9fe] text-[#702ae1] shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Action */}
        <div className="mt-auto border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => {
              logoutWriter()
              navigate('/')
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
          >
            <LuLogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default WriterSidebar
