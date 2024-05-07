import { toast } from '@/components/ui/use-toast'
import supabase from '@/config/supabaseClient'
import { create } from 'zustand'

interface IProfile {
  profile: any
  setProfile: (by: any) => void
  getUser: () => void
}
export const useProfile = create<IProfile>()((set) => ({
  profile: JSON.parse(localStorage.getItem('profile') || '{}'),
  setProfile: (profile) => {
    set({ profile });
    localStorage.setItem('profile', JSON.stringify(profile));
  },
  // role: JSON.parse(localStorage.getItem('role') || 'defaultRole'),
  // setRole: (roles) => {
  //     const role = roles[0]
  //     set({ role });
  //     localStorage.setItem('role', JSON.stringify(role));
  // },
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