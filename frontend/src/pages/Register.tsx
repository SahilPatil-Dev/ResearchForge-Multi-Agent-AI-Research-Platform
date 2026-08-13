import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  Search,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


export default function Register() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const {
    register,
  } = useAuth();

  const navigate =
    useNavigate();

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(
        email,
        name,
        password
      );

      navigate("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
            <Search size={20} />
          </div>

          <h1 className="text-3xl font-semibold">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Start building your research workspace.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="glass rounded-3xl p-6 sm:p-8"
        >
        {error && (
  <div className="error-message">
    {error}
  </div>
)}

         <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/50">
                Full name
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/25"
                placeholder="Sahil Patil"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/50">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/25"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/50">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                minLength={8}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/25"
                placeholder="Minimum 8 characters"
              />
            </div>

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 font-medium text-black disabled:opacity-50"
            >
              {loading
                ? "Creating account..."
                : "Create account"}

              {!loading && (
                <ArrowRight size={17} />
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/35">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}