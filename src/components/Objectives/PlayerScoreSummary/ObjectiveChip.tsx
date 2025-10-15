export function ObjectiveChip({ image, color = 'blue', span = 1 }) {
  // Color mapping with RGB values
  const colorMap = {
    red: { r: 239, g: 68, b: 68 },
    orange: { r: 249, g: 115, b: 22 },
    yellow: { r: 234, g: 179, b: 8 },
    blue: { r: 59, g: 130, b: 246 },
    green: { r: 16, g: 185, b: 129 },
    gray: { r: 107, g: 114, b: 128 },
    teal: { r: 20, g: 184, b: 166 },
  };

  const rgb = colorMap[color] || colorMap.blue;
  const backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
  const borderColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;

  // For squares (span = 1), use fixed width and center
  // For rectangles (span > 1), use full width
  const isSquare = span === 1;

  return (
    <div
      style={{
        width: isSquare ? "60px" : "100%",  // Fixed width for squares
        height: "60px",  // Fixed height for all
        aspectRatio: isSquare ? "1" : `${span}`,
        margin: isSquare ? "0 auto" : "0",  // Center squares
        backgroundColor: backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      {image && (
        <img
          src={image}
          alt="Square content"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      )}
    </div>
  );
};