"use client";

import Sidebar from "./Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-white">
      <Sidebar />

      <main className="min-h-screen lg:ml-72">
        <div className="mx-auto max-w-7xl px-5 py-3 sm:px-8 sm:py-6 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}