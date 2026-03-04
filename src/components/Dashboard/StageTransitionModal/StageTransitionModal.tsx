import type { StageModalProps } from "./shared";
import InterviewModal from "./InterviewModal";
import OfferModal from "./OfferModal";
import ReasonModal from "./ReasonModal";
import ConfirmTransitionModal from "./ConfirmTransitionModal";

const INTERVIEW_STAGES = new Set(["phone_screen", "technical_interview", "onsite_final"]);
const REASON_STAGES = new Set(["rejected", "withdrawn"]);

export default function StageTransitionModal(props: StageModalProps) {
  const { toStage } = props.transition;

  if (INTERVIEW_STAGES.has(toStage)) return <InterviewModal {...props} />;
  if (toStage === "offer") return <OfferModal {...props} />;
  if (REASON_STAGES.has(toStage)) return <ReasonModal {...props} />;
  return <ConfirmTransitionModal {...props} />;
}
