import { createClient } from '@/utils/supabase/server';
import AiForm from './AiForm';
import { redirect } from 'next/navigation';

export default async function AiPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  
  return <AiForm user={user} />;
}