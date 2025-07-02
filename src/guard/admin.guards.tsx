import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import type { ReactNode } from "react";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
