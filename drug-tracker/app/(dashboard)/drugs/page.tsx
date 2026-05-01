"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

type Drug = {
  id: string;
  name: string;
  category: string;
  bodyPart: string;
  imageUrl: string | null;
  estimatedPrice: number | null;
};

const BODY_PARTS = ["Head", "Chest", "Stomach", "Skin", "Back", "Joints", "Eyes", "Throat", "General"];

export default function DrugsPage() {
  const { data: session } = useSession();
  const isPharmacist = session?.user?.role === "PHARMACIST";

  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [search, setSearch] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState<"" | "MALE" | "FEMALE">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const panelClass = "rounded-2xl border border-[#1b345f] bg-emerald-950";
  const inputClass = "rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
  const primaryButtonClass = "rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60";
  const secondaryButtonClass = "rounded-xl border border-[#1b345f] bg-[#070f24] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-[#0f2347]";

  const categoryOptions = useMemo(
    () => Array.from(new Set(drugs.map((d) => d.category))).sort((a, b) => a.localeCompare(b)),
    [drugs],
  );

  const fetchDrugs = async (
    s = search,
    bp = bodyPart,
    c = category,
    g = gender,
  ) => {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams();
      if (s.trim()) q.set("search", s.trim());
      if (bp) q.set("bodyPart", bp);
      if (c.trim()) q.set("category", c.trim());
      if (g) q.set("gender", g);
      const res = await fetch(`/api/drugs?${q}`);
      if (!res.ok) throw new Error();
      setDrugs((await res.json()) as Drug[]);
    } catch {
      setError("Failed to load drugs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchInitialDrugs = async () => {
      try {
        const res = await fetch("/api/drugs");
        if (!res.ok) throw new Error();
        const data = (await res.json()) as Drug[];
        if (active) setDrugs(data);
      } catch {
        if (active) setError("Failed to load drugs.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchInitialDrugs();
    return () => {
      active = false;
    };
  }, []);

  const handleReset = () => {
    setSearch("");
    setBodyPart("");
    setCategory("");
    setGender("");
    void fetchDrugs("", "", "", "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${panelClass} flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <h1 className="text-2xl font-bold text-white">Drug Library</h1>
          <p className="mt-0.5 text-sm text-slate-400">{drugs.length} medicines available</p>
        </div>
        {isPharmacist && (
          <Link
            href="/drugs/new"
            className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            + Add Drug
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className={`${panelClass} p-4`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchDrugs()}
            className={`${inputClass} lg:col-span-2`}
          />
          <select
            value={bodyPart}
            onChange={(e) => setBodyPart(e.target.value)}
            className={inputClass}
          >
            <option value="">All Body Parts</option>
            {BODY_PARTS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="">All Categories</option>
            {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as "" | "MALE" | "FEMALE")}
            className={inputClass}
          >
            <option value="">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            onClick={() => fetchDrugs()}
            className={primaryButtonClass}
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={secondaryButtonClass}
          >
            Reset
          </button>
        </div>
      </div>

      {/* States */}
      {loading && <p className="text-sm text-slate-400">Loading drugs...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && drugs.length === 0 && (
        <p className={`${panelClass} p-6 text-sm text-slate-400`}>
          No drugs found.
        </p>
      )}

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {drugs.map((drug) => (
          <Link
            key={drug.id}
            href={`/drugs/${drug.id}`}
            className={`group ${panelClass} overflow-hidden transition hover:border-emerald-500/40 hover:bg-[#0f2347]`}
          >
            {drug.imageUrl ? (
              <Image
                src={drug.imageUrl}
                alt={drug.name}
                width={400}
                height={160}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center bg-[#070f24]">
                <Image
                  src="/logo.jpg"
                  alt="DrugTrack logo"
                  width={120}
                  height={120}
                  className="h-20 w-20 rounded-xl object-cover opacity-90"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="font-semibold text-white group-hover:text-emerald-300 transition">{drug.name}</h2>
              <p className="mt-0.5 text-xs text-slate-500">{drug.category} • {drug.bodyPart}</p>
              {drug.estimatedPrice !== null && (
                <p className="mt-1 text-sm font-medium text-emerald-400">${drug.estimatedPrice.toFixed(2)}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
