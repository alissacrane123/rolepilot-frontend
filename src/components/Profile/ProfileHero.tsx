import type { User } from "@/lib/api";

export default function ProfileHero({ user }: { user: User | null }) {
  if (!user) return null;
  return (
    <div className="flex flex-col items-center p-6 pb-5 rounded-xl border border-white/5 bg-white/[0.012]">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-violet-400 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/15">
        <span className="text-lg font-extrabold text-white tracking-wide">
          AC
        </span>
      </div>
      <p className="text-sm font-semibold text-zinc-100 tracking-tight text-center">
        {user.full_name || "Your Name"}
      </p>
      <p className="text-xs text-white/35 mt-0.5 text-center">
        {user.target_role || "Role"}
      </p>
    </div>
  );
}
