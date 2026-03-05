export default function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="text-sm text-red-400 bg-red-400/10 rounded-md px-3 py-2">
      {message}
    </p>
  );
}
