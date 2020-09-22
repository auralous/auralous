import { useState } from "react";

export default function useModal() {
  const [active, setActive] = useState(false);
  return [active, () => setActive(true), () => setActive(false)] as const;
}
