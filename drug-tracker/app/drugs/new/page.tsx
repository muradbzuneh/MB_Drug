"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type DrugForm = {
  name: string;
  description: string;
  usage: string;
  bodyPart: string;
  category: string;
  ageGroup: string;
  gender: "MALE" | "FEMALE" | "";
  estimatedPrice: string;
  imageUrl: string;
};

export default function AddDrug() {
  const router = useRouter();
  const [form, setForm] = useState<DrugForm>({
    name: "",
    description: "",
    usage: "",
    bodyPart: "",
    category: "",
    ageGroup: "",
    gender: "",
    estimatedPrice: "",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.description || !form.usage || !form.bodyPart || !form.category || !form.ageGroup) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const res = await fetch("/api/drugs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        estimatedPrice: form.estimatedPrice ? Number(form.estimatedPrice) : undefined,
        gender: form.gender || undefined,
        imageUrl: form.imageUrl || undefined,
      }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Failed to add drug.");
      setIsSubmitting(false);
      return;
    }

    router.push("/drugs");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-emerald-100 bg-white/90 p-8 shadow-xl backdrop-blur"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-emerald-900">Add Drug</h1>
            <p className="text-sm text-emerald-700">Create a new medicine entry for the library.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Name *"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <input
              placeholder="Category *"
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <input
              placeholder="Body Part *"
              onChange={(e) => setForm({ ...form, bodyPart: e.target.value })}
              className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <input
              placeholder="Age Group *"
              onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
              className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <input
              placeholder="Usage *"
              onChange={(e) => setForm({ ...form, usage: e.target.value })}
              className="sm:col-span-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <textarea
              placeholder="Description *"
              rows={4}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="sm:col-span-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <select
              onChange={(e) => setForm({ ...form, gender: e.target.value as DrugForm["gender"] })}
              className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              defaultValue=""
            >
              <option value="">Gender (optional)</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Estimated Price (optional)"
              onChange={(e) => setForm({ ...form, estimatedPrice: e.target.value })}
              className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <input
              placeholder="Image URL (optional)"
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="sm:col-span-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save drug"}
            </button>
            <Link
              href="/drugs"
              className="rounded-xl border border-emerald-200 bg-white px-5 py-3 text-center text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}