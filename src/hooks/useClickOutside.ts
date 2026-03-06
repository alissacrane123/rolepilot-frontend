import { useEffect, useRef, type RefObject } from "react";

export default function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
): void {
  const refsRef = useRef(refs);
  refsRef.current = refs;

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    function handleMouseDown(e: MouseEvent): void {
      const isOutside = refsRef.current.every(
        (ref) => !ref.current || !ref.current.contains(e.target as Node),
      );
      if (isOutside) handlerRef.current();
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);
}
