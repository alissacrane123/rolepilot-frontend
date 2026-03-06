import { useEffect, type RefObject } from "react";

export default function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
): void {
  useEffect(() => {
    function handleMouseDown(e: MouseEvent): void {
      const isOutside = refs.every(
        (ref) => !ref.current || !ref.current.contains(e.target as Node),
      );
      if (isOutside) handler();
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [refs, handler]);
}
