"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useRouter } from "next/navigation";

interface AuthContextType {
  userId: string | null;
  login: (identifier: string, pass: string) => Promise<void>;
  signup: (email: string, username: string, pass: string) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  login: async () => { },
  signup: async () => { },
  logout: () => { },
  requestPasswordReset: async () => "",
  resetPassword: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const loginMutation = useMutation(anyApi.auth.login);
  const signupMutation = useMutation(anyApi.auth.signup);
  const requestPasswordResetMutation = useMutation(anyApi.auth.requestPasswordReset);
  const resetPasswordMutation = useMutation(anyApi.auth.resetPassword);

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("convex_user_id");
    if (stored) {
      setUserId(stored);
    }
    setIsInitializing(false);
  }, []);

  const login = async (identifier: string, pass: string) => {
    const id = await loginMutation({ identifier, password: pass });
    localStorage.setItem("convex_user_id", id as string);
    document.cookie = `convex_user_id=${id}; path=/; max-age=31536000; SameSite=Lax`;
    setUserId(id as string);
    router.push('/');
  };

  const signup = async (email: string, username: string, pass: string) => {
    const id = await signupMutation({ email, username, password: pass });
    localStorage.setItem("convex_user_id", id as string);
    document.cookie = `convex_user_id=${id}; path=/; max-age=31536000; SameSite=Lax`;
    setUserId(id as string);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem("convex_user_id");
    document.cookie = "convex_user_id=; path=/; max-age=0; SameSite=Lax";
    setUserId(null);
    router.push('/landing');
  };

  const requestPasswordReset = async (email: string) => {
    return await requestPasswordResetMutation({ email }) as string;
  };

  const resetPassword = async (token: string, newPassword: string) => {
    await resetPasswordMutation({ token, newPassword });
  };

  // While initializing, don't flash children for protected pages if they might not have auth
  if (isInitializing) {
    return null; // Return empty or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ userId, login, signup, logout, requestPasswordReset, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
