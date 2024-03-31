"use client";
import { createContext, ReactNode, useContext } from "react";
import { validateRequest } from "@/lib/auth";

type ContextType = Awaited<ReturnType<typeof validateRequest>>;

const AuthContext = createContext<ContextType>({
  session: null,
  user: null,
});

const AuthProvider = ({
  children,
  authData,
}: {
  children: ReactNode;
  authData: ContextType;
}) => {
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth should be used inside AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
