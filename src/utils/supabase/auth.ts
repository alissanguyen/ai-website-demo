"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

interface LoginFormData {
  email: string;
  password: string;
}
export async function login(data: LoginFormData) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error.message, "IN LOGIN HEHEHEHEHE")
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/account");
}

interface SignUpFormData {
  email: string;
  password: string;
}

export async function signup(data: SignUpFormData) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error)

    if (error.message === "Email rate limit exceeded") {
      redirect("/error/emailLimit");
    } else {
      redirect("/error");
    }
  }
  revalidatePath("/", "layout");
  redirect("/account");

}

export async function checkAuth(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
      return user.id;
  } else {
      return null;
  }
}
