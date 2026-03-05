interface MeetingDetailItemProps {
  children: React.ReactNode;
}

export function MeetingDetailItem({ children }: MeetingDetailItemProps) {
  return (
    <span className="text-[11px] text-white/35 flex items-center gap-1">
      {children}
    </span>
  );
}

export default MeetingDetailItem;
