interface ResizeHandleProps {
  onPointerDown: (e: React.PointerEvent) => void;
  isDragging: boolean;
  disabled?: boolean;
}

export default function ResizeHandle({
  onPointerDown,
  isDragging,
  disabled,
}: ResizeHandleProps) {
  if (disabled) return null;

  return (
    <div
      onPointerDown={onPointerDown}
      className={`absolute top-0 right-0 w-1 h-full cursor-col-resize z-20 group transition-colors ${
        isDragging ? "bg-indigo-500/40" : "bg-transparent hover:bg-indigo-500/20"
      }`}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 right-0 w-[3px] h-8 rounded-full transition-opacity ${
          isDragging ? "bg-indigo-500/60 opacity-100" : "bg-white/10 opacity-0 group-hover:opacity-100"
        }`}
      />
    </div>
  );
}
