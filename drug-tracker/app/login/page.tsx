"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        // Role-based redirect: read role from the JWT session endpoint
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json() as { user?: { role?: string } };
        const role = session?.user?.role;

        if (role === "ADMIN") {
          router.replace("/admin");
        } else if (role === "PHARMACIST") {
          router.replace("/pharmacist/prescriptions");
        } else {
          router.replace("/home");
        }
        return;
      }

      setError("Invalid email or password.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-white px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full space-y-5 rounded-2xl border border-emerald-100 bg-white/90 p-8 shadow-xl backdrop-blur"
        >
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
              💊
            </div>
            <h1 className="text-2xl font-bold text-emerald-900">Welcome back</h1>
            <p className="text-sm text-emerald-700">Sign in to continue tracking your health.</p>
          </div>

          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

          <p className="text-center text-sm text-emerald-800">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-emerald-700 underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
