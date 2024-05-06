import { createClient } from '@/utils/supabase/server';
import AiForm from './AiForm';

export default async function AiPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AiForm user={user} />;
}