import { useCallback, useRef, useState } from "react";

interface ResizablePanelOptions {
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  /** Below this threshold the panel snaps to collapsed */
  collapseThreshold: number;
  onCollapseChange?: (collapsed: boolean) => void;
}

interface ResizablePanelState {
  width: number;
  collapsed: boolean;
  isDragging: boolean;
  handlePointerDown: (e: React.PointerEvent) => void;
  setCollapsed: (collapsed: boolean) => void;
}

export default function useResizablePanel({
  defaultWidth,
  minWidth,
  maxWidth,
  collapseThreshold,
  onCollapseChange,
}: ResizablePanelOptions): ResizablePanelState {
  const [width, setWidth] = useState(defaultWidth);
  const [collapsed, setCollapsedRaw] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const widthBeforeCollapse = useRef(defaultWidth);
  const startX = useRef(0);
  const startW = useRef(0);

  const setCollapsed = useCallback(
    (value: boolean) => {
      setCollapsedRaw(value);
      onCollapseChange?.(value);
      if (!value) {
        setWidth(widthBeforeCollapse.current);
      }
    },
    [onCollapseChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (collapsed) return;
      e.preventDefault();
      startX.current = e.clientX;
      startW.current = width;
      setIsDragging(true);

      const onPointerMove = (ev: PointerEvent) => {
        const delta = ev.clientX - startX.current;
        const next = startW.current + delta;

        if (next < collapseThreshold) {
          widthBeforeCollapse.current = startW.current;
          setCollapsedRaw(true);
          onCollapseChange?.(true);
          setIsDragging(false);
          cleanup();
          return;
        }

        setWidth(Math.min(maxWidth, Math.max(minWidth, next)));
      };

      const onPointerUp = () => {
        setIsDragging(false);
        cleanup();
      };

      const cleanup = () => {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [collapsed, width, minWidth, maxWidth, collapseThreshold, onCollapseChange],
  );

  return { width, collapsed, isDragging, handlePointerDown, setCollapsed };
}
