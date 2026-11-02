import React, { useMemo } from 'react'
import { LuGithub, LuTwitter, LuLinkedin, LuInstagram, LuArrowRight, LuMail, LuSparkles } from 'react-icons/lu'
import { blogCategories } from '../assets/assets'
import { useAppContext } from '../context/useAppContext'

const Footer = ({ containerClassName = '' }) => {
  const { blogs, user, writerToken, navigate } = useAppContext()

  const visibleCategories = useMemo(() => {
    const dynamicCategories = blogs
      .map((blog) => blog.category)
      .filter(Boolean)
      .filter((category, index, allCategories) => allCategories.indexOf(category) === index)

    return ['All', ...blogCategories.filter((category) => category !== 'All'), ...dynamicCategories].filter(
      (category, index, allCategories) => allCategories.indexOf(category) === index
    )
  }, [blogs])

  return (
    <footer id="site-footer" className="mt-16 border-t border-[#EDEDED] bg-white/70 backdrop-blur-lg">
      <div className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 ${containerClassName}`}>
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Mission Column */}
          <div className="space-y-6 lg:col-span-4">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                navigate('/')
              }}
              className="flex items-center text-2xl font-black tracking-tight text-black sm:text-3xl"
            >
              <span className="font-[Manrope] font-extrabold tracking-tight text-black">Digital</span>
              <span className="ml-1.5 font-[Manrope] font-extrabold italic text-[#6D001A]">Ethereal</span>
            </button>

            <p className="max-w-sm text-sm leading-relaxed text-[#444444]">
              A refined editorial publication and open space for curious minds exploring design, technology,
              culture, and forward-looking internet thinking.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: <LuTwitter className="h-4 w-4" />, label: 'Twitter', href: 'https://twitter.com' },
                { icon: <LuGithub className="h-4 w-4" />, label: 'GitHub', href: 'https://github.com' },
                { icon: <LuLinkedin className="h-4 w-4" />, label: 'LinkedIn', href: 'https://linkedin.com' },
                { icon: <LuInstagram className="h-4 w-4" />, label: 'Instagram', href: 'https://instagram.com' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9D9D9] bg-white text-[#444444] shadow-sm transition hover:border-[#6D001A] hover:bg-[#6D001A] hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Live Publication Status */}
            
          </div>

          {/* Navigation Links Column */}
          <div className="space-y-4 lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">Platform</h3>
            <ul className="space-y-2.5 text-sm text-[#444444]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    navigate('/')
                  }}
                  className="transition hover:text-[#6D001A]"
                >
                  Explore Feed
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                    navigate('/about')
                  }}
                  className="transition hover:text-[#6D001A]"
                >
                  About Platform
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(user ? '/following' : '/auth')}
                  className="transition hover:text-[#6D001A]"
                >
                  Following Stories
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/writers')} className="transition hover:text-[#6D001A]">
                  Featured Writers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(user ? '/profile' : '/auth')}
                  className="transition hover:text-[#6D001A]"
                >
                  {user ? 'My Profile' : 'Reader Login'}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/writer')} className="font-semibold text-[#6D001A] transition hover:underline">
                  {writerToken ? 'Writer Dashboard' : 'Become a Writer'}
                </button>
              </li>
            </ul>
          </div>

          {/* Topics / Categories Column */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">Explore Topics</h3>
            <ul className="space-y-2.5 text-sm text-[#444444]">
              {visibleCategories.slice(0, 5).map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/')
                      setTimeout(() => {
                        document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    }}
                    className="transition hover:text-[#6D001A]"
                  >
                    {category === 'All' ? 'All Stories' : category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box / Editorial Column */}
          <div className="space-y-4 lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">The Weekly Edition</h3>
            <p className="text-xs leading-relaxed text-[#444444]">
              Subscribe to get our top stories and essays delivered to your inbox every Sunday morning.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const inputEl = e.currentTarget.querySelector('input')
                if (inputEl?.value) {
                  alert('Thank you for subscribing to Digital Ethereal!')
                  inputEl.value = ''
                }
              }}
              className="space-y-2"
            >
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full rounded-full border border-[#D9D9D9] bg-white py-2.5 pl-4 pr-10 text-xs text-black placeholder:text-[#888888] shadow-sm focus:border-[#6D001A] focus:outline-none focus:ring-1 focus:ring-[#6D001A]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#6D001A] text-white shadow-sm transition hover:bg-[#4A0011]"
                >
                  <LuArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-[#888888]">No spam, ever. Unsubscribe with one click.</p>
            </form>
          </div>
        </div>

        {/* Bottom Bar Divider & Copyright */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#EDEDED] pt-8 text-xs text-[#555555] sm:flex-row">
          <p>© {new Date().getFullYear()} Digital Ethereal. Built for thoughtful readers and writers.</p>

          <div className="flex items-center gap-6">
            <button type="button" onClick={() => navigate('/#site-footer')} className="transition hover:text-black">
              Privacy Policy
            </button>
            <button type="button" onClick={() => navigate('/#site-footer')} className="transition hover:text-black">
              Terms of Service
            </button>
            <button type="button" onClick={() => navigate('/#site-footer')} className="transition hover:text-black">
              Editorial Guidelines
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer