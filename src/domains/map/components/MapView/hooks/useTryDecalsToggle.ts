import { useEffect, useState } from "react";

export function useTryDecalsToggle() {
  const [tryDecalsOpened, setTryDecalsOpened] = useState(false);

  useEffect(() => {
    const handleToggleTryDecals = () => {
      setTryDecalsOpened((prev) => !prev);
    };

    window.addEventListener("toggleTryDecals", handleToggleTryDecals);
    return () => {
      window.removeEventListener("toggleTryDecals", handleToggleTryDecals);
    };
  }, []);

  return { tryDecalsOpened, setTryDecalsOpened };
}
