import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReminderForm from "./ReminderForm";
import FeedbackForm from "./FeedbackForm";

type Props = { params: Promise<{ id: string }> };

export default async function DrugDetail({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const drug = await prisma.drug.findUnique({
    where: { id },
    include: {
      feedbacks: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!drug) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-[#0c1d3f] p-8 text-center">
        <p className="text-lg font-semibold text-red-400">Drug not found</p>
        <Link href="/drugs" className="mt-3 inline-block text-sm text-emerald-400 underline">
          Back to drugs
        </Link>
      </div>
    );
  }

  const ratedFeedbacks = drug.feedbacks.filter((f) => typeof f.rating === "number");
  const avgRating =
    ratedFeedbacks.length > 0
      ? (ratedFeedbacks.reduce((s, f) => s + (f.rating ?? 0), 0) / ratedFeedbacks.length).toFixed(1)
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{drug.name}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {drug.category} • {drug.bodyPart}
            {drug.gender ? ` • ${drug.gender}` : ""}
          </p>
          {avgRating && (
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-yellow-400">
              <Star className="h-4 w-4 fill-yellow-400" /> {avgRating} / 5 ({ratedFeedbacks.length} ratings)
            </p>
          )}
        </div>
        <Link href="/drugs" className="shrink-0 rounded-xl border border-[#1b345f] bg-[#070f24] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-[#0f2347]">
          <span className="inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </span>
        </Link>
      </div>

      {/* Image */}
      {drug.imageUrl && (
        <div className="overflow-hidden rounded-2xl border border-[#1b345f]">
          <Image
            src={drug.imageUrl}
            alt={drug.name}
            width={900}
            height={400}
            className="h-64 w-full object-cover"
          />
        </div>
      )}

      {/* Info grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Description", value: drug.description },
          { label: "Usage Instructions", value: drug.usage },
          { label: "Age Group", value: drug.ageGroup },
          {
            label: "Estimated Price",
            value: typeof drug.estimatedPrice === "number"
              ? `$${drug.estimatedPrice.toFixed(2)}`
              : "Not specified",
          },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-1.5 text-sm text-slate-200">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Reminder — only for authenticated users */}
      {session?.user?.id && <ReminderForm drugId={drug.id} />}

      {/* Feedback form — only for authenticated users */}
      {session?.user?.id && <FeedbackForm drugId={drug.id} />}

      {/* Feedback list */}
      <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 space-y-4">
        <h2 className="font-semibold text-white">
          User Reviews ({drug.feedbacks.length})
        </h2>

        {drug.feedbacks.length === 0 ? (
          <p className="text-sm text-slate-400">No reviews yet. Be the first to leave feedback.</p>
        ) : (
          drug.feedbacks.map((f) => (
            <div key={f.id} className="rounded-xl border border-[#1b345f] bg-[#070f24] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-200">{f.user.name ?? "Anonymous"}</p>
                {f.rating && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-400">
                    {Array.from({ length: f.rating }).map((_, idx) => (
                      <Star key={`${f.id}-star-${idx}`} className="h-3.5 w-3.5 fill-yellow-400" />
                    ))}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-slate-400">{f.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
