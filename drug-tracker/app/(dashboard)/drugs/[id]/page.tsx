import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ReminderForm from "./ReminderForm";
import FeedbackForm from "./FeedbackForm";

type DrugDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function DrugDetail({ params }: DrugDetailPageProps) {
  const drug = await prisma.drug.findUnique({
    where: { id: params.id },
    include: {
      feedbacks: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!drug) {
    return (
      <main className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-white px-4 py-10">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-emerald-100 bg-white/90 p-8 shadow-xl backdrop-blur">
          <h1 className="text-2xl font-bold text-emerald-900">Drug not found</h1>
          <p className="mt-2 text-sm text-emerald-700">The requested medicine does not exist.</p>
          <Link href="/drugs" className="mt-4 inline-block text-sm font-semibold text-emerald-700 underline underline-offset-4">
            Back to drugs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6 rounded-2xl border border-emerald-100 bg-white/90 p-8 shadow-xl backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">{drug.name}</h1>
            <p className="mt-1 text-sm text-emerald-700">{drug.category} • {drug.bodyPart}</p>
          </div>
          <Link href="/drugs" className="text-sm font-semibold text-emerald-700 underline underline-offset-4">
            Back
          </Link>
        </div>

        {drug.imageUrl ? (
          <Image
            src={drug.imageUrl}
            alt={drug.name || "Drug image"}
            width={800}
            height={420}
            className="h-auto w-full rounded-xl object-cover"
          />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
            <h2 className="text-sm font-semibold text-emerald-900">Description</h2>
            <p className="mt-1 text-sm text-emerald-800">{drug.description}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
            <h2 className="text-sm font-semibold text-emerald-900">Usage</h2>
            <p className="mt-1 text-sm text-emerald-800">{drug.usage}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
            <h2 className="text-sm font-semibold text-emerald-900">Age Group</h2>
            <p className="mt-1 text-sm text-emerald-800">{drug.ageGroup}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
            <h2 className="text-sm font-semibold text-emerald-900">Estimated Price</h2>
            <p className="mt-1 text-sm text-emerald-800">
              {typeof drug.estimatedPrice === "number" ? `$${drug.estimatedPrice.toFixed(2)}` : "Not specified"}
            </p>
          </div>
        </div>
        {/* Reminder Section */}
        <ReminderForm drugId={drug.id} />
        {/* Feedback Form */}
        <FeedbackForm drugId={drug.id} />

        {/* Feedback List */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">User Feedback</h2>

          {drug.feedbacks.length === 0 ? (
            <p className="mt-2 text-sm text-emerald-700">No feedback yet.</p>
          ) : (
            drug.feedbacks.map((f) => (
              <div key={f.id} className="mt-2 rounded border border-emerald-200 p-3">
                <p className="font-semibold text-emerald-900">{f.user.name ?? "Anonymous user"}</p>
                <p className="text-sm text-slate-700">{f.comment}</p>
                <p className="text-sm text-emerald-800">⭐ {f.rating ?? "N/A"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}