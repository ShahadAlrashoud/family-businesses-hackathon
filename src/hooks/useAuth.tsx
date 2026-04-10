import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "admin" | "shareholder" | "independent_director";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
   signUp: (email: string, password: string, fullName: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const syncVersionRef = useRef(0);

  const fetchRole = useCallback(async (userId: string): Promise<UserRole> => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch user role", error);
    }

    return data?.role || "shareholder";
  }, []);

  const syncAuthState = useCallback(
    (nextSession: Session | null) => {
      const syncId = ++syncVersionRef.current;
      const nextUser = nextSession?.user ?? null;

      setSession(nextSession);
      setUser(nextUser);

      if (!nextUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      void fetchRole(nextUser.id)
        .then((nextRole) => {
          if (syncVersionRef.current === syncId) {
            setRole(nextRole);
          }
        })
        .catch(() => {
          if (syncVersionRef.current === syncId) {
            setRole("shareholder");
          }
        })
        .finally(() => {
          if (syncVersionRef.current === syncId) {
            setLoading(false);
          }
        });
    },
    [fetchRole],
  );

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        syncAuthState(nextSession);
      },
    );

    void supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      syncAuthState(currentSession);
    });

    return () => subscription.unsubscribe();
  }, [syncAuthState]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    syncAuthState(data.session);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw error;

    if (data.session) {
      syncAuthState(data.session);
    }

    return {
      needsEmailConfirmation: !data.session && Boolean(data.user),
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    syncAuthState(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
