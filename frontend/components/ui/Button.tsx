import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "h-[45px] rounded-lg font-medium text-sm px-5 transition-colors";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-background text-muted hover:bg-primary-light",
  };
  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${base} ${variants[variant]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}