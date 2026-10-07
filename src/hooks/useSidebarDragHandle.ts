import { useEffect, useState } from "react";

const MIN_WIDTH_PERCENT = 15;
const MAX_WIDTH_PERCENT = 50;

export function useSidebarDragHandle(initialWidth = 25) {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);

  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const containerWidth = window.innerWidth;
      const widthPercent =
        ((containerWidth - e.clientX) / containerWidth) * 100;
      setSidebarWidth(
        Math.max(MIN_WIDTH_PERCENT, Math.min(MAX_WIDTH_PERCENT, widthPercent)),
      );
    };
    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  return { sidebarWidth, isDragging, handleSidebarMouseDown };
}
