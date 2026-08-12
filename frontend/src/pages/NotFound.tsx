import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-semibold">
          404
        </div>

        <p className="mt-3 text-white/40">
          This page doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 text-sm text-black"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}