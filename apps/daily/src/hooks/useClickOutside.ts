import { type RefObject, useCallback, useEffect } from "react";

export function useClickOutside(
  elementRef: RefObject<HTMLElement | null>,
  callback: (event: MouseEvent) => void
) {
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        callback(event);
      }
    },
    [callback, elementRef]
  );

  useEffect(() => {
    addEventListener("click", handleClick);
    return () => removeEventListener("click", handleClick);
  }, [handleClick]);
}
