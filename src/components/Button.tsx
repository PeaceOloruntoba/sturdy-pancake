import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "font-medium rounded-lg transition-colors";
  const variantStyles = {
    default: "bg-rose-600 text-white hover:bg-rose-700",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
    outline: "border border-gray-300 text-gray-900 hover:bg-gray-100",
  };
  const sizeStyles = {
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
