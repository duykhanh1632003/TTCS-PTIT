// app/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/router";

interface AuthContextType {
  isAuth: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setIsAuth(true);
      router.push("/dashboard");
    } else {
      throw new Error("Login failed");
    }
  };

  const signup = async (username: string, password: string) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setIsAuth(true);
      router.push("/dashboard");
    } else {
      throw new Error("Signup failed");
    }
  };

  const logout = () => {
    setIsAuth(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
