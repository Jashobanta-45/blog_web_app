import React, { useEffect, useState } from 'react'
import { LuArrowRight, LuBookOpen, LuSearch, LuSparkles, LuUsers } from 'react-icons/lu'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppContext } from '../context/useAppContext'

const Writers = () => {
  const { api, navigate } = useAppContext()
  const [writers, setWriters] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        setIsLoading(true)
        const query = searchValue.trim() ? `?q=${encodeURIComponent(searchValue.trim())}` : ''
        const { data } = await api.get(`/api/writer/public${query}`)

        if (!data.success) {
          throw new Error(data.message)
        }

        setWriters(data.writers)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = window.setTimeout(fetchWriters, searchValue.trim() ? 250 : 0)
    return () => window.clearTimeout(timeoutId)
  }, [api, searchValue])

  return (
    <div className="ethereal-shell min-h-screen overflow-x-clip bg-white">
      <div className="ethereal-orb ethereal-orb-primary" />
      <div className="ethereal-orb ethereal-orb-secondary" />

      <Navbar containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-10">
        {/* Header Section */}
        <div className="mb-10 space-y-4 border-b border-[#EDEDED] pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full bg-[#F7F2F3] px-3.5 py-1 text-xs font-bold text-[#6D001A]">
                Author Network
              </div>
              <h1 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.04em] text-black sm:text-4xl lg:text-5xl">
                Explore Writers
              </h1>
              <p className="max-w-2xl text-base text-[#555555] sm:text-lg">
                Discover independent creators, essayists, and specialists publishing stories on Digital Ethereal.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-72 lg:w-80 flex-shrink-0">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search by name, username..."
                className="w-full rounded-full border border-[#D9D9D9] bg-white/90 py-2.5 pl-4 pr-11 text-sm text-black placeholder:text-[#888888] shadow-sm transition hover:border-[#888888] focus:border-[#6D001A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D001A]/15"
              />
              <LuSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-[#888888]" />
            </div>
          </div>
        </div>

        {/* Writers Directory Grid */}
        <section>
          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader />
            </div>
          ) : writers.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {writers.map((writer) => (
                <article
                  key={writer._id}
                  onClick={() => navigate(`/writers/${writer.username}`)}
                  className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#EDEDED] bg-white/90 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#6D001A]/40 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6D001A] text-xl font-bold text-white shadow-sm">
                        {writer.name?.charAt(0)?.toUpperCase() || 'W'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate font-[Manrope] text-lg font-bold text-black transition group-hover:text-[#6D001A]">
                          {writer.name}
                        </h2>
                        <p className="truncate text-xs font-semibold text-[#6D001A]">@{writer.username}</p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#444444]">
                      {writer.description || 'Contributing author sharing insights on technology, culture, and design.'}
                    </p>
                  </div>

                  <div className="mt-6">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#EDEDED] bg-[#FAFAFA] p-3 text-center">
                      <div>
                        <p className="font-[Manrope] text-base font-bold text-black">{writer.stats?.followers || 0}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Followers</p>
                      </div>
                      <div>
                        <p className="font-[Manrope] text-base font-bold text-black">{writer.stats?.blogs || 0}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Stories</p>
                      </div>
                      <div>
                        <p className="font-[Manrope] text-base font-bold text-black">{writer.stats?.reads || 0}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Reads</p>
                      </div>
                    </div>

                    {/* View Profile Action */}
                    <div className="mt-4 flex items-center justify-between pt-2 text-xs font-bold text-[#6D001A]">
                      <span>View Profile & Stories</span>
                      <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#EDEDED] bg-white/70 px-8 py-16 text-center backdrop-blur-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2F3] text-xl text-[#6D001A]">
                <LuBookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-[Manrope] text-2xl font-extrabold text-black">
                No writers matched "{searchValue}"
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#555555]">
                Try searching for another keyword or clear your search query to view all authors.
              </p>
              <button
                type="button"
                onClick={() => setSearchValue('')}
                className="mt-6 rounded-full bg-[#6D001A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#4A0011]"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer containerClassName="mx-auto w-full px-4 sm:px-6 lg:px-10" />
    </div>
  )
}

export default Writers