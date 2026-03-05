import { cn } from "@/lib/utils";

export default function NewCard({
  children,
  className,
  onClick,
  icon,
  title,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  title?: string;
}) {

  return (
    <div
      className={cn(
        "flex flex-col w-full text-left rounded-[10px] border border-white/[0.15] bg-white/[0.02]",
        "p-4 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all",
        "cursor-pointer flex items-center justify-between gap-4",
        className,
      )}
      onClick={onClick}
    >
      {icon}
      {title && (
        <h3 className="text-sm font-semibold text-white">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
