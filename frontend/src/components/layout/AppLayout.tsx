import {
  Outlet,
} from "react-router-dom";

import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      <Sidebar />

      <main className="min-h-screen lg:ml-72">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}