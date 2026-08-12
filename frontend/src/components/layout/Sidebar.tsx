import {
  History,
  Home,
  LogOut,
  Plus,
  Settings,
  User,
  Search,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const navigation = [
    {
      label: "Dashboard",
      icon: Home,
      to: "/",
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
    <aside className="glass fixed left-4 top-4 bottom-4 hidden w-64 flex-col rounded-3xl p-4 lg:flex">
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
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                rounded-2xl px-4 py-3
                text-sm transition
                ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/45 hover:bg-white/5 hover:text-white"
                }
                `
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
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

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/45 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}