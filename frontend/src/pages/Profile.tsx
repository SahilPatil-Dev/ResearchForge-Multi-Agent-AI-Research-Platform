import {
  useState,
} from "react";

import {
  api,
} from "../lib/api";

import {
  useAuth,
} from "../context/AuthContext";

export default function Profile() {
  const {
    user,
    refreshUser,
  } = useAuth();

  const [name, setName] =
    useState(
      user?.full_name ?? ""
    );

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.updateProfile({
        full_name: name,
      });

      await refreshUser();

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Update failed."
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">
          Profile
        </h1>

        <p className="mt-2 text-white/40">
          Manage your account information.
        </p>
      </header>

      <form
        onSubmit={submit}
        className="glass rounded-3xl p-6 sm:p-8"
      >
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-white/50">
              Email
            </label>

            <input
              value={user?.email ?? ""}
              disabled
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/50">
              Full name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-white/25"
            />
          </div>

          {message && (
            <p className="text-sm text-emerald-300">
              {message}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-300">
              {error}
            </p>
          )}

          <button className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}