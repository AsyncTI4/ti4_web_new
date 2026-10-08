import {
  createContext,
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
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

/**
 * The scale of the nearest enclosing ScaledContent, 1 outside of one. Portaled
 * overlays read it to match the size of the content they were opened from.
 */
const ContentScaleContext = createContext(1);

export function useContentScale() {
  return useContext(ContentScaleContext);
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function ScaledContent({
  enabled = true,
  ...props
}: ScaledContentProps) {
  if (!enabled) {
    const { className, style, innerStyle, children } = props;
    return (
      <Box className={className} style={{ ...style, ...innerStyle }}>
        {children}
      </Box>
    );
  }

  return <ZoomScaledContent {...props} />;
}

function ZoomScaledContent({
  zoom,
  children,
  className,
  style,
  innerClassName,
  innerStyle,
}: Omit<ScaledContentProps, "enabled">) {
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

  const outerStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    ...style,
    width: Math.ceil(contentSize.width * zoom),
    height: contentSize.height * zoom,
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
        <ContentScaleContext value={zoom}>{children}</ContentScaleContext>
      </div>
    </div>
  );
}
