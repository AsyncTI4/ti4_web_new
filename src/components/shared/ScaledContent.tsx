import {
  CSSProperties,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box } from "@mantine/core";

type ScaledContentProps = {
  zoom: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  enabled?: boolean;
};

type ContentSize = {
  width: number;
  height: number;
};

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function ScaledContent({
  zoom,
  children,
  className,
  style,
  innerClassName,
  innerStyle,
  enabled = true,
}: ScaledContentProps) {
  if (!enabled) {
    return (
      <Box className={className} style={{ ...style, ...innerStyle }}>
        {children}
      </Box>
    );
  }

  const innerRef = useRef<HTMLDivElement | null>(null);
  const [contentSize, setContentSize] = useState<ContentSize>({
    width: 0,
    height: 0,
  });

  useIsoLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) {
      return;
    }

    const applySize = (width: number, height: number) => {
      setContentSize((prev) => {
        if (prev.width === width && prev.height === height) {
          return prev;
        }
        return { width, height };
      });
    };

    const readSize = () => {
      applySize(node.offsetWidth, node.offsetHeight);
    };

    readSize();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const { width, height } = entry.contentRect;
      applySize(width, height);
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const scaledDimensions = useMemo<ContentSize>(
    () => ({
      width: contentSize.width * zoom,
      height: contentSize.height * zoom,
    }),
    [contentSize.height, contentSize.width, zoom]
  );

  const outerStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    ...style,
    width: Math.ceil(scaledDimensions.width),
    height: scaledDimensions.height,
  };

  const innerBaseStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    transform: `scale(${zoom})`,
    transformOrigin: "top left",
    display: "inline-block",
  };

  const mergedInnerStyle: CSSProperties = innerStyle
    ? { ...innerBaseStyle, ...innerStyle }
    : innerBaseStyle;

  return (
    <div className={className} style={outerStyle}>
      <div ref={innerRef} className={innerClassName} style={mergedInnerStyle}>
        {children}
      </div>
    </div>
  );
}
