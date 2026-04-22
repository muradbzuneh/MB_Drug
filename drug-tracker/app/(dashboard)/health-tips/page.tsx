const tips = [
  {
    icon: "💧",
    title: "Stay Hydrated",
    body: "Drink at least 8 glasses of water daily. Proper hydration helps medications absorb correctly and supports kidney function.",
  },
  {
    icon: "⏰",
    title: "Take Medications on Time",
    body: "Set reminders and take your medications at the same time each day to maintain consistent levels in your bloodstream.",
  },
  {
    icon: "🍽️",
    title: "Follow Food Instructions",
    body: "Some medications should be taken with food to reduce stomach irritation, while others work best on an empty stomach. Always read the label.",
  },
  {
    icon: "🚫",
    title: "Avoid Self-Medication",
    body: "Never take prescription drugs without a doctor's guidance. Self-medicating can lead to dangerous drug interactions.",
  },
  {
    icon: "📋",
    title: "Complete Your Course",
    body: "Always finish your prescribed course of antibiotics or other medications, even if you feel better before it ends.",
  },
  {
    icon: "🧊",
    title: "Store Medications Properly",
    body: "Keep medications in a cool, dry place away from direct sunlight. Some require refrigeration — check the label.",
  },
  {
    icon: "🩺",
    title: "Regular Check-ups",
    body: "Schedule regular visits with your doctor to review your medications and adjust dosages as needed.",
  },
  {
    icon: "📵",
    title: "Avoid Alcohol",
    body: "Alcohol can interact with many medications, reducing their effectiveness or causing harmful side effects.",
  },
];

export default function HealthTipsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-bold text-emerald-900">Health Tips</h1>
        <p className="mt-1 text-sm text-emerald-700">
          Practical advice to help you manage your medications safely and effectively.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tip.icon}</span>
              <div>
                <h2 className="font-semibold text-emerald-900">{tip.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{tip.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
