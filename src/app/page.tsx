"use client"

import HomePageAnimation from "@/components/HomePageAnimation/HomePageAnimation";
import useAuth from "@/hooks/useAuth";
import { UserProfile } from "@/types/types";
import { supabaseClient } from "@/utils/supabase/client";
import * as React from "react"

export default function Home() {
  const userId: string | null = useAuth();
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>()
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId) {

        const { data, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUserProfile(data)
          // Fetch the avatar URL from Supabase storage
          const { data: avatarData, error: avatarError } = await supabaseClient
            .storage
            .from('avatars')
            .download(data.avatar_url);

          if (avatarError) {
            console.error('Error fetching avatar URL:', avatarError);
          } else {
            // Create a URL for the downloaded avatar image
            const avatarUrl = URL.createObjectURL(avatarData);
            setAvatarUrl(avatarUrl);
          }
        }
      }
    };

    fetchUserProfile();

  }, [userId]);
  return (
    <div className="w-full text-white p-10 h-[inherit]">
      <p className="Welcome__Text text-xl font-medium" > Welcome.</p>
      <HomePageAnimation />
      {
        userId ?
          <p className="HomePage__WelcomeMessage">Click <a className="underline underline-offset-2 text-cyan-300" href="/ai">here</a> to start chatting with our AI models</p> : <a href="/login">
            <button className="HomePage__LoginButton rounded-full text-lg bg-slate-800 px-14 py-4 hover:text-cyan-300 hover:bg-slate-900/60 border-2 border-yellow-400/[0] hover:border-2 hover:border-cyan-400/[1] ease-in-out duration-200">Login</button>
          </a >
      }
    </div >
  );
}
