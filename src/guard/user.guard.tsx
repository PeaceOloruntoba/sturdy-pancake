import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { type ReactNode } from "react";

interface UserGuardProps {
  children: ReactNode;
}

export function UserGuard({ children }: UserGuardProps) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
