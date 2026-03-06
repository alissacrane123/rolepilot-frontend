import type { AppIconBadgeProps } from "../types";

export function AppIconBadge({ icon, iconBg }: AppIconBadgeProps): React.JSX.Element {
  if (icon) {
    return (
      <div
        className="w-4 h-4 rounded shrink-0 flex items-center justify-center text-[8px] font-extrabold text-white"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
    );
  }
  return <div className="w-4 h-4 rounded shrink-0 bg-white/[0.06]" />;
}
