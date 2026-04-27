import {
  Ban,
  BellRing,
  Brain,
  ClipboardList,
  Droplets,
  Pill,
  Snowflake,
  Stethoscope,
  TriangleAlert,
  Utensils,
  WineOff,
  type LucideIcon,
} from "lucide-react";

const tips = [
  {
    Icon: Droplets,
    title: "Stay Hydrated",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    iconBg: "bg-blue-500/20",
    body: "Water is the foundation of good health and plays a critical role in how your body processes medications. Aim for at least 8 glasses (2 liters) of water per day. Dehydration can slow down drug absorption, reduce kidney efficiency, and increase the concentration of medications in your bloodstream to potentially toxic levels. Some medications — like lithium, NSAIDs, and certain antibiotics — are especially sensitive to hydration levels. Carry a water bottle, set hydration reminders, and increase intake during hot weather or exercise.",
  },
  {
    Icon: BellRing,
    title: "Take Medications on Time",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
    iconBg: "bg-emerald-500/20",
    body: "Consistency is the single most important factor in medication effectiveness. Taking drugs at the same time every day maintains a stable therapeutic level in your bloodstream, preventing both under-dosing and toxicity. Missing doses or taking them irregularly can cause treatment failure — especially with antibiotics, blood pressure medications, and psychiatric drugs. Use the DrugTrack reminder system to set precise daily alerts. If you miss a dose, check the medication guide — never double-dose without medical advice.",
  },
  {
    Icon: Utensils,
    title: "Follow Food Instructions",
    color: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
    iconBg: "bg-orange-500/20",
    body: "Food dramatically affects how your body absorbs and metabolizes drugs. Some medications like ibuprofen and metformin must be taken with food to prevent stomach irritation and nausea. Others like levothyroxine and certain antibiotics (tetracyclines) must be taken on an empty stomach because food blocks absorption. Grapefruit juice is a well-known offender — it inhibits enzymes that break down many drugs, causing dangerous buildup. Always read the patient information leaflet and ask your pharmacist about specific food interactions for every medication you take.",
  },
  {
    Icon: Ban,
    title: "Avoid Self-Medication",
    color: "from-red-500/20 to-rose-500/10 border-red-500/30",
    iconBg: "bg-red-500/20",
    body: "Self-prescribing prescription medications is one of the leading causes of preventable hospitalizations worldwide. Without a proper diagnosis, you risk treating the wrong condition, masking serious symptoms, or triggering dangerous drug interactions with medications you're already taking. Over-the-counter drugs are not risk-free either — long-term use of painkillers like ibuprofen can cause kidney damage and stomach ulcers. Always consult a licensed healthcare provider before starting, stopping, or changing any medication. Use this platform to track what your doctor prescribes, not to replace medical advice.",
  },
  {
    Icon: ClipboardList,
    title: "Complete Your Full Course",
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
    iconBg: "bg-violet-500/20",
    body: "Stopping antibiotics or other prescribed medications early because you feel better is a dangerous and common mistake. When you feel improvement, it means the drug is working — but the infection or condition may not be fully eliminated. Stopping early allows surviving bacteria to develop resistance, making future infections much harder to treat. This is how antibiotic-resistant superbugs like MRSA emerge. The same principle applies to antidepressants, antifungals, and tuberculosis treatments. Always complete the full prescribed course, even if symptoms disappear within the first few days.",
  },
  {
    Icon: Snowflake,
    title: "Store Medications Properly",
    color: "from-sky-500/20 to-indigo-500/10 border-sky-500/30",
    iconBg: "bg-sky-500/20",
    body: "Improper storage degrades medications and can make them ineffective or even harmful. Most drugs should be stored at room temperature (15–25°C), away from direct sunlight, heat, and humidity — which means the bathroom medicine cabinet is actually one of the worst places to store them. Insulin, certain eye drops, and some liquid antibiotics require refrigeration. Never freeze medications unless explicitly instructed. Check expiry dates regularly and dispose of expired drugs safely — don't flush them down the toilet as this contaminates water supplies. Use a dedicated, locked storage box if children are in the home.",
  },
  {
    Icon: Stethoscope,
    title: "Schedule Regular Check-ups",
    color: "from-teal-500/20 to-green-500/10 border-teal-500/30",
    iconBg: "bg-teal-500/20",
    body: "Your medication needs change over time as your body, weight, age, and health conditions evolve. A drug that was perfectly dosed two years ago may now be too strong or too weak. Regular check-ups allow your doctor to review your full medication list, check for interactions, monitor organ function (especially liver and kidneys which process drugs), and adjust dosages accordingly. Blood tests are often needed to monitor levels of drugs like warfarin, digoxin, and thyroid medications. Don't wait until something goes wrong — proactive monitoring prevents serious complications.",
  },
  {
    Icon: WineOff,
    title: "Avoid Alcohol with Medications",
    color: "from-pink-500/20 to-fuchsia-500/10 border-pink-500/30",
    iconBg: "bg-pink-500/20",
    body: "Alcohol interacts with a surprisingly wide range of medications. It amplifies the sedative effects of antihistamines, sleeping pills, and anxiety medications — making driving or operating machinery extremely dangerous. With antibiotics like metronidazole and tinidazole, even small amounts of alcohol cause severe nausea, vomiting, and flushing. Alcohol combined with acetaminophen (paracetamol) can cause acute liver failure even at normal doses. It also reduces the effectiveness of blood pressure medications and can trigger dangerous blood sugar drops in diabetics on insulin. When in doubt, abstain completely during your treatment course.",
  },
  {
    Icon: Pill,
    title: "Understand Your Medications",
    color: "from-lime-500/20 to-green-500/10 border-lime-500/30",
    iconBg: "bg-lime-500/20",
    body: "Being an informed patient is one of the most powerful things you can do for your health. Know the name (both brand and generic), purpose, correct dose, timing, and potential side effects of every medication you take. Keep an up-to-date medication list in your wallet or phone — this is critical in emergencies. When prescribed a new drug, ask your doctor or pharmacist: What is this for? How and when do I take it? What should I avoid? What side effects should I watch for? When should I stop? Use the DrugTrack drug library to look up detailed information on your medications anytime.",
  },
  {
    Icon: TriangleAlert,
    title: "Know the Warning Signs",
    color: "from-yellow-100/20 to-amber-500/10 border-yellow-500/30",
    iconBg: "bg-yellow-500/20",
    body: "Every medication carries a risk of adverse reactions, ranging from mild to life-threatening. Common warning signs that require immediate medical attention include: severe allergic reactions (hives, swelling of face/throat, difficulty breathing), unusual bleeding or bruising, severe stomach pain, yellowing of skin or eyes (jaundice), extreme fatigue, confusion, or vision changes. Don't dismiss new symptoms that appear after starting a medication — they may be drug-related. Report all side effects to your doctor and pharmacist. In case of suspected overdose or severe reaction, call emergency services immediately.",
  },
] as {
  Icon: LucideIcon;
  title: string;
  color: string;
  iconBg: string;
  body: string;
}[];

export default function HealthTipsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#050505] bg-[#091d1d] p-6">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-white">
          <Brain className="h-6 w-6 text-emerald-400" />
          Health Tips
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Evidence-based guidance to help you manage your medications safely, effectively, and confidently.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className={`rounded-2xl border bg-linear-to-br ${tip.color} p-5 transition hover:scale-[1.01]`}
          >
            <div className="flex items-start gap-4">
              <div className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-xl ${tip.iconBg} text-2xl`}>
                <tip.Icon className="h-5 w-5 text-black" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-700 text-2xl">{tip.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-emerald-900">{tip.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
        