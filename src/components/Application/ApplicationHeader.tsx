import { useNavigate } from "react-router-dom";
import type { JobApplication } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import MoveStageDialog from "./MoveStageDialog";
import NavHeader from "@/components/NavHeader";

export default function ApplicationHeader({
  app,
  onMoved,
}: {
  app: JobApplication;
  onMoved: () => void;
}) {
  const navigate = useNavigate();

  return (
    <NavHeader>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="text-zinc-400 hover:text-zinc-100 px-0"
      >
        <div className="flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Applications
        </div>
      </Button>
      <MoveStageDialog app={app} onMoved={onMoved} />
    </NavHeader>
  );
}
