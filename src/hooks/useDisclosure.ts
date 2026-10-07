import { useState } from "react";

export function useDisclosure(initial = false) {
  const [opened, setOpened] = useState(initial);
  const toggle = () => setOpened((prev) => !prev);

  return { opened, setOpened, toggle };
}
