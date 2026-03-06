import { TextTitle2 } from "@/components/ui/text/TextTitle2";
import { TextBody } from "@/components/ui/text";
import TrashButton from "@/components/common/TrashButton";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalHeaderProps {
  companyName: string | undefined;
  roleTitle: string | undefined;
  onDelete: () => void;
  onClose: () => void;
}

export function ModalHeader({
  companyName,
  roleTitle,
  onDelete,
  onClose,
}: ModalHeaderProps): React.JSX.Element {
  return (
    <div className="flex justify-between items-start mb-5">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <TextTitle2>Configure</TextTitle2>
          <TrashButton onClick={onDelete} size={4} />
        </div>
        {companyName && (
          <TextBody className="text-indigo-400/40">
            {companyName} · {roleTitle}
          </TextBody>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="invisible" onClick={onClose} aria-label="Close modal">
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
