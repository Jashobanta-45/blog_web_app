import React from 'react'
import { LuMail, LuNewspaper, LuSparkles } from 'react-icons/lu'
import { useAppContext } from '../context/useAppContext'

const newsletterHighlights = [
  'Weekly editorial digest from the latest stories',
  'Fresh design, startup, and technology reads',
  'No spam, only thoughtful updates worth opening'
]

const Newsletter = ({ containerClassName = '' }) => {
  const { navigate } = useAppContext()

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section id="newsletter-section" className="bg-white pb-10">
      <div className={`relative overflow-hidden rounded-[2.5rem] border border-[#EDEDED] bg-[#FAFAFA] px-6 py-12 sm:px-10 lg:px-16 lg:py-16 ${containerClassName}`}>
        <div className="absolute -left-12 -top-16 h-52 w-52 rounded-full bg-[#6D001A]/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-black/5 blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
         

            <h2 className="mt-5 font-[Manrope] text-4xl font-extrabold tracking-[-0.05em] text-black sm:text-5xl">
              Stay in the loop without losing the vibe.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#444444]">
              Subscribe to get a clean weekly drop of standout stories, internet thinking, and editorial picks from the platform delivered straight to your inbox.
            </p>

            <div className="mt-8 grid gap-3">
              {newsletterHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[#EDEDED] bg-white px-4 py-4 text-sm text-[#444444] shadow-[0_18px_36px_rgba(0,0,0,0.04)]"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F2F3] text-[#6D001A]">
                    <LuSparkles className="text-sm" />
                  </span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] border border-[#EDEDED] bg-white p-6 shadow-[0_28px_60px_rgba(0,0,0,0.06)] sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6D001A] text-2xl text-white shadow-[0_20px_40px_rgba(109,0,26,0.2)]">
              <LuMail />
            </div>

            <h3 className="mt-6 font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-black">
              Get the next issue
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#555555]">
              Enter your email to receive curated reads, feature drops, and a short digest of what is worth your attention this week.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#444444]">Email address</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-[#D9D9D9] bg-[#FAFAFA] px-5 py-4 text-black outline-none transition placeholder:text-[#888888] focus:border-[#6D001A] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,0,26,0.12)]"
                  required
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#6D001A] px-6 py-4 font-bold text-white shadow-[0_20px_40px_rgba(109,0,26,0.2)] transition hover:-translate-y-0.5 hover:bg-[#4A0011]"
              >
                Subscribe to newsletter
              </button>
            </form>

            <div className="mt-5 flex flex-col gap-3 text-sm text-[#555555] sm:flex-row sm:items-center sm:justify-between">
              <p>No spam. Unsubscribe anytime.</p>
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="text-left font-semibold text-[#6D001A] transition hover:text-[#4A0011]"
              >
                Already a reader? Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter