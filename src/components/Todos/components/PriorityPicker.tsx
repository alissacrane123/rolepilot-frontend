import { PRIORITY_META } from "../constants";
import { PillTag } from "../helpers";
import InputLabel from "@/components/common/InputLabel";

interface PriorityPickerProps {
  priority: number;
  onChangePriority: (value: number) => void;
}

export function PriorityPicker({
  priority,
  onChangePriority,
}: PriorityPickerProps): React.JSX.Element {
  return (
    <div className="mb-5">
      <InputLabel label="Priority" />
      <div className="flex gap-2 flex-wrap">
        {Object.entries(PRIORITY_META).map(([value, m]) => (
          <PillTag
            key={value}
            active={priority === Number(value)}
            onClick={() => onChangePriority(Number(value))}
            meta={m}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${m.dot} mr-1.5 align-middle`}
            />
            {m.label}
          </PillTag>
        ))}
      </div>
    </div>
  );
}
