"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputClass = "w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
  const primaryButtonClass = "w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to create account.");
        return;
      }

      router.push("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[url('/Background.jpg')] bg-cover bg-no-repeat bg-center px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-5 rounded-2xl border border-emerald-500 bg-transparent/90 p-8 shadow-xl backdrop-blur"
        >
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-emerald-100">
              <Image src="/Logo.jpg" alt="DrugTrack" width={48} height={48} className="h-12 w-12 object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-900">Create account</h1>
            <p className="text-sm text-emerald-700">Start your healthy medication journey.</p>
          </div>

          <div className="space-y-4">
            <input
              placeholder="Full name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={primaryButtonClass}
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>

          {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

          <p className="text-center text-sm text-emerald-800">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-700 underline underline-offset-4">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}