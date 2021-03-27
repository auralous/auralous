import { useCallback, useState } from "react";

export default function useModal() {
  const [active, setActive] = useState(false);
  const open = useCallback(() => setActive(true), []);
  const close = useCallback(() => setActive(false), []);
  return [active, open, close] as const;
}
