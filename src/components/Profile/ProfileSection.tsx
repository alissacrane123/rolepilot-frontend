export default function ProfileSection({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <section
      id={title.toLowerCase().replace(" ", "-")}
      className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/[0.012] p-7 mb-3.5 anim-section-1"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-base font-bold text-zinc-100 tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-white/30 mt-0.5">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}
