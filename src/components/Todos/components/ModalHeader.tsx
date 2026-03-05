import { TextTitle2 } from "@/components/ui/text/TextTitle2";
import { TextBody } from "@/components/ui/text";
import TrashButton from "@/components/common/TrashButton";

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
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="w-7 h-7 rounded-lg border border-white/[0.15] bg-white/[0.04] text-white/40 hover:text-white/70 transition-colors text-lg leading-none flex items-center justify-center cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
}
