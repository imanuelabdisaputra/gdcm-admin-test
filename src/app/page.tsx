'use client'

import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import Spinner from '@/components/ui/spinner'
import supabase from '@/config/supabaseClient';
import { toast } from '@/components/ui/use-toast';

export default function Home() {
  const router = useRouter()

  const getUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error: " + error.message,
      })
      router.push('/auth/login')
    }
    if (user) {
      router.push('/user')
    }
  }

  useEffect(() => {
    getUser()
  });

  return (
    <main className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center -z-10">
      <Spinner />
    </main>
  );
}
