"use client";

import {
  History,
  Home,
  LogOut,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";

export default function Sidebar() {
  const {
    user,
    logout,
  } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    {
      label: "Dashboard",
      icon: Home,
      to: "/workspace",
    },
    {
      label: "New Research",
      icon: Plus,
      to: "/research/new",
    },
    {
      label: "History",
      icon: History,
      to: "/history",
    },
    {
      label: "Profile",
      icon: User,
      to: "/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      to: "/settings",
    },
  ];

  return (
    <>
      <header className="glass mb-3 flex items-center justify-between gap-3 rounded-2xl px-3 py-3 lg:hidden">
        <Link href="/workspace" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black">
            <Search size={16} />
          </span>
          <span className="text-xs font-semibold">ResearchForge</span>
        </Link>
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
          {navigation.slice(0, 3).map(({ label, icon: Icon, to }) => (
            <Link
              key={to}
              href={to}
              aria-label={label}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                pathname === to || (to !== "/workspace" && pathname.startsWith(`${to}/`))
                  ? "bg-white/10 text-white"
                  : "text-white/45"
              }`}
            >
              <Icon size={16} />
            </Link>
          ))}
          <Link
            href="/profile"
            aria-label="Profile"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
              pathname.startsWith("/profile")
                ? "bg-white/10 text-white"
                : "text-white/45"
            }`}
          >
            <User size={16} />
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle compact />
          <button
            type="button"
            aria-label="Log out"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/45 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <aside className="glass fixed bottom-4 left-4 top-4 hidden w-64 flex-col rounded-3xl p-4 lg:flex">
      <div className="mb-8 px-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
            <Search size={18} />
          </div>

          <div>
            <div className="font-semibold">
              ResearchForge
            </div>

            <div className="text-xs text-white/35">
              AI Research
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map(
          ({
            label,
            icon: Icon,
            to,
          }) => (
            <Link
              key={to}
              href={to}
              className={`
                flex items-center gap-3
                rounded-2xl px-4 py-3
                text-sm transition
                ${
                  pathname === to ||
                  (to !== "/workspace" && pathname.startsWith(`${to}/`))
                    ? "bg-white/10 text-white"
                    : "text-white/45 hover:bg-white/5 hover:text-white"
                }
                `}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        )}
      </nav>

      <div className="border-t border-white/10 pt-4">
        <div className="mb-3 rounded-2xl bg-white/5 p-3">
          <div className="truncate text-sm">
            {user?.full_name}
          </div>

          <div className="truncate text-xs text-white/35">
            {user?.email}
          </div>
        </div>

        <ThemeToggle />

        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/45 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      </aside>
    </>
  );
}