import { useState, useCallback, useRef } from "react";
import type { JobApplication, BoardView } from "@/lib/api";
import { updateStage } from "@/lib/api";
import type { StageTransition } from "@/components/Dashboard/StageTransitionModal";
import { needsConfirmation } from "@/components/Dashboard/StageTransitionModal";

export interface DragPayload {
  appId: string;
  fromStage: string;
}

export interface StageDragState {
  dragging: DragPayload | null;
  overStageKey: string | null;
}

export default function useStageDragAndDrop(
  board: BoardView | null,
  onBoardUpdated: () => void,
) {
  const [dragState, setDragState] = useState<StageDragState>({
    dragging: null,
    overStageKey: null,
  });
  const [pendingTransition, setPendingTransition] =
    useState<StageTransition | null>(null);

  const dragCounterRef = useRef<Record<string, number>>({});

  const findApp = useCallback(
    (appId: string): JobApplication | null => {
      if (!board) return null;
      for (const apps of Object.values(board)) {
        const found = (apps as JobApplication[]).find((a) => a.id === appId);
        if (found) return found;
      }
      return null;
    },
    [board],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, appId: string, fromStage: string) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("application/json", JSON.stringify({ appId, fromStage }));
      // Small delay so the browser captures the element for the ghost image
      requestAnimationFrame(() => {
        setDragState({ dragging: { appId, fromStage }, overStageKey: null });
      });
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    setDragState({ dragging: null, overStageKey: null });
    dragCounterRef.current = {};
  }, []);

  const handleColumnDragEnter = useCallback((stageKey: string) => {
    dragCounterRef.current[stageKey] = (dragCounterRef.current[stageKey] || 0) + 1;
    setDragState((prev) => ({ ...prev, overStageKey: stageKey }));
  }, []);

  const handleColumnDragLeave = useCallback((stageKey: string) => {
    dragCounterRef.current[stageKey] = (dragCounterRef.current[stageKey] || 0) - 1;
    if (dragCounterRef.current[stageKey] <= 0) {
      dragCounterRef.current[stageKey] = 0;
      setDragState((prev) =>
        prev.overStageKey === stageKey ? { ...prev, overStageKey: null } : prev,
      );
    }
  }, []);

  const handleColumnDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleColumnDrop = useCallback(
    async (e: React.DragEvent, toStage: string) => {
      e.preventDefault();
      dragCounterRef.current = {};
      setDragState({ dragging: null, overStageKey: null });

      let payload: DragPayload;
      try {
        payload = JSON.parse(e.dataTransfer.getData("application/json"));
      } catch {
        return;
      }

      if (payload.fromStage === toStage) return;

      const app = findApp(payload.appId);
      if (!app) return;

      if (needsConfirmation(toStage)) {
        setPendingTransition({ app, fromStage: payload.fromStage, toStage });
      } else {
        try {
          await updateStage(app.id, toStage, "");
          onBoardUpdated();
        } catch (err) {
          console.error("Failed to update stage:", err);
        }
      }
    },
    [findApp, onBoardUpdated],
  );

  const handleTransitionConfirm = useCallback(() => {
    setPendingTransition(null);
    onBoardUpdated();
  }, [onBoardUpdated]);

  const handleTransitionCancel = useCallback(() => {
    setPendingTransition(null);
  }, []);

  return {
    dragState,
    pendingTransition,
    handleDragStart,
    handleDragEnd,
    handleColumnDragEnter,
    handleColumnDragLeave,
    handleColumnDragOver,
    handleColumnDrop,
    handleTransitionConfirm,
    handleTransitionCancel,
  };
}
