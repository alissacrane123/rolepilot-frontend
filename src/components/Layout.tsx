import { type ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 pb-72">
      <Navbar />
      {children}
    </div>
  );
}