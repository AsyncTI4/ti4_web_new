import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function PinchZoomMap({ imageUrl }) {
  const [imageNaturalWidth, setImageNaturalWidth] = useState(0);
  const [imageNaturalHeight, setImageNaturalHeight] = useState(0);
  const scaleUp = true;

  const [container, setContainer] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const handleResize = useCallback(() => {
    if (container !== null) {
      const rect = container.getBoundingClientRect();
      setContainerWidth(rect.width);
      setContainerHeight(rect.height);
    } else {
      setContainerWidth(0);
      setContainerHeight(0);
    }
  }, [container]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const handleImageOnLoad = (image) => {
    setImageNaturalWidth(image.naturalWidth);
    setImageNaturalHeight(image.naturalHeight);
  };

  useEffect(() => {
    if (!imageUrl) return;
    const image = new Image();
    image.onload = () => handleImageOnLoad(image);
    image.src = imageUrl;
  }, [imageUrl]);

  const imageScale = useMemo(() => {
    if (
      containerWidth === 0 ||
      containerHeight === 0 ||
      imageNaturalWidth === 0 ||
      imageNaturalHeight === 0
    )
      return 0;

    const scale = containerWidth / imageNaturalWidth;
    return scaleUp ? scale : Math.max(scale, 1);
  }, [
    scaleUp,
    containerWidth,
    containerHeight,
    imageNaturalWidth,
    imageNaturalHeight,
  ]);

  useEffect(() => {
    if (!imageUrl) return;
    const image = new Image();
    image.onload = () => handleImageOnLoad(image);
    image.src = imageUrl;
  }, [imageUrl]);

  const initialScale = Math.max(imageScale, 0.3);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
      ref={(el) => setContainer(el)}
    >
      {imageScale > 0 ? (
        <TransformWrapper
          key={`${containerWidth}x${containerHeight}`}
          initialScale={initialScale}
          minScale={Math.min(imageScale, 0.3)}
          maxScale={2}
          centerZoomedOut={false}
          initialPositionX={
            initialScale > imageScale
              ? (-imageNaturalWidth * initialScale) / 6
              : 0
          }
          initialPositionY={(-imageNaturalHeight * initialScale) / 8}
        >
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
            }}
          >
            <img alt="map" src={imageUrl} />
          </TransformComponent>
        </TransformWrapper>
      ) : undefined}
    </div>
  );
}

export default PinchZoomMap;
