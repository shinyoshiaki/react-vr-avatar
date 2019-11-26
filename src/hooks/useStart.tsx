import { useRef } from "react";

export const useStart = (cb: () => void) => {
  const first = useRef(true);
  if (first.current) {
    cb();
    first.current = false;
  }
};
