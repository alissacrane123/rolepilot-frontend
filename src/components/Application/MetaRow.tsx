import type { MetaRowProps } from "./types";

export function MetaRow({ items, tags }: MetaRowProps) {
  const visibleItems = items.filter(
    (item) => item && item !== "not_specified",
  ) as string[];

  const visibleTags = tags.filter(Boolean) as string[];

  return (
    <div className="flex items-center flex-wrap gap-2.5 pb-5 border-b border-white/[0.05]">
      {visibleItems.map((item, i) => (
        <span key={i} className="contents">
          {i > 0 && <span className="w-px h-3 bg-white/[0.08]" />}
          <span className="text-xs text-white/40 font-medium">{item}</span>
        </span>
      ))}

      {visibleTags.length > 0 && (
        <div className="flex gap-1 ml-auto">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium text-white/40 bg-white/[0.04] px-2 py-0.5 rounded uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
