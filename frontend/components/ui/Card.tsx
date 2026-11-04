import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

export default function Card({
  active = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-card rounded-card shadow-sm border border-border p-5 ${
        active ? "bg-sidebar-active" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}