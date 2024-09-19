"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/user");
  }, [router]);

  return (
    <main className="absolute inset-0 -z-10 flex items-center justify-center">
      <Spinner />
    </main>
  );
}
