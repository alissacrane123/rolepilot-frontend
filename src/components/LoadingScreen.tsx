export default function LoadingScreen({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-zinc-400">{message}</div>
    </div>
  );
}
