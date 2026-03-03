export default function EmptyState({
  title,
  description,
  cta,
  icon = "📋",
}: {
  title: string;
  description: string;
  cta?: React.ReactNode;
  icon?: string;
}) {
  return (
    <div className="text-center py-20">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-lg font-semibold text-white/70 mb-2">{title}</h2>
      <p className="text-sm text-white/35 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {cta}
    </div>
  );
}
