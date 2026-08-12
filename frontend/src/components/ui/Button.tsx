import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const styles = {
    primary:
      "bg-white text-black hover:bg-white/90",

    secondary:
      "glass text-white hover:bg-white/10",

    ghost:
      "text-white/60 hover:bg-white/5 hover:text-white",
  };

  return (
    <button
      {...props}
      className={`
        rounded-2xl px-5 py-3
        text-sm font-medium
        transition-all duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}