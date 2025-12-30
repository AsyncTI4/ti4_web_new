import { cdnImage } from "@/data/cdnImage";

/**
 * Renders the dimensional tear (gravity rift) token underneath Cabal space docks.
 * Per the Cabal ability: "Place a dimensional tear token beneath this unit as a reminder."
 */
export function DimensionalTearToken() {
  return (
    <img
      src={cdnImage("/tokens/token_gravityrift.png")}
      alt="Dimensional Tear"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "60px",
        zIndex: -1,
        opacity: 0.9,
      }}
    />
  );
}

