import type { JobApplication, Meeting, CoverLetter } from "@/lib/api";

export interface ApplicationProps {
  app: JobApplication;
}

export interface ApplicationHeroProps {
  app: JobApplication;
  onMoved: () => void;
}

export interface MeetingsTabProps {
  applicationId: string;
  companyName?: string;
  roleTitle?: string;
}

export interface NotesTabProps {
  applicationId: string;
  initialNoteId?: string;
  onActiveNoteChange?: (noteId: string | undefined) => void;
}

export interface CoverLettersTabProps {
  app: JobApplication;
  companyName?: string;
}

export interface CoverLetterItemProps {
  letter: CoverLetter;
  companyName: string;
}

export interface MoveStageModalProps {
  app: JobApplication;
  onMoved: () => void;
}

export interface SkillBadgesProps {
  skills: string[];
  color: string;
}

export interface TimelineMeetingProps {
  meeting: Meeting;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}

export interface MetaRowProps {
  items: (string | undefined | null)[];
  tags: (string | undefined | null)[];
}

export interface AnalysisCardProps {
  title: string;
  items: string[];
  color: string;
}

export interface StagePipelineProps {
  currentStage: string;
}
