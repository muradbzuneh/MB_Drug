"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, type FormEvent, type ChangeEvent } from "react";

type DrugForm = {
  name: string;
  description: string;
  usage: string;
  bodyPart: string;
  category: string;
  ageGroup: string;
  gender: "MALE" | "FEMALE" | "";
  estimatedPrice: string;
};

const BODY_PARTS = ["Head", "Chest", "Stomach", "Skin", "Back", "Joints", "Eyes", "Throat", "General"];
const AGE_GROUPS = ["All Ages", "Children (0–12)", "Teens (13–17)", "Adults (18–64)", "Elderly (65+)"];

export default function AddDrug() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setForm] = useState<DrugForm>({
    name: "",
    description: "",
    usage: "",
    bodyPart: "",
    category: "",
    ageGroup: "",
    gender: "",
    estimatedPrice: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Auth guard
  if (status === "loading") {
    return <div className="p-6 text-slate-400 text-sm">Loading...</div>;
  }
  if (status === "unauthenticated" || session?.user?.role !== "PHARMACIST") {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-[#0c1d3f] p-6 text-center">
        <p className="text-red-400 font-semibold">Access Denied</p>
        <p className="mt-1 text-sm text-slate-400">Only pharmacists can add drugs.</p>
        <Link href="/drugs" className="mt-3 inline-block text-sm text-emerald-400 underline">
          Back to drugs
        </Link>
      </div>
    );
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) throw new Error("Cloudinary cloud name not configured.");
    if (!uploadPreset) throw new Error("Cloudinary upload preset not configured.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Image upload failed.");
    const data = await res.json() as { secure_url: string };
    return data.secure_url;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const required: (keyof DrugForm)[] = ["name", "description", "usage", "bodyPart", "category", "ageGroup"];
    for (const key of required) {
      if (!form[key].trim()) {
        setError(`Please fill in the ${key} field.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const res = await fetch("/api/drugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          estimatedPrice: form.estimatedPrice ? Number(form.estimatedPrice) : undefined,
          gender: form.gender || undefined,
          imageUrl,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to add drug.");
        return;
      }

      router.push("/drugs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = "rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 w-full";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6">
        <h1 className="text-2xl font-bold text-white">Add Drug</h1>
        <p className="mt-1 text-sm text-slate-400">Create a new medicine entry for the library.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Amoxicillin"
              className={field}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Category *</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Antibiotic"
              className={field}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Body Part *</label>
            <select
              value={form.bodyPart}
              onChange={(e) => setForm({ ...form, bodyPart: e.target.value })}
              className={field}
            >
              <option value="">Select body part</option>
              {BODY_PARTS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Age Group *</label>
            <select
              value={form.ageGroup}
              onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
              className={field}
            >
              <option value="">Select age group</option>
              {AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Gender (optional)</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value as DrugForm["gender"] })}
              className={field}
            >
              <option value="">All genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Estimated Price (optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.estimatedPrice}
              onChange={(e) => setForm({ ...form, estimatedPrice: e.target.value })}
              placeholder="0.00"
              className={field}
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-medium text-slate-400">Usage Instructions *</label>
            <input
              value={form.usage}
              onChange={(e) => setForm({ ...form, usage: e.target.value })}
              placeholder="e.g. Take 1 tablet twice daily after meals"
              className={field}
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-medium text-slate-400">Description *</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the drug, its purpose, and any important notes..."
              className={field}
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-medium text-slate-400">Drug Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-2.5 text-sm text-slate-400 outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-700"
            />
            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto rounded-xl object-cover" />
            )}
          </div>
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "Saving..." : "Save Drug"}
          </button>
          <Link
            href="/drugs"
            className="rounded-xl border border-[#1b345f] px-6 py-2.5 text-center text-sm font-semibold text-slate-300 transition hover:bg-[#0f2347] sm:w-auto"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
