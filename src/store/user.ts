import { proxy } from "valtio";

import supabase from "@/config/supabaseClient";

const userStore = proxy({
  user: null,
  fetchUserById: async (user_id: string | null) => {
    if (!user_id) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user_id)
        .single();

      if (error) throw error;

      if (data) {
        userStore.user = data;
      }
    } catch (error) {
      // Toast.show({
      //   type: "error",
      //   text1: "Gagal memuat data user"
      // });
    }
  },
});

export default userStore;
