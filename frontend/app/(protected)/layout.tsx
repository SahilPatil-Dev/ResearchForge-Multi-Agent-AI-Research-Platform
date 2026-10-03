"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "../../src/context/AuthContext";
import AppLayout from "../../src/components/layout/AppLayout";

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading || !isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <div className="glass rounded-3xl px-8 py-7 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-violet-300" />
          <p className="text-sm text-white/55">
            {loading ? "Loading your workspace…" : "Redirecting to sign in…"}
          </p>
        </div>
      </main>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
