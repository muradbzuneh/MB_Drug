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
  const [search, setSearch] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDrugs = async (s = search, bp = bodyPart) => {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ search: s, bodyPart: bp });
      const res = await fetch(`/api/drugs?${query.toString()}`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as Drug[];
      setDrugs(data);
    } catch {
      setError("Failed to load drugs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDrugs("", "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="space-y-6">
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

      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            placeholder="Search drug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
          <select
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value)}
            className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:max-w-52"
          >
            <option value="">All Body Parts</option>
            <option value="Head">Head</option>
            <option value="Stomach">Stomach</option>
            <option value="Chest">Chest</option>
            <option value="Skin">Skin</option>
          </select>
          <button
            onClick={() => fetchDrugs()}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 md:px-5"
          >
            🔍 Filter
          </button>
        </div>
      </div>

      {loading ? <p className="text-sm text-emerald-700">Loading drugs...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!loading && !error && drugs.length === 0 ? (
        <p className="rounded-xl border border-emerald-100 bg-white/80 p-6 text-sm text-emerald-700">No drugs found.</p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {drugs.map((drug) => (
          <div key={drug.id} className="rounded-xl bg-white p-4 shadow transition hover:shadow-lg">
            {drug.imageUrl ? (
              <Image
                src={drug.imageUrl}
                alt={drug.name}
                width={400}
                height={160}
                className="h-40 w-full rounded-lg object-cover"
              />
            ) : (
              <div className="h-40 w-full rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-300 text-4xl">
                💊
              </div>
            )}
            <h2 className="mt-3 text-lg font-semibold">{drug.name}</h2>
            <p className="text-sm text-gray-500">{drug.category} • {drug.bodyPart}</p>
            <Link
              href={`/drugs/${drug.id}`}
              className="mt-3 inline-block font-medium text-emerald-600"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
