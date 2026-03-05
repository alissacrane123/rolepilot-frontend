import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoIcon } from "@/components/icons";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <header className="border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className=" px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <LogoIcon />
            <span className="text-base font-bold text-slate-100 tracking-tight group-hover:text-indigo-400 transition-colors">
              RolePilot
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "bg-white/[0.08] text-slate-100"
                  : "text-white/40 hover:text-slate-200 hover:bg-white/[0.08]"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/profile"
                  ? "bg-white/[0.08] text-slate-100"
                  : "text-white/40 hover:text-slate-200 hover:bg-white/[0.08]"
              }`}
            >
              Profile
            </Link>
          </nav>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]">
              <Avatar className="size-8 cursor-pointer">
                <AvatarFallback className="bg-indigo-600 text-xs font-medium text-white">
                  {user.full_name
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
              {user.full_name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="size-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
