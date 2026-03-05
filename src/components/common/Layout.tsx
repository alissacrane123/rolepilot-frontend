import { type ReactNode } from "react";
import Navbar from "@/components/common/Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      {children}
    </div>
  );
}