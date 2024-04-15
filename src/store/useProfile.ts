import { toast } from '@/components/ui/use-toast'
import supabase from '@/config/supabaseClient'
import { create } from 'zustand'

interface IProfile {
  profile: any
  setProfile: (by: any) => void
  getUser: () => void
}

export const useProfile = create<IProfile>()((set) => ({
  profile: {},
  setProfile: (by) => set((state) => ({ profile: by })),
  getUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error: " + error.message,
      })
    }
    if (user) {
      set(() => ({ profile: user }))
    }
  }
}))