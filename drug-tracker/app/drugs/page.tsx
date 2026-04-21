"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Drug = {
  id: string;
  name: string;
  category: string;
  bodyPart: string;
  imageUrl: string | null;
};

export default function DrugsPage() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/drugs")
      .then((res) => res.json())
      .then((data) => setDrugs(data))
      .catch(() => setError("Failed to load drugs."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-xl backdrop-blur sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">Drug Library</h1>
            <p className="text-sm text-emerald-700">Explore medicine details and usage information.</p>
          </div>
          <Link
            href="/drugs/new"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Add new drug
          </Link>
        </div>

        {loading ? <p className="text-sm text-emerald-700">Loading drugs...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {!loading && !error && drugs.length === 0 ? (
          <p className="rounded-xl border border-emerald-100 bg-white/80 p-6 text-sm text-emerald-700">No drugs found.</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drugs.map((drug) => (
            <article key={drug.id} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white/90 shadow-md">
              {drug.imageUrl ? (
                <Image
                  src={drug.imageUrl}
                  alt={drug.name}
                  width={420}
                  height={240}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-emerald-50 text-sm text-emerald-700">No image</div>
              )}

              <div className="space-y-2 p-4">
                <h2 className="text-lg font-semibold text-emerald-900">{drug.name}</h2>
                <p className="text-sm text-emerald-700">{drug.category} • {drug.bodyPart}</p>
                <Link
                  href={`/drugs/${drug.id}`}
                  className="inline-block text-sm font-semibold text-emerald-700 underline underline-offset-4"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}