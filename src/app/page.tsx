'use client'

import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import Spinner from '@/components/ui/spinner'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/user')
  });

  return (
    <main className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center -z-10">
      <Spinner />
    </main>
  );
}
