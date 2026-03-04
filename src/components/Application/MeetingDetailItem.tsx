export default function MeetingDetailItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="text-[11px] text-white/35 flex items-center gap-1">
      {children}
    </span>
  );
}
