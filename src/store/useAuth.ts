import { toast } from '@/components/ui/use-toast'
import supabase from '@/config/supabaseClient'
import { create } from 'zustand'

interface IProfile {
  logout: (router: any) => void
}

export const useAuth = create<IProfile>()((set) => ({
  logout: async (router) => {
    let { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error: " + error.message,
      })
    } else {
      localStorage.clear()
      router.push("/auth/login")
    }
  },
}))