import type { ReactNode } from "react";

export default function NavHeader({ children }: { children: ReactNode }) {
  return (
    <header className="w-full border-b border-[#1e1e2e] p-6">
      <div className="flex items-center gap-3 justify-between">
        {/* <div className="flex items-center gap-3 justify-between max-w-6xl mx-auto p-6 "> */}
        {children}
      </div>
    </header>
  );
}
