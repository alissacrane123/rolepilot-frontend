import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrashButton({
  onClick,
  className,
  size = 3,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  size?: number;
}) {
  return (
    <button
      className={cn(
        "cursor-pointer text-white/40 hover:text-indigo-400",
        className,
      )}
      onClick={onClick}
    >
      <Trash2 className={cn("cursor-pointer transition-colors", `size-${size}`)} />
    </button>
  );
}
