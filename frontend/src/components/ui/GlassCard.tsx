import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`glass rounded-3xl ${className}`}
    >
      {children}
    </div>
  );
}