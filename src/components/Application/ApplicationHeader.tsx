import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function ApplicationHeader() {
  const navigate = useNavigate();

  return (
    <div className="mb-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="text-white/40 hover:text-white px-0 gap-1.5"
      >
        <ArrowLeftIcon className="w-3.5 h-3.5" />
        Applications
      </Button>
    </div>
  );
}
