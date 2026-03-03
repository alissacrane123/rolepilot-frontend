import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/icons";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className=" px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <LogoIcon />
            <span className="text-base font-bold text-zinc-100 tracking-tight group-hover:text-indigo-400 transition-colors">
              RolePilot
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/profile"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              Profile
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <span className="text-sm text-zinc-500">{user.full_name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-zinc-500 hover:text-zinc-100 text-sm px-0"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
