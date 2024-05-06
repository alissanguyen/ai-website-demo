"use client"

import HomePageAnimation from "@/components/HomePageAnimation/HomePageAnimation";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";

export default function Home() {
  const { userId } = useContext(UserContext);

  return (
    <div className="w-full text-white p-10 h-[inherit]">
      <p className="Welcome__Text text-xl font-medium">Welcome.</p>
      <HomePageAnimation />
      {userId ? (
        <p className="HomePage__WelcomeMessage">
          Click{" "}
          <a
            className="underline underline-offset-2 text-cyan-300"
            href="/ai"
          >
            here
          </a>{" "}
          to start chatting with our AI models
        </p>
      ) : (
        <a href="/login">
          <button className="HomePage__LoginButton rounded-full text-lg bg-slate-800 px-14 py-4 hover:text-cyan-300 hover:bg-slate-900/60 border-2 border-yellow-400/[0] hover:border-2 hover:border-cyan-400/[1] ease-in-out duration-200">
            Login
          </button>
        </a>
      )}
    </div>
  );
}