import { useRef } from "react";

export function useInstance<T>(instance: T): [T, (v: T) => void] {
  const ref = useRef(instance);

  const replace = (next: T) => {
    ref.current = next;
  };

  return [ref.current, replace];
}
