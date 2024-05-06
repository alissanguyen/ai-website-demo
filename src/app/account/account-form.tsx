'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import "./AccountForm.css"
import Avatar from './avatar'
import { useRouter } from 'next/navigation'

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      console.log('Error loading user data!');
      router.push("/account/notfound")
    } finally {
      setLoading(false)
    }
  }, [user, supabase, router])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="AccountForm form-widget text-white max-w-screen-lg m-auto mt-14">
      <main className='flex-1 md:p-0 lg:pt-8 lg:px-8 md:ml-24 flex flex-col'>
        <section className='p-10 shadow-black shadow-sm bg-slate-900/20'>

          <div className="md:flex-1 mt-2 mb:mt-0 md:px-3">
            <div className="mb-6">
              <label htmlFor="email" className='AccountForm__Label'>Email</label>
              <input className='AccountForm__Input Email' id="email" type="text" value={user?.email} disabled />
            </div>

            <div className="mb-6">
              <label htmlFor="fullName" className='AccountForm__Label'>Full Name</label>
              <input
                className='AccountForm__Input'
                id="fullName"
                type="text"
                value={fullname || ''}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="username" className='AccountForm__Label'>Username</label>
              <input
                className='AccountForm__Input'
                id="username"
                type="text"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <Avatar
            uid={user?.id ?? null}
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url)
              updateProfile({ fullname, username, website, avatar_url: url })
            }}
          />
          <div className='flex flex-col mt-5 xs:mt-0 xs:flex-row xs:items-center justify-between'>
            <div className='p-3'>
              <button
                className="button primary block px-10 py-4 rounded-lg bg-slate-700/40 hover:bg-slate-700 hover:text-yellow-300 border-2 border-yellow-400/[0] hover:border-2 hover:border-yellow-400/[1] ease-in-out duration-200"
                onClick={() => updateProfile({ fullname, username, website, avatar_url })}
                disabled={loading}
              >
                {loading ? 'Loading ...' : 'Update'}
              </button>
            </div>

            <div className='p-3'>
              <form action="/auth/signout" method="post">
                <button className="button block px-10 py-4 bg-orange-400/30 rounded-lg hover:bg-orange-400 hover:text-black ease-in-out duration-200" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}