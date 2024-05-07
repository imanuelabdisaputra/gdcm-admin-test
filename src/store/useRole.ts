import { toast } from "@/components/ui/use-toast"
import supabase from "@/config/supabaseClient"
import { create } from "zustand"

interface IRole {
  isAdmin: boolean
  role: any
  setRole: (by: any) => void
  getUserRole: (uid: string) => void
}

export const useRole = create<IRole>()((set) => ({
  isAdmin: JSON.parse(localStorage.getItem("role") || "{}").isAdmin,
  role: JSON.parse(localStorage.getItem("role") || "{}").role,
  setRole: (roles) => {
    const role = {
      role: roles[0],
      isAdmin: roles[0].roles[0] === "Admin",
    }
    set({ role: role.role, isAdmin: role.isAdmin })
    localStorage.setItem("role", JSON.stringify(role))
  },
  getUserRole: async (uid: string) => {
    const { data: user, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", uid)
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error: " + error.message,
      })
    }
    if (user) {
      set(() => ({ role: user }))
    }
  },
}))
