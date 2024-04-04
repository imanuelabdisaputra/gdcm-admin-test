import { create } from 'zustand'

interface IProfile {
  profile: any
  setProfile: (by: any) => void
}

export const useProfile = create<IProfile>()((set) => ({
  profile: {},
  setProfile: (by) => set((state) => ({ profile: by })),
}))