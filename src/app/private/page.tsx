import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <p>Hello {data.user.email}</p>
}

/**
 * Server Components can read cookies, so you can get the Auth status 
 * and user info.
 * 
 * Since you're calling Supabase from a Server Component, use the client 
 * created in @/utils/supabase/server.ts.
 * 
 * Create a private page that users can only access if they're logged in. 
 * The page displays their email.
 * 
 * https://supabase.com/docs/guides/auth/server-side/nextjs
 */