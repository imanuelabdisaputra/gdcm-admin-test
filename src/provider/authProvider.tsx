"use client";

import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import { useSnapshot } from "valtio";

import supabase from "../config/supabaseClient";

import userStore from "@/store/user";

type AuthProps = {
  session: Session | null;
  initialized?: boolean;
  signOut?: () => void;
};

export const AuthContext = createContext<Partial<AuthProps>>({});

// Custom hook to read the context values
export function useAuth() {
  return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const { fetchUserById } = useSnapshot(userStore);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      fetchUserById(session ? session.user.id : null);
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log out the user
  const signOut = async () => {
    userStore.user = null;
    await supabase.auth.signOut();
  };

  const value = {
    session,
    initialized,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
