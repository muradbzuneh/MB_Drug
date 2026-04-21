import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-2xl border border-emerald-100 bg-white/90 p-8 shadow-xl backdrop-blur md:p-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 md:mx-0" />
            <h1 className="text-3xl font-bold text-emerald-900 md:text-4xl">Drug Tracker</h1>
            <p className="text-emerald-700">
              A clean and professional workspace for medication tracking, reminders, and drug information.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/login"
              className="rounded-xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-center text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Sign up
            </Link>
            <Link
              href="/drugs"
              className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-center text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Browse drugs
            </Link>
            <Link
              href="/drugs/new"
              className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-center text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Add drug
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
